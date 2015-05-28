var SPLSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('splSsId'));

function newPurchaseItem(formObj){
  var test, itemObj, nextItemId;
  
  itemObj = {item: formObj.item,
             description: formObj.desc,
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



function getPurchaseItem(itemId){
  var test;
  
  splSheet = SPLSS.getSheetByName('Standard Items');
  standardItems = NVSL.getRowsData(splSheet);
  item = standardItems.filter(function (e){
    return e.itemId == itemId;
  })[0];
  return item;
}



function updatePurchaseItem(){
  
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
  
  var itemId = 11;
  var item = getPurchaseItem(itemId);
  debugger;
}