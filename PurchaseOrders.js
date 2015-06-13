var SPLSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('splSsId'));



function createOrder(formObj){
  var test, orderSheet, orderSheetRange, orderHeaderRange, vendors, created, order, dateString, user, number, html;
  
  orderSheet = SPLSS.getSheetByName('Order Info');
  orderHeaderRange = orderSheet.getRange(1,1,1,orderSheet.getLastColumn());
  vendors = getOrderVendors();
  created = [];
  
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
    order.subtotal = addOrderItems(order.orderId, vendors[i]);
    NVSL.setRowsData(orderSheet, [order], orderSheetRange, orderSheet.getLastRow()+1);
    number = (Number(number)+1).toString();
    PropertiesService.getScriptProperties().setProperty('nextOrderNumber', number);
    created.push(order);
  }
  clearCart();
  
  html = HtmlService.createTemplateFromFile('confirm_order');
  html.data = created;
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
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



function addOrderItems(orderId, vendor){
  var test, cartSheet, orderItemsSheet, headerRange, orderItems, thisVendor, subtotal;
  
  cartSheet = SPLSS.getSheetByName('Cart');
  orderItemsSheet = SPLSS.getSheetByName('Order Items');
  headerRange = orderItemsSheet.getRange(1,1,1,orderItemsSheet.getLastColumn());
  orderItems = NVSL.getRowsData(cartSheet);
  thisVendor = orderItems.filter(function(e){
    return e.vendor == vendor;
  }).map(function(e){
    e.poNumber = orderId;
    return e;
  });
  subtotal = thisVendor.map(function(e){
    return e.price * e.qty;
  }).reduce(function(a,b){
    return  a + b;
  });
  NVSL.setRowsData(orderItemsSheet, thisVendor, headerRange, orderItemsSheet.getLastRow()+1)
  
  return subtotal;
}



function resetOrderNumber(){  
  PropertiesService.getScriptProperties().setProperty('nextOrderNumber', '1');
}



function createOrderFile(orderId){
  
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