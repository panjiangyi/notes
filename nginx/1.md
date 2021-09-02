Locate nginx.conf file:

```
nginx -t
```

reset configuration file path

```
nginx -c filename
```

File at /var/run/nginx.pid store the process id of master process of nginx

## Context directives

> Like **events**, **http**, and **server**

### Server

- server_name: the Domain of coming connections which will be handled.
  - use RegRex, prefixing it with a tilde ~;

```nginx
server {
    # 正则的命名分组可被转化成变量用于location中：$domain
    listen 80;  server_name ~^(www\.)?(?<domain>.+)$;  location / {
           root /sites/$domain;
        }
    }
```

- Server that drops requests

```nginx
server {
    listen 80;
    server_name "";
    return 444;
}
```

- default_server

```nginx
server {
        listen 80 default_server;
        server_name foobar.com;
    }
```

#### Location

- root: directory of files will be hosted on internet. **request url path will append to file path**
- alias: similar to root. **but request url path will not append to file path**

- try_files: check orderly following files. uses the first one matched for the request.
  last Parameter of try_files should be an internal redirect (aka: named router) or an explicit error code

- server_tokens off; 不传递服务器版本信息

- error_page 404 /404.html;
- error_page 500 502 503 504 /50x.html;
- error_page 500 http://www.google.com;
- error_page 500 =200 /index.html
  > change 500 to 200, return index.html;
- proxy_set_header: 设置 header

```nginx
location / {
    try_files maintenance.html index.html =404
}
```

- modifier
  - ~ case-sensitive
  - ~\* case-insensitive
  - ^~ once mached, skip other rules.
- Named Location
  for internal redirection.

```nginx
location @foobar {

}
```

- variables
- $uri: contains the normalized (decoded and sanitized)URI of the web request.
- $scheme: coming request scheme. http or https

- basic reverse proxy

```nginx
http {
  upstream rails_app {
      server 127.0.0.1:3000;
  }
  server {
      listen *:80;
      root /path/to/application/public;
      location / {
        proxy_pass http://rails_app;
      }
    }
}
```
