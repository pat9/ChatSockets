const app = require('express')();
const http = require('http').createServer(app);
const p2p = require('socket.io-p2p-server').Server
const io = require('socket.io')(http)
const path = require('path')
io.use(p2p)

app.use(require('express').static(path.join(__dirname,'/public')))

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/index.html');
})
app.get('/audio', (req, res) =>{
    res.sendFile(__dirname + '/public/audio.html');
})

io.on('connection', function(socket){
    console.log('a user connected');

    socket.join(socket.handshake.query.room);

    socket.on('start-stream', function (data) {
        console.log('Stream started')
        console.log(data)
        socket.broadcast.emit('start-stream', data)
    })

    socket.on('chat', (data) =>{
        console.log(data)
        io.to(data.room).emit('mensaje',data.mensaje)
    })

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(process.env.PORT || 5000, () => console.log('In Port '+process.env.PORT || 5000))