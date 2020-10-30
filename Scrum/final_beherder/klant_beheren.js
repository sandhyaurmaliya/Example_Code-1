var klant_data;
var gekozen_klant;
var page_setup;
var paginanummer = 1;


function krijg_klant_data()
{
    $.ajax({
          
        method: "GET",
        url: "https://api.data-web.be/item/read",
        headers: { 
            "Authorization": `Bearer ${sessionStorage.getItem('gebruiker_token')}`
          },
        data: {
            "project": "f5gh8JhjAXBd", 
            "entity": "user",
            "filter": ["role", "=", "Klant"],
            "paging": {
                "page": paginanummer,
                "items_per_page": 5
                }
        }            
                         
       
      }).done(function(response) {
        console.log(response);
        klant_data = response.data.items;
        page_setup = response.data.paging;
        console.log(page_setup);
        
        console.log(klant_data); 
        toon_klanttabel(klant_data);
                        
      
        }).fail(function (msg) {
        console.log("read fail:");
          console.log(msg);
        });
      
    }


function toon_klanttabel(klant){
    var klant = klant;
    
    document.getElementById('klant').innerHTML = ''

    klant.forEach(element => {  
        
            document.getElementById('klant').innerHTML +=
    
            `<tr>
            <th scope='row'>${element.user_id}</th>
            <td>${element.email}</td>
            <td>${element.familienaam}</td>
            <td>${element.voornaam}</td>
            <td>${element.adres}</td>
            <td>${element.telefoon}</td>
            <td style='text-align-last: center;'>
             
            <input class="form-check-input" type="checkbox" onclick = set_klant_status('${element.user_id}','${element.active}') value="${element.active}" id="active${element.user_id}">
            <label class="form-check-label" for="active${element.user_id}">                
            </label>
         
            </td>             
        
            <td>  
                <button onclick='toon_modal("bewerken","${element.user_id}")' type="button" class="btn btn-primary" data-toggle="modal" data-target="#klantModal">
                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                </button>   
                <button onclick='toon_modal("verwijderen","${element.user_id}")' type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalverwijderen">
                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>               
            </td>
            </tr>`
            
    }); 
    
    klant.forEach(element => {
        if(element.active == 1){
            document.getElementById(`active${element.user_id}`).checked = true;
        }
        });

        navigatie_bar_knoppen(page_setup.page)   
}

function bevestig(actie,id){
    gebruiker_token = sessionStorage.getItem('gebruiker_token')
    var klant_status;
    if (document.getElementById('klant_status').checked == true){
        klant_status = 1
        }
    else
        {
            klant_status = 0;
        }

         if(actie=='toevoegen'){
             console.log("addrequest")
          if ($("#email").val()!==''&& $("#password").val() !=='' && $("#familienaam").val() !==''  && $("#voornaam").val() !=='' && $("#adres").val() !=='' && $("#telefoon").val() !=='' && klant_status !== undefined)
          { 
            console.log("addrequest2")           
          $.ajax({
              url: "https://api.data-web.be/item/create?project=f5gh8JhjAXBd&entity=user",
              "headers": { 
                "Authorization": `Bearer ${gebruiker_token}`
              },  
              
              method: "POST",
              data: {
              values : {                    
                        "email": $("#email").val(),
                        "password": $("#password").val(),
                        "familienaam": $("#familienaam").val(),
                        "voornaam": $("#voornaam").val(),
                        "adres":$("#adres").val(),
                        "telefoon": $("#telefoon").val(),
                        "role": "Klant",
                        "active": klant_status,                       
                        }   
                    }          
          }).done(function(response) {
            console.log(response); 
            $('#modalbevestig').modal('show')                   
          
            krijg_klant_data();              
                            
          
            }).fail(function (msg) {
            console.log("create fail:");
              console.log(msg);
            });
        }
      }
         
      if (actie == 'bewerken'){           
          
          $.ajax({
                  url: "https://api.data-web.be/item/update?project=f5gh8JhjAXBd&entity=user",
                  headers: {"Authorization": `Bearer ${gebruiker_token}`}, 
                   
                  type: "PUT",

                  data: {
                    values : {
                          
                              "email": $("#email").val(),
                              "password": $("#password").val(),
                              "familienaam": $("#familienaam").val(),
                              "voornaam": $("#voornaam").val(),
                              "adres":$("#adres").val(),
                              "telefoon": $("#telefoon").val(),
                              "role": "Klant",
                              "active": klant_status,
                             
                              }   ,
                              
                        "filter": ["user_id", "=", id]
                          },
                    

          }).done(function(response) {
              console.log("update done:");
              console.log(response);    
              krijg_klant_data();

          }).fail(function (msg) {
              console.log("update fail:");
              console.log(msg);
          }); 
      } 
  
      if(actie == 'verwijderen'){

        
          $.ajax({
              url: "https://api.data-web.be/item/delete?project=f5gh8JhjAXBd&entity=user",
              type: "DELETE",
              "headers": {
                  "Authorization": `Bearer ${gebruiker_token}`
                },    
                data:{
                    "filter": ["user_id", "=", id]
                }
          }).done(function(response) {
              console.log("delete done:");
              if (response.status.success == true) {
                krijg_klant_data();
              }        
              else {
                  console.log("not deleted"); 
              }
          }).fail(function (response) {
              console.log("delete fail:");
             console.log(response);   
             var error_msg = response.responseJSON.status.error_code;           
              console.log(error_msg);
              if (error_msg == 23000)
              {
                alert("deze klant heeft een bestelling");
              }

          });
      } 
  }


