1. 配置文件：etc/nginx/nginx.conf

```nginx
# 运行用户
user  nginx;
# 进程数，和cpu核心数写成一样
worker_processes  1;
# 错误日志
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    #最大并发数
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    #日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #超时时间
    keepalive_timeout  65;

    #是否开启gzip
    #gzip  on;
		# 子配置项位置
    include /etc/nginx/conf.d/*.conf;
}

```

2. 子配置项 /etc/nginx/conf.d/default.conf

```nginx
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        #拒或允许某ip访问
        #deny 192.11.11.11
        #allow 192.11.11.11
    }

    location /test {

    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

3. 启动、关闭、重启

- 启动: 输入命令 nginx
- 停止: nginx -s quit
- 立即停止: nginx -s stop
- 重启: systemctl restart nginx.service
- 重载配置文件: nginx -s reload
