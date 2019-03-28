var getConnection = require("../db");

var getTablesDetails = function(clubid) {
  //console.log('vichi')
  return new Promise(function(resolve, reject) {
    getConnection(function(err, connection) {
      // Do something with the connection
      //console.log(city)
      connection.execute(
        "SELECT * FROM tablesdata WHERE clubid = ?",
        [clubid],
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
    getTablesDetails: getTablesDetails
};