const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', function(socket){
    console.log('a user connected');

    socket.join(socket.handshake.query.room);

    socket.on('chat', (data) =>{
        console.log(data)
        io.to(data.room).emit('mensaje',data.mensaje)
    })

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen('5000', () => console.log('In Port 5000'))