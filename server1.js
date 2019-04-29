var express = require("express");
var mysql = require("mysql");
var bodyParser     =         require("body-parser");
var EventEmitter = require('events');
var async = require('async');

const emitter = new EventEmitter()
emitter.setMaxListeners(0)
var app = express();
// ADD THIS
// var cors = require('cors');
// app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());

var multipleStatementsconnection = mysql.createConnection({
  host: "199.180.133.121",
  port: "3306",
  user: "root",
  password: "vichi123",
  //database: "guestlist",//TEST
  database: "guestlistprod",//Prod
  multipleStatements: true,
});

var pool = mysql.createPool({
  connectionLimit: 200, //important
  host: "199.180.133.121",
  port: "3306",
  user: "root",
  password: "vichi123",
  //database: "guestlist", 
  database: "guestlistprod",//Prod
  //connectionLimit: 0,
  queueLimit: 0,
  debug: false,
  acquireTimeout:20000,
  connectTimeout: 20000,
  //waitForConnections:false,
  multipleStatements: true,
  _socket  : '/var/run/mysqld/mysqld.sock',
});



pool.getConnection((err, connection) => {
  if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connection was closed.')
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database has too many connections.')
      }
      if (err.code === 'ECONNREFUSED') {
          console.error('Database connection was refused.')
      }

      if (err.code === 'ETIMEDOUT') {
        console.error('Database connection time out.');

        pool = mysql.createPool({
          connectionLimit: 200, //important
          host: "199.180.133.121",
          port: "3306",
          user: "root",
          password: "vichi123",
          database: "guestlist",
          //connectionLimit: 0,
          queueLimit: 0,
          debug: false,
          acquireTimeout:20000,
          connectTimeout: 20000,
          multipleStatements: true,
          //waitForConnections:false,
          _socket  : '/var/run/mysqld/mysqld.sock',
        });
        console.error('New Database Pool connection created');
    }
  }
  if (connection) connection.release()
  return
})

pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
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
  var city = req.query.city;
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from clubs where city=?", [city], function(err, rows) {
        connection.release();
        if (!err) {
            console.log(rows);
            //res.json(rows);
            res.send(JSON.stringify(rows));
            res.end();
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      });
    });
  }


  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year , month, day].join('-');
}

function getEventsDetailsOfOneClub(req, res) {// greater then yesterday date and city
    var clubid = req.query.clubid;
    console.log('getEventsDetails: clubid='+clubid);
    var today = formatDate(new Date());   
    console.log('getEventsDetails: today='+today);
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from events where clubid = ? and STR_TO_DATE(eventdate ,'%d/%b/%Y') >= ?",[clubid, new Date()], function(err, rows) {
       // connection.query("select * from events where clubid = ? ",[clubid], function(err, rows) {
        connection.release();
        if (!err) {
            console.log('getEventsDetails: '+JSON.stringify(rows));
            //res.json(rows);
            res.send(JSON.stringify(rows));
            res.end();
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      });
    });
  }

  


