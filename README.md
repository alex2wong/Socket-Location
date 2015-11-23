# Socket-Location
### It is about websocket and location display

 用到了socket-io，改编自 张丹老师的Demo: https://github.com/bsspirit/chat-websocket 
 在后台加载 socket.io包监听server所在端口，添加对message 和disconnect 等事件的监听，并注册响应函数。
 ```javascript
  //主要结构如下
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);
  //一旦有客户端连接 server，后台获得socket实例，有message, disconnect等事件
  io.on('connection', function(socket) {
    socket.emit('open'); //通知客户端已连接
    
    socket.on('message', function(msg){
      //msg 是客户端send 过来的消息, server 利用 emit 方法向客户端发送消息
      socket.emit('system',obj);
      socket.emit('message',obj);
    }
    socket.on("disconnect", function(){
      socket.broadcast.emit('system', obj);
      console.log(client.name + 'Disconnect');
    })
    
  }
 ```
地图绘制采用 OpenLayers 的矢量图层，Canvas绘制后台实时发送来的随机点

