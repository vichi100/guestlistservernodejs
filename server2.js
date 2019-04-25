var express = require("express");
var mysql = require("mysql");
var bodyParser     =         require("body-parser");
var EventEmitter = require('events');


const emitter = new EventEmitter()
emitter.setMaxListeners(0)
var app = express();
// ADD THIS
var cors = require('cors');
app.use(cors());
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
  database: "guestlist",
  multipleStatements: true,
});

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
  acquireTimeout:20000,
  connectTimeout: 20000,
  //waitForConnections:false,
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


  function getTicketDetails(req, res) {
    var clubid = req.query.clubid;
    var eventDate = req.query.eventDate;
    console.log("eventDate " + eventDate);
    console.log("clubid " + clubid);

    let allQueryExecuted = false;
    let clubsTicketData = null;
    let clubTicketData = {};
    let eventTicketDataByDj = {};
    let eventTicketDataByPR = {};
    let eventTicketDataByGuestList = {}

    // get ticket details from ticketdetailsbyclubs table
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }
      // club details data, club ticket data, dj ticket data, pr ticket data
      console.log("connected as id " + connection.threadId);
      
      connection.query("select * from ticketdetailsbyclubs where clubid = ? and date = ?", [clubid, eventDate],function(err, rows) {
        connection.release();
        if (!err) {
          console.log(JSON.stringify(rows));
          clubsTicketData = JSON.stringify(rows);
          let ticketType = null;
          let ticketCategory = null;
          let passCoupleCost = 0;
          let passStagCost = 0;
          let guestlistGirlAvailableCount = 0;
          let guestListCoupleAvailableCount = 0;
          Object.keys(rows).map((keyName, keyIndex) => {
             ticketType = rows[keyName].type;
             ticketCategory = rows[keyName].category;

            if (ticketType == "pass" && ticketCategory == "couple") {
              // this.setState({ passCoupleCost: rows[keyName].cost });
              passCoupleCost = rows[keyName].cost;
            }

            if (ticketType == "pass" && ticketCategory == "stag") {
              passStagCost = rows[keyName].cost
            }

            if (ticketType == "guestlist" && ticketCategory == "girl") {
              guestlistGirlAvailableCount = rows[keyName].availbletickets
            }
            if (ticketType == "guestlist" && ticketCategory == "couple") {
              guestListCoupleAvailableCount = rows[keyName].availbletickets
            }
          });
          
          clubTicketData = {
            "guestlistGirlAvailableCount": guestlistGirlAvailableCount,
            "guestListCoupleAvailableCount": guestListCoupleAvailableCount,
            "passStagCost": passStagCost,
            "passCoupleCost": passCoupleCost,
          }
          console.log('getTicketDetails: clubTicketData = '+JSON.stringify(clubTicketData))  
        }
      });

      
  
      connection.on("error", function(err) {
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      });
    });


    // get ticket details from ticketsforevents table
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        res.json({ code: 100, status: "Error in connection database" });
        res.end();
        return;
      }

      connection.query("select * from ticketsforevents where clubid = ? and date = ?", [clubid, eventDate],function(err, rows) {
        connection.release();
        if (!err) {
            //console.log(JSON.stringify(rows));
            //res.json(rows);
            let guestlistGirlAvailableCount = 0;
            let guestListCoupleAvailableCount = 0;
            let postedbyname = null;
            let postedbyid = null;
            
            Object.keys(rows).map((keyName, keyIndex) => {
              let postedby = rows[keyName].postedby;
              let ticketCategory = rows[keyName].category;
              if(postedby != null && postedby == 'dj' && ticketCategory == "couple"){
                guestListCoupleAvailableCount = rows[keyName].availbletickets
                postedbyname = rows[keyName].postedbyname;
                postedbyid = rows[keyName].postedbyid;
              }
              if(postedby != null && postedby == 'dj' && ticketCategory == "girl"){
                guestlistGirlAvailableCount = rows[keyName].availbletickets
                postedbyname = rows[keyName].postedbyname;
                postedbyid = rows[keyName].postedbyid;
              }
            });

            eventTicketDataByDj = {
              "guestlistGirlAvailableCount": guestlistGirlAvailableCount,
              "guestListCoupleAvailableCount": guestListCoupleAvailableCount,
              "postedByName": postedbyname,
              "postedById": postedbyid,
            },
            console.log('getTicketDetails: eventTicketDataByDj = '+JSON.stringify(eventTicketDataByDj))  
            guestlistGirlAvailableCount = 0;
            guestListCoupleAvailableCount = 0;
            postedbyname = null,
            postedbyid = null,
            Object.keys(rows).map((keyName, keyIndex) => {
              let postedby = rows[keyName].postedby;
              let ticketCategory = rows[keyName].category;
              if(postedby != null && postedby == 'pr' && ticketCategory == "couple"){
                guestListCoupleAvailableCount = rows[keyName].availbletickets
                postedbyname = rows[keyName].postedbyname;
                postedbyid = rows[keyName].postedbyid;
              }
              if(postedby != null && postedby == 'pr' && ticketCategory == "girl"){
                guestlistGirlAvailableCount = rows[keyName].availbletickets
                postedbyname = rows[keyName].postedbyname;
                postedbyid = rows[keyName].postedbyid;
              }
            });

            eventTicketDataByPR = {
              "guestlistGirlAvailableCount": guestlistGirlAvailableCount,
              "guestListCoupleAvailableCount": guestListCoupleAvailableCount,
              "postedByName": postedbyname,
              "postedById": postedbyid,
            };
            console.log('getTicketDetails: eventTicketDataByPR = '+JSON.stringify(eventTicketDataByPR))  
            guestlistGirlAvailableCount = 0;
            guestListCoupleAvailableCount = 0;
            postedbyname = null,
            postedbyid = null,

            Object.keys(rows).map((keyName, keyIndex) => {
              let postedby = rows[keyName].postedby;
              let ticketCategory = rows[keyName].category;
              if(postedby != null && postedby == 'guestlist' && ticketCategory == "couple"){
                guestListCoupleAvailableCount = rows[keyName].availbletickets
                postedbyname = rows[keyName].postedbyname;
                postedbyid = rows[keyName].postedbyid;
              }
              if(postedby != null && postedby == 'guestlist' && ticketCategory == "girl"){
                guestlistGirlAvailableCount = rows[keyName].availbletickets
                postedbyname = rows[keyName].postedbyname;
                postedbyid = rows[keyName].postedbyid;
              }
            });

            eventTicketDataByGuestList = {
              "guestlistGirlAvailableCount": guestlistGirlAvailableCount,
              "guestListCoupleAvailableCount": guestListCoupleAvailableCount,
              "postedByName": postedbyname,
              "postedById": postedbyid,
            };
            console.log('getTicketDetails: eventTicketDataByGuestList = '+JSON.stringify(eventTicketDataByGuestList)) 
            allQueryExecuted = true;
        }
      });
      console.log('getTicketDetails: sending eventTicketDataByDj = '+JSON.stringify(eventTicketDataByDj))
      while(!allQueryExecuted){
          setTimeout(() => {}, 100);
          
      } 

      res.send({"clubTicketData": clubTicketData, 
          "eventTicketDataByDj": eventTicketDataByDj,
          "eventTicketDataByPR": eventTicketDataByPR,
          "eventTicketDataByGuestList" : eventTicketDataByGuestList
          });
          res.end();
      

      
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








  function bookTicketT(req, res){

    pool.getConnection(function(err, connection) {
      connection.beginTransaction(function(err) {
        if (err) {                  
          //Transaction Error (Rollback and release connection)
            connection.rollback(function() {
                connection.release();
                //Failure
            });
        } else {

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
            
            if (!err) {
                console.log("bookTicket: success, insert in db but not commited yet");
            }else{
              console.log("bookTicket: fail, insert in db fails");
            }
          });


      console.log('bookTicket: req.body.postedby: '+req.body.postedby);
      // if(req.body.postedby == 'club'){
      //   var checkAvailbleticketsSQL = "select availbletickets from ticketdetailsbyclubs where clubid  = ? and date = ? and type ='guest list' and category = ?";
        
      //   var updateAvailbleTicketSQL = "UPDATE ticketdetailsbyclubs SET availbletickets = ? where clubid = ? and date = ? and type = 'guest list' and category = ?"
      //   var availbletickets = 0;
      //   //FOR GIRLS
      //   if(parseInt(req.body.guestlistgirlcount) > 0){
      //     connection.query(checkAvailbleticketsSQL, 
      //       [req.body.clubid, req.body.eventdate, 'girl'],function(err, rows) {
            
      //       if (!err) {
      //           console.log('bookTicket: checkAvailbleticketsSQL rows: '+JSON.stringify(rows));
                
      //           availbletickets = rows[0].availbletickets;
      //           console.log('bookTicket: checkAvailbleticketsSQL availbletickets: '+availbletickets);
      //       }
      //     });
      //     console.log('bookTicket: availbletickets = '+availbletickets);
      //     if(parseInt(availbletickets) > 0){
      //       var newAvailbletickets = parseInt(availbletickets) -1;
      //       connection.query(updateAvailbleTicketSQL, 
      //         [newAvailbletickets, req.body.clubid, req.body.eventdate, 'girl'],function(err, rows) {
              
      //         if (!err) {
      //             console.log('bookTicket: updateAvailbleTicketSQL rows: '+JSON.stringify(rows));
      //             console.log('bookTicket: newAvailbletickets: '+newAvailbletickets)
      //             availbletickets = rows[0].availbletickets;
                  
      //         }
      //       });
      //     }
      //   }
      //   //FOR COUPLE
      //   availbletickets = 0;
      //   if(false){//parseInt(req.body.guestlistcouplecount) > 0
      //     connection.query(checkAvailbleticketsSQL, 
      //       [req.body.clubid, req.body.eventdate, 'couple'],function(err, rows) {
            
      //       if (!err) {
      //           console.log(rows);
      //           availbletickets = rows[0].availbletickets;
      //           console.log('bookTicket: availbletickets for couple:'+ availbletickets)
                
      //       }
      //     });
      //     if(parseInt(availbletickets) > 0){
      //       var newAvailbletickets = parseInt(availbletickets) -1;
      //       connection.query(updateAvailbleTicketSQL, 
      //         [newAvailbletickets, req.body.clubid, req.body.eventdate, 'couple'],function(err, rows) {
              
      //         if (!err) {
      //             console.log(rows);
      //             console.log('bookTicket: newAvailbletickets: '+newAvailbletickets)
                  
                  
      //         }
      //       });
      //     }
      //   }
      // }

      connection.commit(function(err) {
        if (err) { 
          console.log('bookTicket: Transaction Error');
          connection.rollback(function() {
          throw err;
          });
        }
        console.log('bookTicket: Transaction Completed Successfully.');
        connection.release();
        
      });


        }// else part end   
      });// Transaction End

      res.send(JSON.stringify("success"));
      res.end();
  });
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
        }
      });

      // update/reduce tickets available count for guestlist.
      console.log('bookTicket: req.body.postedby: '+req.body.postedby);
      if(req.body.postedby == 'club'){
        var checkAvailbleticketsSQL = "select availbletickets from ticketdetailsbyclubs where clubid  = ? and date = ? and type ='guest list' and category = ?";
        
        var updateAvailbleTicketSQL = "UPDATE ticketdetailsbyclubs SET availbletickets = ? where clubid = ? and date = ? and type = 'guest list' and category = ?"
        if(parseInt(req.body.guestlistgirlcount) > 0){
          updateGirlGuestListCount(req, res, checkAvailbleticketsSQL, updateAvailbleTicketSQL);
        }
        if(parseInt(req.body.guestlistcouplecount) > 0){
          console.log("bookTicket: req.body.guestlistcouplecount = "+req.body.guestlistcouplecount)
          updateCoupleGuestListCount(req, res, checkAvailbleticketsSQL, updateAvailbleTicketSQL);
        }
      }
      // same event can be posted by club, pr and dj
      // if clubs guestlist are over then check if any guestlist is available from pr or dj
      if(req.body.postedby == 'pr' || req.body.postedby == 'dj'){
        var checkAvailbleticketsSQL = "select availbletickets from ticketsforevents where clubid  = ? and date = ? and type ='guest list' and category = ?";
        
        var updateAvailbleTicketSQL = "UPDATE ticketsforevents SET availbletickets = ? where clubid = ? and date = ? and type = 'guest list' and category = ?"
        if(parseInt(req.body.guestlistgirlcount) > 0){
          updateGirlGuestListCount(req, res, checkAvailbleticketsSQL, updateAvailbleTicketSQL);
        }
        if(parseInt(req.body.guestlistcouplecount) > 0){
          console.log("bookTicket: req.body.guestlistcouplecount = "+req.body.guestlistcouplecount)
          updateCoupleGuestListCount(req, res, checkAvailbleticketsSQL, updateAvailbleTicketSQL);
        }
      }

      // update tablesdata if any table is booked
      if(req.body.tablenumber != null || parseInt(req.body.tablenumber) > 0){
        updateTablesData(req, res)
      }
      
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

  function updateGirlGuestListCount(req, res, checkAvailbleticketsSQL, updateAvailbleTicketSQL){
    var availbleticketsForGuestList = 0;
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log("updateGirlGuestListCount: error: "+err);
        connection.release();
        return;
      }

      // update/reduce tickets available count for guestlist.
      console.log('bookTicket: req.body.postedby: '+req.body.postedby);
      
      if(req.body.postedby == 'club'){
        
        if(parseInt(req.body.guestlistgirlcount) > 0){
          connection.query(checkAvailbleticketsSQL, 
            [req.body.clubid, req.body.eventdate, 'girl'],function(err, rows) {
            connection.release();
            if (!err) {
                console.log('bookTicket: checkAvailbleticketsSQL rows: '+JSON.stringify(rows));
                //res.json(rows);
                availbleticketsForGuestList = rows[0].availbletickets;
                console.log('bookTicket: checkAvailbleticketsSQL availbletickets: '+availbletickets);
            }
          });

        }
        
      }

    });

    pool.getConnection(function(err, connection) {
      if (err) {
        console.log("updateGirlGuestListCount: error: "+err);
        connection.release();
        return;
      }
    
      console.log('bookTicket: availbleticketsX = '+availbletickets);
       
      if(parseInt(availbletickets) > 0){
        console.log('bookTicket: update AvailbleTicket ');
        var newAvailbletickets = parseInt(availbleticketsForGuestList) - parseInt(req.body.guestlistgirlcount);
        connection.query(updateAvailbleTicketSQL, 
          [newAvailbletickets, req.body.clubid, req.body.eventdate, 'girl'],function(err, rows) {
          connection.release();
          if (!err) {
              console.log('bookTicket: updateAvailbleTicketSQL rows: '+JSON.stringify(rows));
              console.log('bookTicket: newAvailbletickets: '+newAvailbletickets)
              //res.json(rows);
              //availbletickets = rows[0].availbletickets;
              
          }
        });
      }
    
    });


  }

  function updateCoupleGuestListCount(req, res, checkAvailbleticketsSQL, updateAvailbleTicketSQL){
    var availbleticketsForCouple = 0;
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log("updateCoupleGuestListCount: error: "+err);
        connection.release();
        return;
      }
      
      if(parseInt(req.body.guestlistcouplecount) > 0){
        connection.query(checkAvailbleticketsSQL, 
          [req.body.clubid, req.body.eventdate, 'couple'],function(err, rows) {
          connection.release();
          if (!err) {
              console.log(rows);
              //res.json(rows);
              availbleticketsForCouple = rows[0].availbletickets;
              console.log('bookTicket: availbletickets for couple:'+ availbleticketsForCouple)
              
          }
        });
      }
    });

    pool.getConnection(function(err, connection) {
      if (err) {
        console.log("updateCoupleGuestListCount: error: "+err);
        connection.release();
        return;
      }
      console.log('bookTicket: availbleticketsForCouple = '+availbleticketsForCouple)
      if(parseInt(availbleticketsForCouple) > 0){
        var newAvailbletickets = parseInt(availbleticketsForCouple) - parseInt(req.body.guestlistcouplecount);
        connection.query(updateAvailbleTicketSQL, 
          [newAvailbletickets, req.body.clubid, req.body.eventdate, 'couple'],function(err, rows) {
          connection.release();
          if (!err) {
              console.log(rows);
              console.log('bookTicket: newAvailbletickets for couple: '+newAvailbletickets)
              
          }
        });
      }
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
  

  

  app.listen(6000, function() {
    console.log("listening on *:6000");
  });
