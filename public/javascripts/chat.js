 $(function () {
    var content = $('#content');
    var status = $('#status');
    var input = $('#input');
    var discon = $('#discon');
    var recon = $('#recon');
    var myName = false;

    //建立websocket连接
    socket = io.connect('http://58.198.183.166:3001');
    //收到server的连接确认
    socket.on('open',function(){
        status.text('Choose a name:');
    });

    //监听system事件，判断welcome或者disconnect，打印系统消息信息
    socket.on('system',function(json){
        var p = '';
        if (json.type === 'welcome'){
            if(myName==json.text) status.text(myName + ': ').css('color', json.color);
            p = '<p style="background:'+json.color+'">system  @ '+ json.time+ ' : Welcome ' + json.text +'</p>';
        }else if(json.type == 'disconnect'){
            p = '<p style="background:'+json.color+'">system  @ '+ json.time+ ' : Bye ' + json.text +'</p>';
        }
        content.prepend(p); 
    });

    //监听message事件，打印消息信息
    socket.on('message',function(json){
        var p = '<p><span style="color:'+json.color+';">' + json.author+'</span> @ '+ json.time+ ' : '+json.text+'</p>';
        content.prepend(p);
    });

    //通过“回车”提交聊天信息
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) return;
            socket.send(msg);
            $(this).val('');
            if (myName === false) {
                myName = msg;
            }
        }
    });

    discon[0].onclick=function(){
        socket.send("我下线了！");
        socket.close();

    }

    recon[0].onclick=function(){
        //socket.send("新用户");
        socket.connect();

    }


});