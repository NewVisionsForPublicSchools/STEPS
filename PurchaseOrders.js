var SPLSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('splSsId'));



function createOrder(formObj){
  var test, orderSheet, orderSheetRange, vendors, order, dateString, user, number;
  
  orderSheet = SPLSS.getSheetByName('Order Info');
  orderHeaderRange = orderSheet.getRange(1,1,1,orderSheet.getLastColumn());
  vendors = getOrderVendors();
  
  for(i=0;i<vendors.length;i++){
    order = {
      location: formObj.location,
      requestedBy: formObj.requested,
      authorizedBy: formObj.authorized,
      ticketNumber: formObj.ticket,
      dateCreated: new Date()
    };
    
    dateString = order.dateCreated.getFullYear().toString() + ("0"+(order.dateCreated.getMonth() + 1)).slice(-2).toString()
    + ("0"+(order.dateCreated.getDate())).slice(-2).toString();
    user = Session.getActiveUser().getEmail().slice(0,2).toUpperCase();
    number = PropertiesService.getScriptProperties().getProperty('nextOrderNumber');
    order.orderId = dateString + "_" + order.location + "_" + user + "_" + number;
    order.vendor = vendors[i];
    NVSL.setRowsData(orderSheet, [order], orderSheetRange, orderSheet.getLastRow()+1);
    number = (Number(number)+1).toString();
    PropertiesService.getScriptProperties().setProperty('nextOrderNumber', number);
  }
  debugger;
}



function getOrderVendors(){
  var test, cartSheet, orderItems, vendors, vendorList;
  
  cartSheet = SPLSS.getSheetByName('Cart');
  orderItems = NVSL.getRowsData(cartSheet);
  vendors = orderItems.map(function(e){
    return e.vendor;
  });
  vendorList = NVGAS.unique(vendors);
  return vendorList;
}



function resetOrderNumber(){  
  PropertiesService.getScriptProperties().setProperty('nextOrderNumber', '1');
}



function testOrder(){
  var test, formObj;
  
  formObj = {
    location: 'NVPS',
    requested: 'Joe',
    authorized: 'Mike',
    ticket: '123456'
  };
  
  createOrder(formObj);
}