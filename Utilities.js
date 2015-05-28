var ADDRESS = PropertiesService.getScriptProperties().getProperty('address');
var USER = PropertiesService.getScriptProperties().getProperty('user');
var USERPWD = PropertiesService.getScriptProperties().getProperty('userPwd');
var DB = PropertiesService.getScriptProperties().getProperty('db');

var dbUrl = 'jdbc:mysql://' + ADDRESS + '/' + DB;



function getStandardPurchases(){
  var test,
      records, conn, start, stmt, results, numCols,
      record, col;
  
  records = [];
  
  conn = Jdbc.getConnection(dbUrl, USER, USERPWD);
  start = new Date();
  stmt = conn.createStatement();
  results = stmt.executeQuery('SELECT * FROM standards');
  numCols = results.getMetaData().getColumnCount();
  
  while(results.next()){
    record = {};
    record.item = results.getString('item');
    record.description = results.getString('description');
    record.vendor = results.getString('vendor');
    record.partNumber = results.getString('part_number');
    record.price = results.getString('price');
    records.push(record)
  }
  
  results.close();
  stmt.close();
  return records;
  debugger;
}



function setStandardPurchase(){
  var test,
      table, conn, stmt;
  
//  item = obj.item || 
  
  
  table = 'standards';
  conn = Jdbc.getConnection(dbUrl, USER, USERPWD);

  stmt = conn.prepareStatement('INSERT INTO ' + table
      + '(item, description, vendor, part_number, price) values (?, ?, ?, ?, ?)');
  stmt.setString(1, 'First Guest');
  stmt.setString(2, 'Hello, world');
  stmt.setString(3, 'TBD');
  stmt.setString(4, 'TBD');
  stmt.execute();
}



function getTest(){
  var test, records,
      i, a, currRecord, record;
  
  records = getStandardPurchases();
  debugger;
  
}



/**
* Function to escape all non-mySQL compatible special characters in a string 
* Use prior to writing strings to CloudSQL
* @param {string} str - any string
*/
function mysql_real_escape_string_(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}