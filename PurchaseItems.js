
var SPLSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('splSsId'));

function newPurchaseItem(formObj){
  var test, itemObj, nextItemId;

  itemObj = {item: formObj.itemName.trim(),
             description: formObj.itemDesc,
             location: formObj.itemLoc,
             vendor: formObj.itemVendor,
             partNumber: formObj.partNum,
             price: formObj.itemPrice.toFixed(2),
             notes: formObj.itemNotes,
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
  
  if(row){
    NVSL.setRowsData(sheet, objects, headers, row)
  }
}



function removePurchaseItem(formObj){
  var test, itemId, recordRow, sheet;
  
  itemId = Number(formObj.spiId);
  sheet = SPLSS.getSheetByName('Standard Items');
  recordRow = getItemRow(itemId, sheet);
  sheet.deleteRow(recordRow);
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



function getItemRow(itemId, sheet){
  var test, ss, data, row;
  
  data = NVSL.getRowsData(sheet).map(function (e){
    return e.itemId;
  });
  
  row = data.indexOf(itemId) >= 0 ? (data.indexOf(itemId) + 2) : "";
  return row;
}



function addToCart(itemId){
  var test, cartId, item, data, cartSheet, range, cartItems, html;
  
  cartId = Number(PropertiesService.getScriptProperties().getProperty('nextCartId'));
  cartSheet = SPLSS.getSheetByName('Cart');
  
  if(itemId){
    item = getPurchaseItem(itemId);
    item.qty = 1;
    item.cartId = cartId
    data = [item];
    range = cartSheet.getRange(1,1,1,cartSheet.getLastColumn());
    NVSL.setRowsData(cartSheet, data, range, cartSheet.getLastRow()+1);
    PropertiesService.getScriptProperties().setProperty('nextCartId', cartId + 1);
  }
  
  cartItems = NVSL.getRowsData(cartSheet);
  
  
  html = HtmlService.createTemplateFromFile('purchase_cart');
  html.data = cartItems;
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function removeFromCart(cartId){
  var test, id, sheet, recordRow, ss, cartItems, html;
  
  id = Number(cartId);
  ss = SPLSS;
  sheet = ss.getSheetByName('Cart')
  recordRow = getCartRow(id, sheet);
  sheet.deleteRow(recordRow);
  
  cartItems = NVSL.getRowsData(sheet);
  
  html = HtmlService.createTemplateFromFile('purchase_cart');
  html.data = cartItems;
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function getCartRow(cartId, sheet){
  var test, ss, data, row;
  
  data = NVSL.getRowsData(sheet).map(function (e){
    return e.cartId;
  });
  
  row = data.indexOf(cartId) >= 0 ? (data.indexOf(cartId) + 2) : "";
  return row;
}



function clearCart(){
  var test, cartSheet, range;
  
  cartSheet = SPLSS.getSheetByName('Cart');
  range = cartSheet.getRange(2,1,cartSheet.getLastRow(),cartSheet.getLastColumn());
  range.clearContent();
  PropertiesService.getScriptProperties().setProperty('nextCartId', 1);

  return addToCart();
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