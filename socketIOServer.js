var io = require("socket.io");
var sockets = io.listen(9090);
var db = require('./db.js');
var clubs = require("./routes/clubsDetails");

// serveur socket.io
sockets.on('connection', function (socket) {
    console.log("a user connected");
    socket.on('saveScore', function (data) {
      // actions executed when a message is received
      console.log(data);
      clubs
      .getClubsDetails()
      .then(function(results) {
        console.log(results);
        socket.emit('message',results);
        console.log("message sent to client");
      })
      .catch(function(err) {
        console.log("Promise rejection error: " + err);
      });
      
    });
  });