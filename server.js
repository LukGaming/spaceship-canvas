const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', (e) => {
    console.log(e.id)
    e.on('movendoMouse', movendoMouse)
    function movendoMouse(event){
        console.log('Canvas no eixo X: '+ event.x)
        console.log('Canvas no eixo Y; '+ event.y)
        console.log(event)
        e.broadcast.emit('updatePosition', event)
    }
 });
server.listen(3000);