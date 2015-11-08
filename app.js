//引入程序包
var express = require('express'),
  path = require('path'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);


//设置日志级别
io.set('log level', 1);

//WebSocket连接监听
io.on('connection', function(socket) {
  socket.emit('open'); //通知客户端已连接


  // 打印握手信息
  // console.log(socket.handshake);

  // 构造客户端对象
  var client = {
    socket: socket,
    name: false,
    color: getColor()
  }

  //构造计时器
  var timer1;

  // 对message事件的监听
  socket.on('message', function(msg) {
    var obj = {
      time: getTime(),
      color: client.color
    };

    // 判断是不是第一次连接，以第一条消息作为用户名
    if (!client.name) {
      client.name = msg;
      obj['text'] = client.name;
      obj['author'] = 'System';
      obj['type'] = 'welcome';
      console.log(client.name + ' login');

      //返回欢迎语
      socket.emit('system', obj);
      //广播新用户已登陆
      socket.broadcast.emit('system', obj);      

    } else {

      //如果不是第一次的连接，正常的聊天消息
      obj['text'] = randInfo();
      obj['author'] = client.name;
      obj['type'] = 'message';
      console.log(client.name + ' say: ' + msg);

      // 返回消息（可以省略）
      socket.emit('message', obj);
      // 广播向其他用户发消息
      socket.broadcast.emit('message', obj);

      //模拟实时坐标数据，emit到浏览器
      timer1 = setInterval(function(){ 
        obj['text'] = randInfo();
        obj['time'] = getTime();
        socket.emit('message',obj);
        console.log(' virtual points: ' + obj['text'][0].toString()+ "," +obj['text'][1].toString() );

      },1000)

    }
  });

  //监听出退事件
  socket.on('disconnect', function() {
    var obj = {
      time: getTime(),
      color: client.color,
      author: 'System',
      text: client.name,
      type: 'disconnect'
    };

    // 广播用户已退出
    socket.broadcast.emit('system', obj);
    clearInterval(timer1);
    console.log(client.name + 'Disconnect');
  });

});

//express基本配置
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

// 指定webscoket的客户端的html文件
app.get('/', function(req, res) {
  res.sendfile('views/geojson.html');
});

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

//随机生成坐标点，模拟实时坐标数据
var randInfo = function() {
  var lng = Math.random() * 90;
  var lat = Math.random() * 40;
  var point = [lng, lat];
  return point;
}

var getTime = function() {
  var date = new Date();
  return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

var getColor = function() {
  var colors = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'pink', 'red', 'green',
    'orange', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue'
  ];
  return colors[Math.round(Math.random() * 10000 % colors.length)];
}