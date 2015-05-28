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



function getPurchaseItem(){
  
}



function updatePurchaseItem(){
  
}



function removePurchaseItem(){
  
}



function writePurchaseItem(item){
  Logger.log(item);
}



function testFunc(){
  var formObj = {
    item: 'widget',
    desc: 'This is a description of the widget',
    vendor: 'ACME',
    partNo: 'AC123',
    price: 60,
    notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquet euismod malesuada. Nullam imperdiet odio eu nisi imperdiet viverra at ac metus.'
  }
  
  newPurchaseItem(formObj);
}