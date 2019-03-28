var getConnection = require("../db");

var getClubsDetails = function(city) {
  //console.log('vichi')
  return new Promise(function(resolve, reject) {
    getConnection(function(err, connection) {
      // Do something with the connection
      //console.log(city)
      connection.query(
        "SELECT * FROM clubs WHERE city = ?",
        [city],
        function(err, rows) {
          if (err) {
            throw err;
          } else {
            resolve(rows);
          }
        }
      );
      // Don't forget to release the connection when finished!
      //getConnection.releaseConnection(connection);
      connection.release();
    });
  });
};

//module.exports = getClubsDetails;
module.exports = {
  getClubsDetails: getClubsDetails
};
