Date.prototype.addDays= function(d){
  this.setDate(this.getDate() + d);
  return this;
};


function start_bestelling(){
  toon_winkelwagantje();
  session_control();
  krijgklant_infromatie();
  krijglevering_method();

}

function krijgklant_infromatie()
  {
    var email = sessionStorage.getItem('gebruiker')
    var token = sessionStorage.getItem('token')
    if (token == null || token == "afgemeld")
    {
      document.location = "login.html"
    }
    else{
        $.ajax({
              
            method: "GET",
            url: "https://api.data-web.be/item/read",
            "headers": {
              "authorization": `Bearer ${token}`
            },
            
            data: {
                "project": "f5gh8JhjAXBd", 
                "entity": "user",
                "filter": ["email","LIKE","%" +email+ "%"]                   
                  }            
          
          }).done(function(response) {
            console.log(response);
            var klant_informatie = response.data.items;
            console.log(klant_informatie); 
            toonleveringinfo(klant_informatie) ;                    
            
            }).fail(function (msg) {
            console.log("read fail:");
              console.log(msg);
            });    
        } 
    }



function bestel_producten(){

    winkelwagantje_producten = winkelwagengegevens_ophalen();
    document.getElementById("bestell_prodcuten1").innerHTML = "";
    var total_producten = document.getElementById("hoeveelProducten").innerHTML;
    document.getElementById("totaal_antaal_producten").innerHTML = total_producten ;

    winkelwagantje_producten.forEach(element => {
      if(element!==null){
    
    document.getElementById("bestell_prodcuten1").innerHTML +=
    `
    <li class="list-group-item d-flex justify-content-between lh-condensed">
      <div>
        <h6 class="my-0">${element.naam}</h6>
        <small id="gekozen_eigenschappen1" class="text-muted">${element.maatnaam} - ${element.kleurnaam}</small>
        <br>
        <small id="gekozen_eigenschappen" >${element.aantal} stuk</small>
      </div>
      <img height="80px" src="${element.beeld}" alt="">
      <div class="col-4 antaal">
          <div class="row bedrag_wijzigen">
            <p class="product_antaal_knop"  onclick="bedrag_wijzigen('-','${element.id}','${element.kleurid}','${element.maatid}', 'bestelling')">-</p>
            <p class='product_antaal' type="text" id="product_id_1" >${element.aantal}</p>
            <p class="product_antaal_knop"  onclick="bedrag_wijzigen('+','${element.id}','${element.kleurid}','${element.maatid}' ,'bestelling')">+</p>
          </div>
        </div>      
      <span id="product_prijs" class="text-muted">€ ${element.prijs * element.aantal}</span>
    </li>`

  }
  });

  toon_kost_op_bestelling()
}

function bereken_totaal(){

  totaal_prijs_voor_levering = berekenTotal_prijs()
  levering_kost = krijg_levering_kost();
  if (levering_kost== 'gratis'){
    levering_kost =0;
  }
  eindtotaal = Number(totaal_prijs_voor_levering)+ Number(levering_kost);
  eindtotaal = Number(eindtotaal.toFixed(2))
  return eindtotaal;

}


function krijg_levering_kost(){
  leveringmethods = document.getElementsByName('leveringmethodes')
  leveringmethods.forEach(element => {
    if(element.checked){
      gekozen_levering_kost = element.value
    }
  });
return gekozen_levering_kost;

} 


function toon_kost_op_bestelling(){     
  totaal_prijs_voor_levering = berekenTotal_prijs()
  gekozen_levering_kost= krijg_levering_kost()
  eindtotaal = bereken_totaal();

  document.getElementById("totaal_prijs").innerHTML ='€ '+ totaal_prijs_voor_levering 
  document.getElementById('gekozen_leveringkost').innerHTML ='€ '+ gekozen_levering_kost 
  document.getElementById('totaal_met_levering').innerHTML = '€ '+ eindtotaal 

   
}

function krijglevering_method()
  {
    $.ajax({
          
        method: "GET",
        url: "https://api.data-web.be/item/read",
        data: {
            "project": "f5gh8JhjAXBd", 
            "entity": "leveringmethod",            
              }            
       
      }).done(function(response) {
        var levering_method = response.data.items;
        console.log(levering_method); 
        toonleveringmethod(levering_method) ;                    
      
        }).fail(function (msg) {
        console.log("read fail:");
          console.log(msg);
        });     
    }

    

