window.AudioContext = window.AudioContext || window.webkitAudioContext

var socket = io()
var p2p = new P2P(socket)
var startButton = document.getElementById('start-stream')

p2p.on('start-stream', function () {
  p2p.usePeerConnection = true
  startButton.setAttribute('disabled', true)
})

p2p.on('stream', function (stream) {
  var audio = document.querySelector('audio')
  audio.src = window.URL.createObjectURL(stream)
  audio.play()
})

function startStream () {
  navigator.permissions.query({name:'microphone'}).then(function(result) {
    if (result.state == 'granted') {
  
    } else if (result.state == 'prompt') {
  
    } else if (result.state == 'denied') {
  
    }
    result.onchange = function() {
      startButton.setAttribute('disabled', true)
      navigator.getUserMedia({ audio: true }, function (stream) {
        var audioContext = new window.AudioContext()
        var mediaStreamSource = audioContext.createMediaStreamSource(stream)
        var mediaStreamDestination = audioContext.createMediaStreamDestination()
        mediaStreamSource.connect(mediaStreamDestination)
    
        var socket = io()
        var p2p = new P2P(socket, {peerOpts: {stream: mediaStreamDestination.stream}})
    
        p2p.on('ready', function () {
          p2p.usePeerConnection = true
        })
    
        p2p.emit('ready', { peerId: p2p.peerId })
      }, function (err) {
        console.log(err)
      })
    };
  });
 
}

startButton.addEventListener('click', startStream)