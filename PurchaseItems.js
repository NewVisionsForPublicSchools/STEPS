var SPLSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('splSsId'));

function newPurchaseItem(formObj){
  var test, itemObj, nextItemId;
  
  itemObj = {item: formObj.item,
             description: formObj.desc,
             location: formObj.loc,
             vendor: formObj.vendor,
             partNumber: formObj.partNo,
             price: formObj.price,
             notes: formObj.notes,
             itemId: PropertiesService.getScriptProperties().getProperty('nextItemId'),
             lastUpdated: new Date()
            };
  
  nextItemId = Number(itemObj.itemId) + 1;
  writePurchaseItem(itemObj);
  PropertiesService.getScriptProperties().setProperty('nextItemId', nextItemId);
  debugger;
}



function getAllPurchaseItems(){
  var test, splSheet, standardItems, html;
  
  splSheet = SPLSS.getSheetByName('Standard Items');
  standardItems = NVSL.getRowsData(splSheet);
  sortByKey(standardItems, 'item');
  
  html = HtmlService.createTemplateFromFile('purchase_item');
  html.data = standardItems;
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function getPurchaseItem(itemId){
  var test;
  
  splSheet = SPLSS.getSheetByName('Standard Items');
  standardItems = NVSL.getRowsData(splSheet);
  item = standardItems.filter(function (e){
    return e.itemId == itemId;
  })[0];
  return item;
}



function editPurchaseItem(formObj){
  var test, item, itemId, sheet, headers, row, objects;
  
  Logger.log("Hello World");
  item = {
    item: formObj.itemName,
    description: formObj.itemDesc,
    location: formObj.itemLoc, 
    vendor: formObj.itemVendor,
    partNumber: formObj.partNum,
    price: formObj.itemPrice,
    notes: formObj.itemNotes,
    lastUpdated: new Date()
  };
  
  itemId = Number(formObj.spiId);
  sheet = SPLSS.getSheetByName('Standard Items');
  headers = sheet.getRange(1,2,1,sheet.getLastColumn());
  row = getItemRow(itemId);
  objects = [item];
  NVSL.setRowsData(sheet, objects, headers, row)
}



function removePurchaseItem(){
  
}



function writePurchaseItem(item){
  var test, data, splSheet, range;
  
  data = [item];
  splSheet = SPLSS.getSheetByName('Standard Items');
  range = splSheet.getRange(1,1,1,splSheet.getLastColumn());
  NVSL.setRowsData(splSheet, data, range, splSheet.getLastRow()+1);
}



function displayPurchaseItem(itemId){
  var test, item, html;
  
  item = getPurchaseItem(itemId);
  
  html = HtmlService.createTemplateFromFile('item_detail');
  html.data = item;
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function getItemRow(itemId){
  var test, ss, sheet, data, row;
  
  ss = SPLSS;
  sheet = ss.getSheetByName('Standard Items');
  data = NVSL.getRowsData(sheet).map(function (e){
    return e.itemId;
  });
  
  row = data.indexOf(itemId) + 2;
  return row;
}



function testFunc(){
//  var formObj = {
//    item: 'thingamabob3',
//    desc: 'This is a description of the widget',
//    vendor: 'ACME',
//    partNo: 'AC123',
//    price: 66,
//    notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquet euismod malesuada. Nullam imperdiet odio eu nisi imperdiet viverra at ac metus.'
//  }
//  
//  newPurchaseItem(formObj);
  var itemId = 42;
  var row = getItemRow(itemId);
  debugger;
}