function afmelden(){
    var gebruiker_token = sessionStorage.getItem('gebruiker_token')
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.data-web.be/user/logout?=f5gh8JhjAXBd",
        "method": "GET",
        "headers": {
          "authorization": `Bearer ${gebruiker_token}`
        }
      }
    $.ajax(settings).done(function (response) {
        session_control()
    }).fail(function (msg) {
        console.log("delete fail:");
        console.log(msg.responseText);
    });
      
}

function zoek_gekozen_item(klantID){
    gekozen_klant = [];
    
    klant_data.forEach(element => {
        if(element.user_id == klantID){
            gekozen_klant = element
        }
    });
    return gekozen_klant
}
function toon_modal(actie, klantID){

    if(actie =='toevoegen'){
      document.getElementById('klantModalLabel').innerHTML = "Klant Toevoegen"
        document.getElementById('email').value = ''
        document.getElementById('password').value = ''
        document.getElementById('familienaam').value = ''
        document.getElementById('voornaam').value = ''
        document.getElementById('adres').value = ''
        document.getElementById('telefoon').value = ''
        //document.getElementById('role').value = ''
        //document.getElementById('active').value = '' 
        
     document.getElementById("bevestig_toevoeg_of_bewereken").setAttribute("onclick",`bevestig('${actie}','${klantID}')`); 
           
    }  
    
    if (actie =='bewerken'){
        gekozen_klant = zoek_gekozen_item(klantID);

        document.getElementById('klantModalLabel').innerHTML = "Klant Bewerken"
        document.getElementById('email').value = gekozen_klant.email
        document.getElementById('password').value = gekozen_klant.password
        document.getElementById('familienaam').value = gekozen_klant.familienaam
        document.getElementById('voornaam').value = gekozen_klant.voornaam
        document.getElementById('adres').value = gekozen_klant.adres
        document.getElementById('telefoon').value = gekozen_klant.telefoon
       // document.getElementById('role').value = gekozen_klant.role
        document.getElementById('klant_status').value = gekozen_klant.active 
        if ( gekozen_klant.active == 1) {
            document.getElementById('klant_status').checked = true
        } 
        else{
            document.getElementById('klant_status').checked = false 
        } 

        document.getElementById("bevestig_toevoeg_of_bewereken").setAttribute("onclick",`bevestig('${actie}','${klantID}')`);  
        
 
    }  
    
    if(actie =='verwijderen'){
     gekozen_klant = zoek_gekozen_item(klantID);

        document.getElementById('verwijderen_container').innerHTML =`Wenst u het <strong> ${gekozen_klant.voornaam}</strong> te verwijderen?`
        document.getElementById("bevestig_verwijderen").setAttribute("onclick",`bevestig('${actie}','${klantID}')`);    
 
    }
}

