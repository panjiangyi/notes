//获得控制点
var drawArc = function (point1, point2, dis, bol) {
  //这是一个比较复杂的几何问题，下面我们来解决一下,先声明四个点，p,p1,p2,p0,分别代表绘制曲线点，任意的两个点及p1,p2的中心点p0。
  var p, p1, p2, p0;
  //声明变量用以存储计算结果，分别是p1,p2的x坐标的差和y坐标的差及p,p0的x坐标差，y坐标差
  var dx, dy;
  //让我们来赋值一下，运用一下最基本的坐标计算
  dx = point2.x - point1.x;
  dy = point2.y - point1.y;
  //以下结果是通过线性方程计算而来。初中学过的哟。
  p0 = {
    x: 0,
    y: 0,
  };
  (p0.x = (point2.x + point1.x) * 0.5), (p0.y = (point2.y + point1.y) * 0.5);
  //这个p点，就是我们要计算的结果，有了这个点，就能绘制这个弧线了。
  p = {
    x: 0,
    y: 0,
  };
  //我们来定义两个变量，分别代表p的x方向的坐标及y方向的坐标
  var px, py;
  //根据勾股定理(px-p0.x)*(px-p0.x)+(py-p0.y)*(py-p0.y)=dis*dis
  var k = dx / dy,
    bb = p0.x * k + p0.y;
  var a = 1 + k * k;
  var b = -2 * (p0.x + k * bb - k * p0.y);
  var c = p0.x * p0.x + p0.y * p0.y + bb * bb - 2 * bb * p0.y - dis * dis;
  //上面的a,b,c是二次方程中的a,b,c常数项，就是我们常说的ax^2+bx+c=0;
  if (bol) {
    px = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    py = -k * px + bb;
  } else {
    px = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    py = -k * px + bb;
  }
  (p.x = px), (p.y = py);
  return p; //控制点
};
//获得二次贝塞尔曲线每一点坐标和角度.
var Bezier = function () {
  //  对外变量
  var p_start = {
    x: 0,
    y: 0,
  }; // 起点
  var p_ctrl = {
    x: 0,
    y: 0,
  }; // 贝塞尔点
  var p_over = {
    x: 0,
    y: 0,
  }; // 终点
  var step; // 分割份数

  //  辅助变量
  var ax;
  var ay;
  var bx;
  var by;
  var A;
  var B;
  var C;
  var total_length; // 长度

  //  速度函数
  var s = function (t) {
    return Math.sqrt(A * t * t + B * t + C);
  };

  //  长度函数
  var L = function (t) {
    var temp_ctrl = Math.sqrt(C + t * (B + A * t));
    var temp_over = 2 * A * t * temp_ctrl + B * (temp_ctrl - Math.sqrt(C));
    var temp3 = Math.log(B + 2 * Math.sqrt(A) * Math.sqrt(C));
    var temp4 = Math.log(B + 2 * A * t + 2 * Math.sqrt(A) * temp_ctrl);
    var temp5 = 2 * Math.sqrt(A) * temp_over;
    var temp6 = (B * B - 4 * A * C) * (temp3 - temp4);
    return (temp5 + temp6) / (8 * Math.pow(A, 1.5));
  };

  //  长度函数反函数，使用牛顿切线法求解
  var InvertL = function (t, l) {
    var t1 = t;
    var t2;
    do {
      t2 = t1 - (L(t1) - l) / s(t1);
      if (Math.abs(t1 - t2) < 0.000001) {
        break;
      }
      t1 = t2;
    } while (true);
    return t2;
  };

  //  返回所需总步数 (前3个是point)
  var init = function ($p_start, $p_ctrl, $p_over, $speed) {
    p_start = $p_start;
    p_ctrl = $p_ctrl;
    p_over = $p_over;
    //step = 30;
    ax = p_start.x - 2 * p_ctrl.x + p_over.x;
    ay = p_start.y - 2 * p_ctrl.y + p_over.y;
    bx = 2 * p_ctrl.x - 2 * p_start.x;
    by = 2 * p_ctrl.y - 2 * p_start.y;
    A = 4 * (ax * ax + ay * ay);
    B = 4 * (ax * bx + ay * by);
    C = bx * bx + by * by;
    //  计算长度
    total_length = L(1);
    //  计算步数
    step = Math.floor(total_length / $speed);
    if (total_length % $speed > $speed / 2) {
      step++;
    }
    return step;
  };

  // 根据指定nIndex位置获取锚点：返回坐标和角度
  var getAnchorPoint = function (nIndex) {
    if (nIndex >= 0 && nIndex <= step) {
      var t = nIndex / step;
      //  如果按照线行增长，此时对应的曲线长度
      var l = t * total_length;
      //  根据L函数的反函数，求得l对应的t值
      t = InvertL(t, l);
      //  根据贝塞尔曲线函数，求得取得此时的x,y坐标
      var xx =
        (1 - t) * (1 - t) * p_start.x +
        2 * (1 - t) * t * p_ctrl.x +
        t * t * p_over.x;
      var yy =
        (1 - t) * (1 - t) * p_start.y +
        2 * (1 - t) * t * p_ctrl.y +
        t * t * p_over.y;
      //  获取切线
      var Q0 = {
        x: (1 - t) * p_start.x + t * p_ctrl.x,
        y: (1 - t) * p_start.y + t * p_ctrl.y,
      };
      var Q1 = {
        x: (1 - t) * p_ctrl.x + t * p_over.x,
        y: (1 - t) * p_ctrl.y + t * p_over.y,
      };
      //  计算角度
      var dx = Q1.x - Q0.x;
      var dy = Q1.y - Q0.y;
      var radians = Math.atan2(dy, dx);
      var degrees = (radians * 180) / Math.PI;
      xx = parseInt(xx * 10) / 10;
      yy = parseInt(yy * 10) / 10;
      degrees = parseInt(degrees * 10) / 10;
      return [xx, yy, degrees];
    } else {
      return [];
    }
  };

  return {
    getStep: init,
    getAnchorPoint: getAnchorPoint,
  };
};
