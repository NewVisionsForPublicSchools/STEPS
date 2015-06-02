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



function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];

        if (typeof x == "string")
        {
            x = x.toLowerCase(); 
            y = y.toLowerCase();
        }

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}



function seedStandardPurchaseList(){
  var test, ss, sheet, data, seeds, i, destSs, destSheet, range, formObj, itemObj, nextId;
  
  ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('purchaseListSeedId'));
  sheet = ss.getSheetByName('Sheet1');
  data = NVSL.getRowsData(sheet);
  destSs = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('splSsId'));
  destSheet = destSs.getSheetByName('Standard Items');
  range = destSheet.getRange(2,1,destSheet.getLastRow(),destSheet.getLastColumn());

  seeds = data.map(function (e){
    var x = {
      item: e.standard.trim(),
      desc: e.itemDescription,
      loc: e.forWhichLocation,
      vendor: e.vendor,
      partNo: e.vendorPartNumber,
      price: e.lastQuotedPrice,
      notes: e.notes
    };
    return x;
  });
  
  range.clearContent();
  nextId = Number(PropertiesService.getScriptProperties().getProperty('nextItemId'));
  for(i=0;i<seeds.length;i++){
    formObj = seeds[i];
    itemObj = {
             item: formObj.item,
             description: formObj.desc,
             location: formObj.loc,
             vendor: formObj.vendor,
             partNumber: formObj.partNo,
             price: formObj.price,
             notes: formObj.notes,
             itemId: nextId + i,
             lastUpdated: new Date()
            };
    writePurchaseItem(itemObj);
  }
  PropertiesService.getScriptProperties().setProperty('nextItemId', nextId + i);
  debugger;
}



function searchStringInArray (str, strArray) {
  var results = [];
  for (var j=0; j<strArray.length; j++) {
    if (strArray[j].match(str)){
      results.push(j);
    }   
  }
  var matches = results.length > 0 ? results : -1;
  return matches;
}