function filter_waarde()
{
   
    var  zoekwaarde = document.getElementById('zoekwaardefilter').value;
  console.log(zoekwaarde)
  
  $.ajax({   
    
    url: "https://api.data-web.be/item/read?project=f5gh8JhjAXBd&entity=user",      
    method: "GET",
    headers: { 
        "Authorization": `Bearer ${sessionStorage.getItem('gebruiker_token')}`
      },
    data: {         
        
        "filter": ["CONCAT(user_id,email, voornaam, familienaam, adres, telefoon)", "LIKE", "%"+zoekwaarde+"%"],
        
            }                     
   
            }).done(function(response) {
            console.log(response);
            klant_data = response.data.items; 
            console.log(klant_data);
            toon_klanttabel(klant_data);                 


            }).fail(function (msg) {
            console.log("read fail:");
            console.log(msg);
            });
  
  }   
  
  function set_klant_status(user_id, active){
        gebruiker_token = sessionStorage.getItem('gebruiker_token')
        gekozen_klant = zoek_gekozen_item(user_id);
        console.log(gekozen_klant)

        if (active == 0){
            state= 1;
        }
        else{
            state = 0;
        }
        gekozen_klant.active = state;

        $.ajax({
                  url: "https://api.data-web.be/item/update?project=f5gh8JhjAXBd&entity=user",
                  headers: {"Authorization": `Bearer ${gebruiker_token}`},                    
                  type: "PUT",
                  data: {
                    values : {                       
                              
                              "active": gekozen_klant.active,
                             
                              }   ,
                              
                        "filter": ["user_id", "=", user_id]
                          },
                    

          }).done(function(response) {
              console.log("update done:");
              console.log(response); 
              krijg_klant_data();
              
              
               
          }).fail(function (msg) {
              console.log("update fail:");
              console.log(msg);
          }); 
  }

  function navigatie(gekozen_page){
    paginanummer = gekozen_page
    krijg_klant_data()
}

function navigatie_bar_knoppen(gekozen_page){

    const navigatie_bar = document.getElementById('paginas')

    //Previous button
    if(gekozen_page==1){
        previousDisable='disabled'
    }else{
        previousDisable=''
    }

    navigatie_bar.innerHTML =`
    <li class="page-item ${previousDisable}" style="position: absolute; left: 15px;">
        <a onclick="navigatie(${Number(gekozen_page)-1})" class="page-link" href="javascript:;">
            Vorige
        </a>
    </li>`

    //Page numbers
    for (let paginanummer = 0; paginanummer < page_setup.page_count; paginanummer++) {
        if (paginanummer == gekozen_page-1){
            activeState = 'active'
        }else{
            activeState = ''
        }
        document.getElementById('paginas').innerHTML+=`
        <li class="page-item ${activeState}">
            <a onclick="navigatie(${paginanummer+1})" class="page-link" href="javascript:;">${paginanummer+1}</a>
        </li>`
    }
    //Next button
    if(gekozen_page==page_setup.page_count){
        disableNext='disabled'
    }else{
        disableNext = ''
    }
    navigatie_bar.innerHTML+=`
    <li class="page-item ${disableNext}"  style="position: absolute; right: 15px;">
        <a onclick="navigatie(${Number(gekozen_page)+1})" class="page-link" href="javascript:;">
            Volgende
        </a>
    </li>
    `
}

function toggleDarkMode(){
    
    if(document.getElementById('darkmode').checked == true){
        document.getElementById('stylesheet').setAttribute('href','darkmode.css')
        document.getElementById('product_tabel').className = "table table-striped table-bordered table-dark"
        document.getElementById('dark_mode_txt').innerHTML = 'Light Mode'
    }else{
        document.getElementById('stylesheet').setAttribute('href',' ')
        document.getElementById('product_tabel').className = "table table-striped table-bordered"
        document.getElementById('dark_mode_txt').innerHTML = 'Dark Mode'
    }
}
