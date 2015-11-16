$(function(){
    var content = $('#content');
    var status = $('#status');
    var input = $('#input');
    var myName = false;

    socket=io.connect("http://58.198.183.166:3000");
    socket.on('open',function(){
      status.text('Choose a name:');
    })

    socket.on('system',function(json){
        var p="";
        if (json.type === 'welcome'){
            if(myName==json.text) status.text(myName + ': ').css('color', json.color);
            p = '<p style="background:'+json.color+'">system  @ '+ json.time+ ' : Welcome ' + json.text +'</p>';
        }else if(json.type == 'disconnect'){
            p = '<p style="background:'+json.color+'">system  @ '+ json.time+ ' : Bye ' + json.text +'</p>';
        }
        content.prepend(p); 
    });

    socket.on('message',function(json){
        var p='<p><span style="color:'+json.color+';">' + json.author+'</span> @ '+ json.time+ ' : '+json.text+'</p>';
        content.prepend(p);
        
        renderPoint(json.text,map.layers[1]);
    })

    var renderPoint=function(json,layer){

        if( layer instanceof OpenLayers.Layer.Vector && json instanceof Array){
            var pGeom=new OpenLayers.Geometry.Point(json[0],json[1]);
            var pFea=new OpenLayers.Feature.Vector(pGeom);
            for (var i = layer.features.length - 1; i >= 0; i--) {
                layer.features[i].renderIntent="default";
            };

            layer.addFeatures(pFea);
            map.panTo(new OpenLayers.LonLat(json[0],json[1]));
            var nums=layer.features.length;            
            layer.features[nums-1].renderIntent="select";
            layer.redraw();
        }
    }

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

    

});