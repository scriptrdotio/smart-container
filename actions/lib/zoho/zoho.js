var config =  require("./config.js");
var client = require("./client.js");

function zoho(){
}

zoho.prototype.updateTicketStatus = function(id, status, department){
   if(!department){
   	   department = config.department;
   }
  
   if(!status){
     return {
       status:"failure",
       errorDetail : "Missing parameters."
     }
   }
  
    var xmlTicket = '<requests><row no="1">'+
         				 '<fl val="Status">' + status +'</fl>'+
          			'</row></requests>';	

  	var portal = config.portal;
      var params= {
      "authtoken": config.supportAuthToken,
      "xml": xmlTicket,
      "portal":portal,
      "department":department,
      "id":id
    }
    var url = 'https://support.zoho.com/api/json/requests/updaterecords';
    return client.callApi(url,params);
}

zoho.prototype.createTicket = function(contactName, contactEmail, subject, message, deviceId, status, department){
  if(!department){
   	   department = config.department;
   }
    var xmlTicket = this._buildXMLTicketRow(contactName, contactEmail, subject, message, deviceId, status);
  
	var portal = config.portal;
    
    var params= {
      "authtoken": config.supportAuthToken,
      "xml": xmlTicket,
      "portal":portal,
      "department":department
    }
    var url = 'https://support.zoho.com/api/json/requests/addrecords';

  

    return client.callApi(url,params);
 };
  
zoho.prototype.createLead = function(name,email, source){
  
    var xmlData = this._buildLeadRow(name,email, source);
    var params= {
        'wfTrigger':'true',
        'authtoken': config.crmAuthToken,
        'xmlData': xmlData,
        'scope':'crmapi',
        'newFormat':'1',
        'duplicateCheck':'2'
    }
    var url =  'https://crm.zoho.com/crm/private/json/Leads/insertRecords';
    return  client.callApi(url,params);
  };
  
  zoho.prototype._buildXMLTicketRow = function(contactName, contactEmail, subject, message, deviceId, status){
    	if(!status){
          status = "open";
        }
    	return '<requests><row no="1">'+
          				'<fl val="Subject">'+ subject + '</fl>'+
          				'<fl val="Contact Name">' + contactName + '</fl>'+
          				'<fl val="Product Name">'+ deviceId +'</fl>'+
          				'<fl val="Email">' + contactEmail + '</fl>'+
          				'<fl val="Description">' + message +'</fl>'+
         				 '<fl val="Status">' + status +'</fl>'+
          			'</row></requests>';	

  };
  
 zoho.prototype._buildLeadRow = function(name, frmEmail, source){
     return '<Leads><row no="1">'+
       				'<FL val="Last Name">' + name + '</FL>'+
       				'<FL val="Lead Source">'+source+'</FL>'+
       				'<FL val="Email">' + frmEmail + '</FL>'+
       		'</row></Leads>';		
  };
  
zoho.prototype.getrecordsbysearch = function(fieldName, fieldValue, department){
     if(!department){
       department = config.department
     }
  var url ="https://support.zoho.com/api/json/requests/getrecordsbysearch";

     
  var url ="https://support.zoho.com/api/json/requests/getrecordsbysearch?authtoken="+ config.supportAuthToken +"&portal="+ config.portal+ "&department="+ department +"&searchfield="+ encodeURIComponent(fieldName) +"&searchvalue=" +encodeURIComponent(fieldValue)+"&selectfields="+encodeURIComponent("Requests(created Time,status,Account Name,ACCOUNTID,Request Id,Ticket Id,Subject,Description,Phone,Email,Contact Name,CONTACTID,Department,DEP_ID");

  return  client.callApi(url,{});
};

 zoho.prototype.getrecords = function(fieldName, fieldValue, department){
   if(!department){
     department = config.department
   }
   var url ="https://support.zoho.com/api/json/requests/getrecords"
   var params = {
     "authtoken":config.supportAuthToken,
     "portal":config.portal,
     "department":department,
   }

    return  client.callApi(url,params);
};