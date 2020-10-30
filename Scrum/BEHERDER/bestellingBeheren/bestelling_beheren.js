

var request = new XMLHttpRequest(); 

function Initialize() { //this does ajax call
    request = new XMLHttpRequest();
   
    request.open("GET", "https://api.data-web.be/item/read?project=f5gh8JhjAXBd&entity=order");

    request.addEventListener("load", serverresponse);
    request.send();
}

function serverresponse() {  // this gets a reponse fro; the server (after the ajax or thanks to ajax call)
   
    var responseText = request.responseText;
   
    var responseJSON = JSON.parse(responseText);
    console.log(responseJSON);

   
    var products = responseJSON.data.items; // our products /orders are inside in the reposne  

    document.getElementById("table").innerHTML="" //here we empty our table on the website 

    // loop over all products
    for ( i = 0; i < products.length; ++i) { //here we loop over our products (orders) and instert them on the website with inserproductintable function
        
        var product = products[i];

       InsertProductInTable(product.Order_id,product.user_id, product.Order_date, product.levering_adres, product.payment_method, product.levering_method,product.levering_adres,product.product_antaal, product.totaal_prijs,product.levering_datum,product.payment_status,product.Shipped);
    }
}

function InsertProductInTable(Order_id,user_id, Order_date, levering_adres, payment_method, levering_method,levering_adres, product_antaal,totaal_prijs,levering_datum,payment_status,Shipped) {
    var tbody = document.querySelector("table#products>tbody");



    var row = tbody.insertRow();

    var cell = row.insertCell();
    cell.innerHTML =Order_id;

    cell = row.insertCell();
    cell.innerHTML =user_id;


    cell = row.insertCell();
    cell.innerHTML = Order_date;

    cell = row.insertCell();
    cell.innerHTML = levering_adres;

    cell = row.insertCell();
    cell.innerHTML = payment_method;

    cell = row.insertCell();
    cell.innerHTML = levering_method;
    
    cell = row.insertCell();
    cell.innerHTML = levering_adres;

    cell = row.insertCell();
    cell.innerHTML = product_antaal;

    cell = row.insertCell();
    cell.innerHTML = totaal_prijs;

    cell = row.insertCell();
    cell.innerHTML = levering_datum;

    cell = row.insertCell();
        if(payment_status=="false"){
        cell.innerHTML = `<input onclick='product_betaald(${Order_id})`; //everyti,e you click checkbox it's going to run product_Shipped function with the order id inside of the function
    }
     else if(payment_status==true){
        cell.innerHTML ='betaald'
    }

    cell= row.insertCell();
    if(Shipped=="0"){
        cell.innerHTML = `<input onclick='product_Shipped(${Order_id})' type='checkbox'>`; //everyti,e you click checkbox it's going to run product_Shipped function with the order id inside of the function
    }
     else if(Shipped==1){
        cell.innerHTML ='shipped'
    }
} 
function product_Shipped(Order_id){  
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.data-web.be/v1/item/single_update?project=f5gh8JhjAXBd&entity=order&id="+ Order_id + "",// checks the  order_id in the order entitiy(table) 
        "method": "PUT",
        "headers": {
          "authorization": {"Authorization": "Bearer " + sessionStorage.getItem("token")},
        },
    
        
        "data": {'values':{'Shipped':'1'}} //this will change the shipped value of tthat order to 1
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        Initialize()

      }).fail(function(fail_response){
          console.log(fail_response)
      });


}

/*function product_betaald(Order_id){  
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.data-web.be/v1/item/single_update?project=f5gh8JhjAXBd&entity=order&id="+ Order_id + "",// checks the  order_id in the order entitiy(table) 
        "method": "PUT",
        "headers": {
          "authorization": {"Authorization": "Bearer " + sessionStorage.getItem("token")},
        },
    
        
        "data": {'values':{'payment_status':'true'}} //this will change the shipped value of tthat order to 1
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        Initialize()

      }).fail(function(fail_response){
          console.log(fail_response)
      });


}*/



function filter_produc(parameter){ 
    console.log(parameter)
    request = new XMLHttpRequest();
    
    request.open("GET", "https://api.data-web.be/item/read?project=f5gh8JhjAXBd&entity=order&filter=%5B%22Shipped%22%2C%20%22LIKE%22%2C%20%22%251%25%22%5D");

   
    request.send();
 

}

function read_bert() {
    $.ajax({                    
            url: "https://api.data-web.be/item/read",
            headers: {"Authorization": "Bearer " + sessionStorage.getItem("token")},
            data: {
                "project": "LluG3gwZKPzC", 
                "entity": "test",
                "filter": ["voornaam", "LIKE", "%bert%"],
        }             
    }).done(function(json) {
        console.log("read done:");
        console.log(json);
        var items = json.data.items;                
        $("#read_content_bert").empty();
        items.forEach(function(item) {                    
            $("#read_content_bert").append("<div>" + item.id + " - " + item.voornaam + "  " + item.achternaam + "</div>");
        });

    }).fail(function (msg) {
        console.log("read fail:");
        console.log(msg);
    });
}

/* function  filter_produc(parameter){
console.log(parameter)
var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://api.data-web.be/item/read?project=f5gh8JhjAXBd&entity=order&filter=%5B%22Shipped%22%2C%20%22LIKE%22%2C%20%22%251%25%22%5D");

xhr.send(data);
} */
function filter_product(parameter){ //we get the filters fro, HTML (there are two radio buttons with filter_product onclick functions  )
    console.log(parameter)
var settings = {
    "method": "get",
    "url": "https://api.data-web.be/item/read",
    "data": {
      "project": "f5gh8JhjAXBd",
      "entity": "order",
      "filter": "[\"Shipped\", \"LIKE\", \"%"+parameter+"%\"]" //we do an ajax call with that 
    },
    "headers": {}
  }
  
  $.ajax(settings).done(function (response) {// and get a response and show it 
    console.log(response);
    var products = response.data.items;

    document.getElementById("table").innerHTML=""

    // loop over all products
    for ( i = 0; i < products.length; ++i) {
        
        var product = products[i];

       InsertProductInTable(product.Order_id,product.user_id, product.Order_date, product.levering_adres, product.payment_method, product.levering_method,product.levering_adres,product.product_antaal, product.totaal_prijs,product.levering_datum,product.payment_status,product.Shipped);
    }
  });
}

function filter_payment(parameter){ //we get the filters fro, HTML (there are two radio buttons with filter_product onclick functions  )
    console.log(parameter)
var settings = {
    "method": "get",
    "url": "https://api.data-web.be/item/read",
    "data": {
      "project": "f5gh8JhjAXBd",
      "entity": "order",
      "filter": "[\"payment_status\", \"LIKE\", \"%"+parameter+"%\"]" //we do an ajax call with that 
    },
    "headers": {}
  }
  
  $.ajax(settings).done(function (response) {// and get a response and show it 
    console.log(response);
    var products = response.data.items;

    document.getElementById("table").innerHTML=""

    // loop over all products
    for ( i = 0; i < products.length; ++i) {
        
        var product = products[i];

       InsertProductInTable(product.Order_id,product.user_id, product.Order_date, product.levering_adres, product.payment_method, product.levering_method,product.levering_adres,product.product_antaal, product.totaal_prijs,product.levering_datum,product.payment_status,product.Shipped);
    }
  });
}