function getEventsDetailsForDJ(req, res) {// greater then yesterday date and city
  var djid = req.query.djid;
  console.log('getEventsDetailsForDJ: djid='+djid);
  var today = formatDate(new Date());   
  console.log('getEventsDetailsForDJ: today='+today);
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      res.json({ code: 100, status: "Error in connection database" });
      res.end();
      return;
    }

    console.log("connected as id " + connection.threadId);

    connection.query("select * from events where djid = ? and STR_TO_DATE(eventdate ,'%d/%b/%Y') >= ?",[djid, new Date()], function(err, rows) {
     // connection.query("select * from events where clubid = ? ",[clubid], function(err, rows) {
      connection.release();
      if (!err) {
          console.log('getEventsDetails: '+JSON.stringify(rows));
          //res.json(rows);
          res.send(JSON.stringify(rows));
          res.end();
      }
    });

    connection.on("error", function(err) {
      res.json({ code: 100, status: "Error in connection database" });
      res.end();
      return;
    });
  });
}

 

  function getEventsDetails(req, res) {// greater then yesterday date and city
    var city = req.query.city;
    console.log('getEventsDetails: city='+city);
    var today = new Date();   
    console.log('getEventsDetails: today='+today);
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      // connection.query("select * from events where city = ? and STR_TO_DATE(eventdate, ,'%d/%b/%Y') >= ?",[city, new Date()], function(err, rows) {
        connection.query("select * from events where city = ? ",[city], function(err, rows) {
        connection.release();
        if (!err) {
            console.log('getEventsDetails: '+JSON.stringify(rows));
            //res.json(rows);
            res.send(JSON.stringify(rows));
            res.end();
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      });
    });
  }

  function getOffersDetails(req, res) {
    var city = req.query.city;
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from offers where city = ?",[city], function(err, rows) {
        connection.release();
        if (!err) {
            console.log(rows);
            //res.json(rows);
            res.send(JSON.stringify(rows));
            res.end();
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
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
        res.end();
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from djtable where city = ?", [city],function(err, rows) {
        connection.release();
        if (!err) {
            console.log(rows);
            //res.json(rows);
            res.send(JSON.stringify(rows));
            res.end();
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      });
    });
  }

  function getTicketDetails(req, res){
    var clubid = req.query.clubid;
    var eventDate = req.query.eventDate;
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }

    connection.query("select * from ticketdetailsbyclubs where clubid = ? and date = ?", [clubid, eventDate],function(err, rows) {
      connection.release();
        if (!err) {  
          res.send(JSON.stringify(rows));
          console.log('getTicketDetails: ticketdetailsbyclubs data: '+JSON.stringify(rows))
          res.end();
        }

      });

    connection.on("error", function(err) {
      res.json({ code: 100, status: "Error in connection database" });
      res.end();
      return;
    });

    });
  }
  

  function getTablesDetails(req, res) {
    var clubid = req.query.clubid;
    var eventDate = req.query.eventDate;
    console.log("eventDate " + eventDate);
    console.log("clubid " + clubid);
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from tablesdata where clubid = ? and eventdate = ?", [clubid, eventDate],function(err, rows) {
        connection.release();
        if (!err) {
            console.log(rows);
            //res.json(rows);
            res.send(JSON.stringify(rows));
            res.end();
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      });
    });
  }

  
  function getBookingDetails(req, res) {
    var userId = req.query.userid;
    
    console.log("clubid " + userId);
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }
  
      console.log("connected as id " + connection.threadId);
  
      connection.query("select * from ticketbookingdetails where userid = ? and bookingconfirm <> 'cancel' ORDER BY eventdateasdate DESC", [userId],function(err, rows) {
        connection.release();
        if (!err) {
            console.log(rows);
            //res.json(rows);
            res.send(JSON.stringify(rows));
            res.end();
        }
      });
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      });
    });
  }



  function getSearchParameter(req, res) {
    
    var city = req.query.city;
      //console.log("connected as id " + connection.threadId);

      var clubNameSQL ="select distinct clubname from clubs where city='"+city+"'";
      var locationSQL="select distinct location from clubs where city='"+city+"'";
      var djNameSQL = "select distinct name from djtable where city='"+city+"'";
      //var eventNameSQL = "select distinct eventname from events";
      
      // multipleStatementsconnection.query('select distinct clubname from clubs; select distinct location from clubs; select distinct name from djtable;', function (error, results, fields) {
        multipleStatementsconnection.query(clubNameSQL+'; '+locationSQL+'; '+djNameSQL+';', function (error, results, fields) {
        if (error) throw error;
        // `results` is an array with one element for every statement in the query:
        console.log("results[0] "+JSON.stringify(results[0])); // [{1: 1}]
        console.log("results[1] "+JSON.stringify(results[1])); 
        console.log("results[2] "+JSON.stringify(results[2]));// [{2: 2}]
        res.send(JSON.stringify({ "clubname": results[0], "location": results[1], "djname": results[2]}));
        res.end();
      });
  }



  function updateTicktIdCount(req, res, ticketid, reduceCount){
    var availbleticketsForGuestList = 0;
    var checkAvailbleticketsSQL = "select availbletickets from ticketdetailsbyclubs where ticketid = ?";
    var updateAvailbleTicketSQL = "UPDATE ticketdetailsbyclubs SET availbletickets = ? where ticketid = ?";

    async.series([
      //performs the Query 1
      function(callback){
        pool.getConnection(function(err, connection) {
          if (err) {
            console.log("updateTicktIdCount: error: "+err);
            connection.release();
            return;
          }
                // update/reduce tickets available count for guestlist.
          console.log('updateTicktIdCount:  ticketid: '+ticketid)
          console.log('updateTicktIdCount: req.body.guestlistgirlcount: '+req.body.guestlistgirlcount);
          connection.query(checkAvailbleticketsSQL, 
            [ticketid],function(err, rows) {
            connection.release();
            if (!err) {
                console.log('updateTicktIdCount: checkAvailbleticketsSQL rows: '+JSON.stringify(rows));
                //res.json(rows);
                availbleticketsForGuestList = rows[0].availbletickets;
                console.log('updateTicktIdCount: checkAvailbleticketsSQL availbletickets: '+availbleticketsForGuestList);
            }
            callback(); //goes to the next function

          });

        });

      },

      //performs the Query 2 only after Query 1 is finished
      function(callback){
        //here reduce number
        pool.getConnection(function(err, connection) {
        if (err) {
          console.log("updateTicktIdCount: error: "+err);
          connection.release();
          return;
        }
      
        console.log('updateTicktIdCount: availbleticketsForGuestList = '+availbleticketsForGuestList);
         
        if(parseInt(availbleticketsForGuestList) > 0){
          console.log('updateTicktIdCount: update AvailbleTicket ');
          var newAvailbletickets = parseInt(availbleticketsForGuestList) - parseInt(reduceCount);
          connection.query(updateAvailbleTicketSQL, 
            [newAvailbletickets, ticketid],function(err, rows) {
            connection.release();
            if (!err) {
                console.log('updateTicktIdCount: updateAvailbleTicketSQL rows: '+JSON.stringify(rows));
                console.log('updateTicktIdCount: newAvailbletickets: '+newAvailbletickets);
            }
            callback();
          });
        }
  
        connection.on("error", function(err) {
          console.log("insertCustomerDetails: error: "+err);
          return;
        });
      
      });
   
      }
    ]);
    
  }

  function bookTicket(req, res) {
    //var clubid = req.body.clubid;
    // var eventDate = "19/Mar/2019";//req.query.eventDate;
    // console.log("eventDate " + eventDate);
    console.log("bookTicket: post data: " + JSON.stringify(req.body));
    //console.log("bookTicket: post data: " + req.body);
    console.log("bookTicket: req.body.clubid: " + req.body.clubid);
    //console.log("bookTicket: req.data.clubid: " + req.data.clubid);
    //console.log("bookTicket: req.body.data.clubid: " + req.body.data.clubid);
    updateTicket = false;
    pool.getConnection(function(err, connection) {

      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }
  
      console.log("connected as id " + connection.threadId);
      var testSQL = "INSERT INTO ticketbookingdetails (bookingid , userid) VALUES(?,?)"
      var insertSQL = "INSERT INTO ticketbookingdetails (bookingid , userid , mobilenumber , "+
                    " email , clubid , clubname , eventid , eventname , eventdate , imageurl, postedby  ,"+
                    " offerid , tablediscountamt , tablediscountpercentage ,  passdiscountamt , "+
                    " passdiscountpercentage ,  totalprice , priceafterdiscount , bookingamount , "+
                    " remainingamount , guestlistgirlcount , guestlistcouplecount , passcouplecount , "+
                    " passstagcount , tablenumber , tablepx , transactionnumber , paymentstatusmsg, bookingconfirm , "+
                    " termncondition , latlong , qrcode , bookingdate ,  bookingtimestamp, eventdateasdate )"+
                    "VALUES(?,?,?,?,?,  ?,?,?,?,?,  ?,?,?,?,?,  ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?,  ?,?,?,?, ?)";
      connection.query(insertSQL, [req.body.bookingid , req.body.userid , req.body.mobilenumber , 
        req.body.email , req.body.clubid , req.body.clubname , req.body.eventid , req.body.eventname , req.body.eventdate , 
        req.body.imageurl,
        req.body.postedby  , req.body.offerid , req.body.tablediscountamt , req.body.tablediscountpercentage , 
        req.body.passdiscountamt , req.body.passdiscountpercentage , 
        req.body.totalprice , req.body.priceafterdiscount , req.body.bookingamount , 
        req.body.remainingamount , req.body.guestlistgirlcount , req.body.guestlistcouplecount , req.body.passcouplecount , 
        req.body.passstagcount , req.body.tablenumber ,
        req.body.tablepx , req.body.transactionnumber , req.body.paymentstatusmsg, req.body.bookingconfirm , 
        req.body.termncondition , req.body.latlong , req.body.qrcode , req.body.bookingdate , 
        req.body.bookingtimestamp, new Date(req.body.eventdate)],  function(err, rows) {
        connection.release();
        if (!err) {
            console.log("bookTicket: success, insert in db");
            //res.json(rows);
            res.send(JSON.stringify("success"));
            res.end();
            updateTicket = true;
            console.log('updateTicktIdCount: req.body.guestlistgirlcount: '+req.body.guestlistgirlcount)
            if(updateTicket == true && parseInt(req.body.guestlistgirlcount) > 0 && req.body.postedby != 'guestlist'){
              var ticketIdForGirl = req.body.ticketIdForGirl; 
              console.log('updateTicktIdCount: for girl ticketid: '+ticketIdForGirl)
              updateTicktIdCount(req, res, ticketIdForGirl, parseInt(req.body.guestlistgirlcount));
            }

            console.log('updateTicktIdCount: req.body.guestlistcouplecount: '+req.body.guestlistcouplecount)
            if(updateTicket == true && parseInt(req.body.guestlistcouplecount) > 0 && req.body.postedby != 'guestlist'){
              var ticketIdForCouple = req.body.ticketIdForCouple; 
              console.log('updateTicktIdCount: for couple ticketid: '+ticketIdForCouple)
              updateTicktIdCount(req, res, ticketIdForCouple, parseInt(req.body.guestlistcouplecount));
            } 

            // update tablesdata if any table is booked
            if(req.body.tablenumber != null && parseInt(req.body.tablenumber) > 0  && req.body.postedby != 'guestlist'){
              updateTablesData(req, res)
            }
        }

      });

      

      
      
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      });
    });
  }

  function updateTablesData(req, res){
    pool.getConnection(function(err, connection) {

      if (err) {
        console.log("updateGirlGuestListCount: error: "+err);
        connection.release();
        return;
      }

      var updateTableBookingStatus = 'UPDATE tablesdata SET booked = ? where clubid = ? and eventdate  = ? and tablenumber = ?';
      connection.query(updateTableBookingStatus, 
        ['booked', req.body.clubid, req.body.eventdate, req.body.tablenumber],function(err, rows) {
        //connection.release();
        if (!err) {
            console.log(rows);
            console.log("updateTablesData: table status updated for table num: "+req.body.tablenumber)
           
            
        }
      });


    });

  }



  function insertCustomerDetails(req, res) {
    var userid = req.body.userid;
    // var eventDate = "19/Mar/2019";//req.query.eventDate;
    // console.log("eventDate " + eventDate);
    console.log("insertCustomerDetails: post data: " + JSON.stringify(req.body));
    console.log("insertCustomerDetails: useid: " + userid);
    console.log('insertCustomerDetails: expoToken: '+req.body.expoToken)
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log("insertCustomerDetails: error: "+err);
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }
  
      console.log("connected as id " + connection.threadId);
      var needToUpdate = false;
      var updateSQL = "update customer set customername = ?, mobilenumber = ? , email = ? , expoToken = ? where userid = ?";

                    //update customer set customername = 'rrrrr' , mobilenumber='2222', email='sdgsg', firebasetoken='1234' where userid = '10216445950197935'
      
      var insertSQL = "INSERT INTO customer (userid , customername,  mobilenumber ,  email , expoToken ) "+
                    " VALUES(?,?,?, ?, ?)";
      connection.query(insertSQL, [ req.body.userid , req.body.name, req.body.mobilenumber , 
        req.body.email , req.body.expoToken ],  function(err, rows, fields) {
        console.log("insertCustomerDetails: success1, rows.insertId="+JSON.stringify(rows));
        if(rows == null || rows == 'undefined'){
          needToUpdate = true;
          console.log("insertCustomerDetails: needToUpdate1="+needToUpdate);
        }
        //connection.release();
        if (!err) {
            console.log("insertCustomerDetails:success2, rows="+rows);
            //res.json(rows);
            res.send(JSON.stringify("success"));
            res.end();
        }
      });
      console.log("insertCustomerDetails: needToUpdate2="+needToUpdate);
      //if(needToUpdate){
        connection.query(updateSQL, [  req.body.name, req.body.mobilenumber , 
          req.body.email , req.body.expoToken , req.body.userid],  function(err, rows) {
          console.log("insertCustomerDetails: success3, rows="+rows);
          if(rows == null){
            needToUpdate = true;
          }
          //connection.release();
          if (!err) {
              console.log("insertCustomerDetails:success4, rows="+rows);
              //res.json(rows);
              res.send(JSON.stringify("success"));
              res.end();
          }
        });
      //}



      connection.release();
  
      connection.on("error", function(err) {
        console.log("insertCustomerDetails: error: "+err);
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
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

  app.get("/eventsDetailsOfOneClub", function(req, res) {
    getEventsDetailsOfOneClub(req, res);
  });
  

  app.get("/offersDetails", function(req, res) {
    getOffersDetails(req, res);
  });

  app.get("/djDetails", function(req, res) {
    getDJsDetails(req, res);
  });


  app.get("/eventsDetailsForDJ", function(req, res) {
    getEventsDetailsForDJ(req, res);
  });

  app.get("/ticketDetails", function(req, res) {
    getTicketDetails(req, res);
  });
  
  app.post("/bookTicket", function(req, res) {
    bookTicket(req, res);
  });


  app.get("/tableDetails", function(req, res) {
    getTablesDetails(req, res);
  });

  app.post("/insertCustomerDetails", function(req, res) {
    insertCustomerDetails(req, res);
  });

  app.get("/getSearchParameter", function(req, res) {
    getSearchParameter(req, res);
  });

  app.get("/bookingDetails", function(req, res) {
    getBookingDetails(req, res);
  });
  

  

  app.listen(6060, function() {
    console.log("listening on *:6060");
  });
