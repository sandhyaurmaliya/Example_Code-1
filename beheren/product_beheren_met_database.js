var productData;
var page_setup;
var categorieen;
var gekozen_item;
var selectie = 'id';
var paginanummer = 1;
var gezochte_waarde =''

/////////////////////////////  SESSIE CONTROLEREN ////////////////////////

if(document.body.className == 'heeft_autorisatiesleutel_nodig'){
    window.addEventListener("focus", session_control ()); 
}

function session_control(){
    var gebruiker_token = JSON.parse(sessionStorage.getItem('gebruiker_token'))

        var authorization = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.data-web.be/user/validate_token?project=CFNIOuwTJGyR",
            "method": "GET",
            "headers": {
              "authorization": `Bearer ${gebruiker_token}`
            }
          }
          
          $.ajax(authorization)
          .done(function (response) {
            haal_en_toon_de_data ()
          })
          .fail(function(response){
              if(response.responseJSON.status.message =="401: Current token is not valid." || response.responseJSON.status.message == "1: Token is invalid."){
                    document.location = 'login.html'
                }
          })
}

////////////////////////  DATA KRIJGEN EN TONEN ////////////////////////////

function haal_en_toon_de_data (){

    var producten_tabel = {
        url: "https://api.data-web.be/item/read",
        data: {
            "project": "CFNIOuwTJGyR", 
            "entity": "Producten",
            "filter": gezochte_waarde, 
            "sort":'[[\"' +selectie+'\", \"ASC\"]]',
            "paging": {
                "page": `${paginanummer}`,
                "items_per_page": 4
            }
      }
    }

    var categorie_tabel = {
        url: "https://api.data-web.be/item/read",
        data: {
            "project": "CFNIOuwTJGyR", 
            "entity": "Categorieen",
      }
    }  
      
    $.ajax(categorie_tabel)
    .done(function (categorie_response) {
        categorieen = categorie_response.data.items

        $.ajax(producten_tabel)
        .done(function(product_response){
            page_setup = product_response.data.paging
            productData = product_response.data.items
            map_naam = product_response.data.assets_path
            toon_producttabel()
          })
    });

}

function toon_producttabel(){
    
    document.getElementById('producten').innerHTML = ''

    productData.forEach(element => {
        var categorieNaam = vind_categorie_naam(categorieen,(element.CategoryID))
            
            document.getElementById('producten').innerHTML +=
            `<tr>
            <th scope='row'>${element.id}</th>
            <td>${element.naam}</td>
            <td>
                <img src='https:${map_naam}/${element.beeldURL.name}' height='60px'>
            </td>
            <td>${categorieNaam}</td>
            <td>${element.prijs}</td>
            <td class='p-0 pt-1 pl-1'>
                <textarea rows="3" cols="55" style='border:none; width: 100%; box-sizing: border-box;'
                >${element.omschrijving}
                </textarea>
            </td>
            <td>  
                <button onclick='bewerken_popup(${element.id})' type="button" class="btn btn-primary" data-toggle="modal" data-target="#productModal">
                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                </button>   
                <button onclick='verwijderen_popup(${element.id})' type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalverwijderen">
                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>                
            </td>
            </tr>`
    });    
    navigatie_bar_knoppen(page_setup.page)
}

