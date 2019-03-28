var express = require("express");
var mysql = require("mysql");
var bodyParser     =         require("body-parser");
var EventEmitter = require('events');
const emitter = new EventEmitter()
emitter.setMaxListeners(0)
var app = express();

app.use(bodyParser.json());

var pool = mysql.createPool({
  connectionLimit: 200, //important
  host: "199.180.133.121",
  port: "3306",
  user: "root",
  password: "vichi123",
  database: "guestlist",
  //connectionLimit: 0,
  queueLimit: 0,
  debug: false,
  acquireTimeout:120000,
  _socket  : '/var/run/mysqld/mysqld.sock',
});

function handle_database(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      res.json({ code: 100, status: "Error in connection database" });
      return;
    }

    console.log("connected as id " + connection.threadId);

    connection.query("select * from events", function(err, rows) {
      connection.release();
      if (!err) {
        console.log(rows);
        res.json(rows);
      }
    });

    connection.on("error", function(err) {
      res.json({ code: 100, status: "Error in connection database" });
      return;
    });
  });
}


function getClubsDetails(req, res) {
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from clubs", function(err, rows) {
        connection.release();
        if (!err) {
            console.log(rows);
            //res.json(rows);
            res.send(JSON.stringify(rows));
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        return;
      });
    });
  }

  function getEventsDetails(req, res) {
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from events", function(err, rows) {
        connection.release();
        if (!err) {
            console.log(rows);
            //res.json(rows);
            res.send(JSON.stringify(rows));
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        return;
      });
    });
  }

  function getOffersDetails(req, res) {
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from offers", function(err, rows) {
        connection.release();
        if (!err) {
            console.log(rows);
            //res.json(rows);
            res.send(JSON.stringify(rows));
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        return;
      });
    });
  }


  function getDJsDetails(req, res) {
    var city = req.query.city;
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from djtable", [city],function(err, rows) {
        connection.release();
        if (!err) {
            console.log(rows);
            //res.json(rows);
            res.send(JSON.stringify(rows));
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        return;
      });
    });
  }


  function getTicketDetails(req, res) {
    var clubid = req.query.clubid;
    var eventDate = "19/Mar/2019";//req.query.eventDate;
    console.log("eventDate " + eventDate);
    console.log("clubid " + clubid);
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from ticketdetails where clubid = ? and date = ?", [clubid, eventDate],function(err, rows) {
        connection.release();
        if (!err) {
            console.log(rows);
            //res.json(rows);
            res.send(JSON.stringify(rows));
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        return;
      });
    });
  }


  

  function bookTicket(req, res) {
    var clubid = req.body.clubid;
    // var eventDate = "19/Mar/2019";//req.query.eventDate;
    // console.log("eventDate " + eventDate);
    console.log("post data " + JSON.stringify(req.body));
    console.log("post data " + clubid);
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        return;
      }
  
      console.log("connected as id " + connection.threadId);
      var testSQL = "INSERT INTO ticketbookingdetails (bookingid , userid) VALUES(?,?)"
      var insertSQL = "INSERT INTO ticketbookingdetails (bookingid , userid , mobilenumber , "+
                    " email , clubid , clubname , eventid , eventname , eventdate , imageurl, postedby  ,"+
                    " offerid , tablediscountamt , tablediscountpercentage ,  passdiscountamt , "+
                    " passdiscountpercentage ,  totalprice , priceafterdiscount , paidamount , "+
                    " remainingamount , guestlistgirlcount , guestlistcouplecount , passcouplecount , "+
                    " passstagcount , tablenumber , tablepx , transactionnumber , paymentstatusmsg, bookingconfirm , "+
                    " termncondition , latlong , qrcode , bookingdate ,  bookingtimestamp )"+
                    "VALUES(?,?,?,?,?,  ?,?,?,?,?,  ?,?,?,?,?,  ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?,  ?,?,?,?)";
      connection.query(insertSQL, [req.body.bookingid , req.body.userid , req.body.mobilenumber , 
        req.body.email , req.body.clubid , req.body.clubname , req.body.eventid , req.body.eventname , req.body.eventdate , req.body.imageurl,
        req.body.postedby  , req.body.offerid , req.body.tablediscountamt , req.body.tablediscountpercentage , 
        req.body.passdiscountamt , req.body.passdiscountpercentage , 
        req.body.totalprice , req.body.priceafterdiscount , req.body.paidamount , 
        req.body.remainingamount , req.body.guestlistgirlcount , req.body.guestlistcouplecount , req.body.passcouplecount , 
        req.body.passstagcount , req.body.tablenumber ,
        req.body.tablepx , req.body.transactionnumber , req.body.paymentstatusmsg, req.body.bookingconfirm , 
        req.body.termncondition , req.body.latlong , req.body.qrcode , req.body.bookingdate , 
        req.body.bookingtimestamp],  function(err, rows) {
        connection.release();
        if (!err) {
            console.log("success");
            //res.json(rows);
            res.send(JSON.stringify("success"));
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        return;
      });
    });
  }
  

app.get("/", function(req, res) {
  handle_database(req, res);
});

app.get("/clubsDetails", function(req, res) {
    getClubsDetails(req, res);
  });

  app.get("/eventsDetails", function(req, res) {
    getEventsDetails(req, res);
  });

  app.get("/offersDetails", function(req, res) {
    getOffersDetails(req, res);
  });

  app.get("/djDetails", function(req, res) {
    getDJsDetails(req, res);
  });

  app.get("/ticketDetails", function(req, res) {
    getTicketDetails(req, res);
  });

  
  app.post("/bookTicket", function(req, res) {
    bookTicket(req, res);
  });

  app.listen(6000, function() {
    console.log("listening on *:6000");
  });
