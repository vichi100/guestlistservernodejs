var mySQL = require("mysql");

var pool = mySQL.createPool({
  host: "199.180.133.121",
  port: "3306",
  user: "root",
  password: "vichi123",
  database: "guestlist",
  connectionLimit: 0,
  queueLimit: 0
});
var getConnection = function(cb) {
  pool.getConnection(function(err, connection) {
    //if(err) throw err;
    //pass the error to the cb instead of throwing it
    if (err) {
      console.log(err)
      return cb(err);
    }
    cb(null, connection);
  });
};
module.exports = getConnection;