function vind_categorie_naam(categorieen,categorieID){
    var categorieNaam;
    categorieen.forEach(element=>{
        if(categorieID == element.ID){
            categorieNaam = element.Naam
        }
    })
    return categorieNaam
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

function navigatie(gekozen_page){
    paginanummer = gekozen_page
    haal_en_toon_de_data()
}

////////////////////// VERANDEREN DATA //////////////////////////

function toon_categorieen_opties(productID){
    let categorieenHTML;
    let selectie = document.getElementById('categorie')
    selectie.innerHTML =''
    selectie.innerHTML = `<option value="${productID}">Kies Product Categorie</option>`
        
    categorieen.forEach(categorie => {   
        if(categorie.ID == productID){
            categorieenHTML+= `<option value='${categorie.ID}' selected>${categorie.Naam}</option>`
        }else{
            categorieenHTML+= `<option value='${categorie.ID}'>${categorie.Naam}</option>`
        }
    });
    selectie.innerHTML+= categorieenHTML
}

function beeld_toevoegen(){
    var beeld = document.getElementById('beeldURL').files[0]
    document.getElementById('beeldURL_path').innerHTML = beeld.name
    document.getElementById('origineel_beeldURL').value = `${JSON.stringify(beeld)}`
}

function product_toevoegen_popup(){
    document.getElementById('productModalLabel').innerHTML = "Product Toevoegen"
    document.getElementById('naam').value = ''
    document.getElementById('omschrijving').value = ''
    document.getElementById('prijs').value = ''
    document.getElementById('categorie').value = ''
    toon_categorieen_opties(0)
    document.getElementById('origineel_beeldURL').value = ''
    document.getElementById('beeldURL_path').innerHTML = "Kies beeld"   
    actie = 'toevoegen'
}


function bewerken_popup (productID){
    gekozen_item = zoek_gekozen_item(productID);
    document.getElementById('productModalLabel').innerHTML = "Product Bewerken"
    document.getElementById('naam').value = gekozen_item.naam
    document.getElementById('omschrijving').value = gekozen_item.omschrijving
    document.getElementById('prijs').value = gekozen_item.prijs
    document.getElementById('origineel_beeldURL').value = `${JSON.stringify(gekozen_item.beeldURL)}`
    document.getElementById('beeldURL_path').innerHTML = gekozen_item.beeldURL.name
    toon_categorieen_opties(gekozen_item.CategoryID)
    actie = 'bewerken'

}

function verwijderen_popup (productID){
    gekozen_item = zoek_gekozen_item(productID);
    document.getElementById('verwijderen_container').innerHTML =`Weenst u het <strong> ${gekozen_item.naam}</strong> te verwijderen?`
    actie = "verwijderen"
}

function zoek_gekozen_item(productID){
    
    productData.forEach(element => {
        if(element.id == productID){
            gekozen_item = element
        }
    });
    return gekozen_item
}

/////////////////////////////// BEVESTIG DE WIJZIGINGEN /////////////////////////////
function bevestig(){
    var gebruiker_token = JSON.parse(sessionStorage.getItem('gebruiker_token')) 
    var naam = document.getElementById('naam').value
    var omschrijving= document.getElementById('omschrijving').value
    var prijs = document.getElementById('prijs').value
    var CategoryID = document.getElementById('categorie').value
  
      if(actie=='toevoegen'){
          var formData = new FormData();
          var values = {
              "naam": naam,
              "omschrijving": omschrijving,
              "prijs" : prijs,
              "CategoryID" : CategoryID,
              "beeldURL" : ""
          };
          formData.set("values", JSON.stringify(values));         
          formData.set("beeldURL", document.getElementById('beeldURL').files[0]);
          
          $.ajax({
              url: "https://api.data-web.be/item/create?project=CFNIOuwTJGyR&entity=Producten",
              type: "POST",
              "headers": {
                  "Authorization": `Bearer ${gebruiker_token}`
                },  
                processData: false,
                contentType: false,
              data: formData
          }).done(function(response) {
              haal_en_toon_de_data (paginanummer)
          })
      }
         
      if (actie == 'bewerken'){
          var formData = new FormData();
          var values = {
              "naam": naam,
              "omschrijving": omschrijving,
              "prijs" : prijs,
              "CategoryID" : CategoryID,
              "beeldURL" : document.getElementById('origineel_beeldURL').value
          };
          formData.set("values", JSON.stringify(values));         
          formData.set("filter", JSON.stringify(["id", "=", gekozen_item.id]));
          formData.set("beeldURL", document.getElementById('beeldURL').files[0]);
          
          $.ajax({
                  url: "https://api.data-web.be/item/update?project=CFNIOuwTJGyR&entity=Producten",
                  headers: {"Authorization": `Bearer ${gebruiker_token}`},  
                  type: "PUT",
                  processData: false,
                  contentType: false,
                  data: formData  
          }).done(function(response) {
              console.log("update done:");
              console.log(response);    
              if (response.status.success == true) {
                  haal_en_toon_de_data(paginanummer)             
              }        
              else {
                  console.log("not updated"); 
              }
          }).fail(function (msg) {
              console.log("update fail:");
              console.log(msg);
          }); 
      } 
  
      if(actie == 'verwijderen'){
          $.ajax({
              url: "https://api.data-web.be/item/delete?project=CFNIOuwTJGyR&entity=Producten",
              type: "DELETE",
              "headers": {
                  "Authorization": `Bearer ${gebruiker_token}`
                },    
              data: {                
                  "filter": [
                          ["id", "=", gekozen_item.id]
                      ]
                  }
          }).done(function(response) {
              console.log("delete done:");
              if (response.status.success == true) {
                  haal_en_toon_de_data(paginanummer)
              }        
              else {
                  console.log("not deleted"); 
              }
          }).fail(function (msg) {
              console.log("delete fail:");
              console.log(msg.responseText);
          });
      } 
  }

////////////////////////////////////////////////////////////////////////////////////////////

function sorteer(){
     selectie = document.getElementById('sorteer').value
     haal_en_toon_de_data()
}


function filter_waarde(gezochte_box){
    waarde = document.getElementById(gezochte_box+'_filter').value;

     if(gezochte_box == 'prijs'){
        gezochte_waarde= "[\""+gezochte_box+"\", \">\", \""+waarde+"\"]"
    }else{
        gezochte_waarde= "[\""+gezochte_box+"\", \"LIKE\", \"%"+waarde+"%\"]"
    } 
    paginanummer = 1
    haal_en_toon_de_data()
}

function afmelden(){
    var gebruiker_token = JSON.parse(sessionStorage.getItem('gebruiker_token'))
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.data-web.be/user/logout?project=CFNIOuwTJGyR",
        "method": "GET",
        "headers": {
          "authorization": `Bearer ${gebruiker_token}`
        }
      }
    $.ajax(settings).done(function (response) {
        session_control()
    });
      
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


