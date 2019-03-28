const app = require("express")();
//const http = require("http").Server(app);
//const io = require("socket.io")(http);
var dbSql = require("./db");

var clubs = require("./routes/clubsDetails");
var events = require("./routes/eventsDetails");
var djsDetails = require("./routes/djsDetails");
var offersDetails = require("./routes/offersDetails");

process.env.UV_THREADPOOL_SIZE = 128;

var render = function(results) {
  for (var i in results) console.log(results[i].Name);
};

app.get("/clubsDetails", function(req, res) {
  var city = req.query.city;
  clubs
    .getClubsDetails(city)
    .then(function(results) {
      console.log(results);
      res.send(JSON.stringify(results));
    })
    .catch(function(err) {
      console.log("Promise rejection error: " + err);
    });
});

app.get("/eventsDetails", function(req, res) {
  var eventDate = req.query.eventDate;
  events
    .getEventsDetails(eventDate)
    .then(function(results) {
      res.send(results);
      console.log(JSON.stringify(results));
    })
    .catch(function(err) {
      console.log("Promise rejection error: " + err);
    });

  var statcode = res.statusCode;

  res.on("data", function() {});
  //You need to implement the response's end not the requests 'end'.
  //And it needs to be inside the callback so you can access the response.
  res.on("end", function() {
    console.log("Status Code: " + statcode);
  });
});

app.get("/offersDetails", function(req, res) {
    var city = req.query.city;
    offersDetails
      .getOffersDetails(city)
      .then(function(results) {
        res.send(results);
        console.log(JSON.stringify(results));
      })
      .catch(function(err) {
        console.log("Promise rejection error: " + err);
      });
  
    var statcode = res.statusCode;
  
    res.on("data", function() {});
    //You need to implement the response's end not the requests 'end'.
    //And it needs to be inside the callback so you can access the response.
    res.on("end", function() {
      console.log("Status Code: " + statcode); 
    });
  });

  app.get("/djDetails", function(req, res) {
    var city = req.query.city;
    djsDetails
      .getAllDJsDetails(city)
      .then(function(results) {
        res.send(results);
        console.log(JSON.stringify(results));
      })
      .catch(function(err) {
        console.log("Promise rejection error: " + err);
      });
  
    var statcode = res.statusCode;
  
    res.on("data", function() {});
    //You need to implement the response's end not the requests 'end'.
    //And it needs to be inside the callback so you can access the response.
    res.on("end", function() {
      console.log("Status Code: " + statcode); 
    });
  });

  



// io.on("connection", function(socket) {
//   console.log("a user connected");
// });

// setInterval(() => {
//   io.emit("ping", { data: new Date() / 1 });
// }, 1000);

app.listen(6000, function() {
  console.log("listening on *:6000");
});




// Error: read ETIMEDOUT
//     at _errnoException (util.js:1022:11)
//     at TCP.onread (net.js:615:25)