function toonleveringmethod(levering_method){

  document.getElementById("leveringmethodes").innerHTML = "";
      for (let i = 0; i < levering_method.length; i++) {
        if(i==0){
          state='checked'
        }else{
          state = ''
        }
      
      document.getElementById("leveringmethodes").innerHTML += 
      ` <div class="custom-control custom-radio">
      <input onclick='toon_kost_op_bestelling()' id="${levering_method[i].leverinhmethod}" name="leveringmethodes" type="radio" class="custom-control-input" value ="${levering_method[i].leveringcharge}" ${state}>
      <label class="custom-control-label" for="${levering_method[i].leverinhmethod}">${levering_method[i].leverinhmethod}</label>
      </div>
       ` 
       if(levering_method[i].leveringcharge=='gratis'){
           option=`<div class="custom-control"> Gratis </div>`
       } else{
           option =`<div class="custom-control">€ ${levering_method[i].leveringcharge} </div>`
       }
       document.getElementById("levering_method_kosten").innerHTML += option

        
       };     
       bestel_producten();
  }

    function toonleveringinfo(klant) {
      var klant_informatie = klant[0]
      console.log(klant_informatie)
      document.getElementById('levering_voornaam').value = klant_informatie.voornaam      
      document.getElementById('levering_naam').value = klant_informatie.familienaam      
      document.getElementById('levering_email').value = klant_informatie.email      
      document.getElementById('levering_adres').value = klant_informatie.adres      
      document.getElementById('hidden_klant_id').value = klant_informatie.user_id      

    }   
    
    function bevestig_bestelling()
  {

    // user_id   
    var user_id = document.getElementById('hidden_klant_id').value    
    //order_date
    var Order_date = new Date().toString().substring(4, 15) ;
    //levering_adres
    var levering_adres =  document.getElementById('levering_adres').value
    //payment_methods
    var methods = document.getElementsByName("paymentMethod")
    var payment_method;
    methods.forEach(element => {
        if (element.checked){
          payment_method = element.value;
        }
      });
    //leveringMethod
    var opties = document.getElementsByName("leveringmethodes")
    var leveringMethod;
    opties.forEach(element => {
      if (element.checked){
        console.log(element.id) 
        console.log(element.value)
        leveringMethod = element.id;
        }
      });
    //product_antaal
    var product_antaal = document.getElementById("totaal_antaal_producten").innerHTML;
    //totaal_prijs
    var totaal_prijs =  bereken_totaal();

    //	levering_datum
      var levering_datum = new Date().addDays(0);
 
      if(leveringMethod.includes('dezelfde')){
        levering_datum = new Date().addDays(0).toString().substring(4, 15)
      }else if (leveringMethod.includes('7-10')){
        levering_datum = new Date().addDays(10).toString().substring(4, 15)
      } else if(leveringMethod.includes('afhaalpunt')){
        levering_datum = new Date().addDays(30).toString().substring(4, 15)
      } 
      
    // payment_status
    
    var payment_status = false
    if(payment_method =='Debit card'){
        payment_status = true
    } 
    


   $.ajax({               
          url: "https://api.data-web.be/item/create?project=f5gh8JhjAXBd&entity=order",
          headers: {"Authorization": "Bearer " +sessionStorage.getItem("token")}, 
          method: "POST",
            data: {
              values : {
                "user_id": user_id,
                "Order_date": Order_date,
                "levering_adres": levering_adres,
                "payment_method": payment_method,
                "levering_method":leveringMethod,
                "product_antaal": product_antaal,
                "totaal_prijs": totaal_prijs,
                "levering_datum": levering_datum,
                "payment_status": payment_status,
                "Shipped":0
              }   
        }            
    }).done(function(response) {
        orderID= response.data.item_id
      // ajax-verzoek om de betalingsstatus waar of niet waar te controleren
         $.ajax({               
          method: "GET",
          url: "https://api.data-web.be/item/single_read",
          data: {
              "project": "f5gh8JhjAXBd", 
              "entity": "order",
              "id": orderID
            }
        }).done(function(response) {

          status = response.data.item.payment_status
          console.log(response)
          //ALS PAYMENT STATUS SUCCESVOL IS
          if(status=='true'){
            
            document.getElementById('payment_status').innerHTML = `
            <div class="jumbotron">
            <h1 class="display-4">Bedankt voor uw aankoop!</h1>
            <p class="lead">Uw aankoop is succesvol verlopen en wordt vandaag verzonden. Je bestelling wordt uiterlijk <strong> ${levering_datum} </strong>bezorgd.</p>
            <p>Uw bestellings-ID:<span class='text-muted'> ${orderID}</span></p>
              <hr class="my-4">
            <p>
            <a href="index.html" type="button" class="btn btn-primary" >Ga naar homepagina</a>
            </div>`;
            document.getElementById('payment_failed_button').innerHTML = ''

            var bestelde_producten = winkelwagengegevens_ophalen()

             bestelde_producten.forEach(element => {
              if(element!==null){ //wanneer je een product uit het winkelwagantje verwijdert, staan er null-elementen in de array, daarom gebruiken we dit
                $.ajax({               
                  url: "https://api.data-web.be/item/create?project=f5gh8JhjAXBd&entity=orderedproduct",
                  headers: {"Authorization": "Bearer " +sessionStorage.getItem("token")}, 
                  method: "POST",
                    data: {
                      values : {
                        "product_id": element.id,
                        "order_id": orderID,
                        "antaal": element.aantal,
                        "gekozen_kluer_id": element.kleurid,
                        "gekozen_maat_id":element.maatid
                      }   
                }            
                }).done(function(response){
                  sessionStorage.removeItem('winkelwagantje')

                  setTimeout(() => {
                      document.location = 'index.html'
                  }, 6000);

                }).fail(function(response){
                  console.log(response)
                })
              }
            }); 

          // ALS BETALING NIET SUCCESVOL IS
          }else{
            document.getElementById('payment_status').innerHTML = 'Betaling is niet gelukt. Probeer een andere betaalmethode'
            document.getElementById('payment_failed_button').innerHTML = `
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Ga terug</button>
            `
          }

        }).fail(function (msg) {
          console.log("read fail:");
          console.log(msg.responseText);
        }); 
    }).fail(function (msg) {
        console.log("read fail:");
        console.log(msg.responseText);
    }); 
    }





