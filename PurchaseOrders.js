var SPLSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('splSsId'));



function createOrder(formObj){
  var test, orderSheet, orderSheetRange, orderHeaderRange, vendors, created, order, dateString, user, number, html, inits;
  
  orderSheet = SPLSS.getSheetByName('Order Info');
  orderHeaderRange = orderSheet.getRange(1,1,1,orderSheet.getLastColumn());
  vendors = getOrderVendors();
  created = [];
  
  for(i=0;i<vendors.length;i++){
    Utilities.sleep(1000);
    order = {
      location: formObj.location,
      requestedBy: formObj.requested,
      authorizedBy: formObj.authorized,
      ticketNumber: formObj.ticket,
      dateCreated: new Date()
    };
    
    dateString = order.dateCreated.getFullYear().toString().substring(2) + ("0"+(order.dateCreated.getMonth() + 1)).slice(-2).toString()
    + ("0"+(order.dateCreated.getDate())).slice(-2).toString();
    user = Session.getActiveUser().getEmail();
    inits = user.slice(0,2).toUpperCase();
    number = PropertiesService.getScriptProperties().getProperty('nextOrderNumber');
    order.orderId = dateString + "_" + order.location + "_" + inits + "_" + number;
    order.vendor = vendors[i];
    order.subtotal = addOrderItems(order.orderId, vendors[i]);
    order.createdBy = user;
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
  var test, orderSheet, orders, orderInfo, location, template, filename, folder, file, fileId, url, ss, sheet,
      poNumberRange, poDate, requested, authorized, vendor, itemsSheet, orderItems, headerRange, orderIndex, fileRange;
  
  orderSheet = SPLSS.getSheetByName('Order Info');
  itemsSheet = SPLSS.getSheetByName('Order Items');
  orders = NVSL.getRowsData(orderSheet);
  orderInfo = orders.filter(function(e){
    return e.orderId == orderId;
  });
  location = orderInfo[0].location;
  template = getPoTemplate(location);
  filename = orderId + "_" + orderInfo[0].vendor;
  folder = DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('purchaseOrderFolderId'));
  file = template.makeCopy(filename, folder);
  fileId = file.getId();
  url = file.getUrl();
  ss = SpreadsheetApp.openById(fileId);
  sheet = ss.getSheetByName('Purchase Order');
  poNumberRange = sheet.getRange(3,1,1,1);
  poNumberRange.setValue(orderId);
  poDate = sheet.getRange(5,1,1,1);
  poDate.setValue(Utilities.formatDate(orderInfo[0].dateCreated, "GMT", "MM-dd-yyyy"));
  requested = sheet.getRange(7,1,1,1);
  requested.setValue(orderInfo[0].requestedBy);
  authorized = sheet.getRange(9,1,1,1);
  authorized.setValue(orderInfo[0].authorizedBy);
  vendor = sheet.getRange(12,1,1,1);
  vendor.setValue(orderInfo[0].vendor);
  
  orderItems = NVSL.getRowsData(itemsSheet).filter(function(e){
    return e.poNumber == orderId;
  }).map(function(e){
    e.itemNoOrDescription = e.item;
//    e.priceUnit = e.price;
    e.totalPrice = e.qty * e.price;
    return e;
  });
  
  headerRange = sheet.getRange(20,1,1,7);
  if(orderItems.length > 5){
    sheet.insertRows(21, orderItems.length - 5);
  }
  NVSL.setRowsData(sheet, orderItems, headerRange, 21)
  
  orderIndex = orders.map(function(e){
    return e.orderId
  }).indexOf(orderId) + 2;
  fileRange = orderSheet.getRange(orderIndex, 8,1,1);
  fileRange.setValue(url);
  
  sendOrderFile(orderId);

  debugger;
}



function getPoTemplate(location){
  var test, templateId, template;
  
  switch(location){
    case 'AMS':
      templateId = PropertiesService.getScriptProperties().getProperty('amsPoId');
      break;
    case 'AMS2':
      templateId = PropertiesService.getScriptProperties().getProperty('ams2PoId');
      break;
    case 'AMS3':
      templateId = PropertiesService.getScriptProperties().getProperty('ams3PoId');
      break;
    case 'AMS4':
      templateId = PropertiesService.getScriptProperties().getProperty('ams4PoId');
      break;
    case 'HUM':
      templateId = PropertiesService.getScriptProperties().getProperty('humPoId');
      break;
    case 'HUM2':
      templateId = PropertiesService.getScriptProperties().getProperty('hum2PoId');
      break;
    case 'HUM3':
      templateId = PropertiesService.getScriptProperties().getProperty('hum3PoId');
      break;
    case 'NVPS':
      templateId = PropertiesService.getScriptProperties().getProperty('nvpsPoId');
      break;
    default:
      templateId = "";
  }
  
  template = DriveApp.getFileById(templateId);
  return template;
}



function sendOrderFile(orderId){
  var test, orderSheet, orders, orderInfo, subject, body;
  
  orderSheet = SPLSS.getSheetByName('Order Info');
  orders = NVSL.getRowsData(orderSheet);
  orderInfo = orders.filter(function(e){
    return e.orderId == orderId;
  })[0];
  
  subject = "Purchase Order " + orderId + " has been created";
  body = '<p>The following <a href="' + orderInfo.file + '">purchase order</a> has been created: </p>';
  body.date = orderInfo;
  
  MailApp.sendEmail(orderInfo.createdBy, subject, "", {htmlBody: body})
  debugger;
}



function testOrder(){
  var test, formObj, orderId;
  
//  formObj = {
//    location: 'NVPS',
//    requested: 'Joe',
//    authorized: 'Mike',
//    ticket: '123456'
//  };
  
  orderId = '20150615_AMS3_CB_21'
  
  sendOrderFile(orderId);
}

function getHeader(){
  var sheet = SpreadsheetApp.openById('1P9KsNA9dPP6d3rz_hdTd5hkPz57dOcqV-B5s7yv8L98').getSheetByName('Purchase Order');
  var range = sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn());
  var header = NVSL.getRowsData(sheet, range, 20);
  debugger;
}