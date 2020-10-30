var productData;
var page_setup;
var gekozen_categorie=''
var gekozen_item;
var paginanummer = 1;
var gezochte_waarde =''
var tabelNaam_omte_sorteeren ='ProductID'
var order_direction='ASC'
var categorieen;
var kleuren;
var maten;


/////////////////////////////  SESSIE CONTROLEREN ////////////////////////

if(document.body.className == 'heeft_autorisatiesleutel_nodig'){
    window.addEventListener("focus", session_control ()); 
}

function session_control(){
    var gebruiker_token = JSON.parse(sessionStorage.getItem('gebruiker_token'))

    var authorization = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.data-web.be/user/validate_token?project=f5gh8JhjAXBd",
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
              if(response.responseJSON.status.message =="401: Current token is not valid." || response.responseJSON.status.message == "Token is invalid."){
                    document.location = 'login.html'
                }
          })
}

////////////////////////  DATA KRIJGEN EN TONEN ////////////////////////////

function haal_en_toon_de_data (){
    initialiseren()

    $.ajax({
        method: "GET",
        url: "https://api.data-web.be/item/read",
        data: {
            "project": "f5gh8JhjAXBd", 
            "entity": "Producten",
            "filter": gezochte_waarde,
            "sort":`[["${tabelNaam_omte_sorteeren}", "${order_direction}"]]`,
            "relation":
                        [{"pri_entity":"Producten", "pri_key":"ProductID", "sec_entity": "ProductSize", "sec_key": "ProductID"},
                        {"pri_entity":"Producten", "pri_key":"ProductID", "sec_entity": "productKleuren", "sec_key": "ProductID"},
                        {"pri_entity":"Producten", "pri_key":"Product_typ", "sec_entity": "product_typ", "sec_key": "productTypeID"},
                        {"pri_entity":"ProductSize", "pri_key":"SizeID", "sec_entity": "size", "sec_key": "size_id"},
                        {"pri_entity":"productKleuren", "pri_key":"KleurID", "sec_entity": "Kleuren", "sec_key": "KleurID"},
                        {"pri_entity":"productKleuren", "pri_key":"BeeldID", "sec_entity": "Beelden", "sec_key": "BeeldID"}
                     ], 
            "paging": {
                        "page": paginanummer,
                        "items_per_page": 4
                        }
                }            
        }).done(function(response) {
            console.log(response)
            console.log(gezochte_waarde)
            productData = response.data.items;     
            page_setup = response.data.paging
            path =response.data.assets_path
            toon_producttabel(productData)  
            krijg_de_benodigde_tabellen('Kleuren')
            krijg_de_benodigde_tabellen('product_typ')
            krijg_de_benodigde_tabellen('size')

        }).fail(function (msg) {
            console.log("read fail:");
            console.log(msg);
        });             

}

function krijg_de_benodigde_tabellen(tabel){
    $.ajax({
        method: "GET",
        url: "https://api.data-web.be/item/read",
        data: {
            "project": "f5gh8JhjAXBd", 
            "entity": tabel
        }
    }).done(function(response) {

        if(tabel=='product_typ'){
            categorieen = response.data.items
        } else if(tabel=='Kleuren'){
            kleuren = response.data.items
        }else if(tabel == 'size'){
            maten = response.data.items
        }
    }).fail(function (msg) {
        console.log("read fail:");
        console.log(msg);
    });   
}



function toon_producttabel(producten){
    
    document.getElementById('producten').innerHTML = ''

    producten.forEach(element => {

        document.getElementById('producten').innerHTML +=
            `<tr>
            <th scope='row'>${element.ProductID}</th>
            <td>${element.ProductNaam}</td>
     
            <td>${element.product_typ.items[0].product_type_naam}</td>
            <td>${element.Prijs}</td>
            <td>
            ${element.product_oms}
            </td>
            <td id='beeld${element.ProductID}'>

            </td>
            <td>
                <div id='maat${element.ProductID}' class='row'></div>
            </td>
            <td>  
                <button onclick='toon_modal("bewerken","${element.ProductID}","${element.Product_typ}")' type="button" class="btn btn-primary" data-toggle="modal" data-target="#productModal">
                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                </button>   
                <button onclick='toon_modal("verwijderen","${element.ProductID}")' type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalverwijderen">
                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>                
            </td>
            </tr>`
            //reeds_bestaande_beelden_op_tabel
            kleuren_array= element.productKleuren.items
            for (let i = 0; i < kleuren_array.length; i++) {

                const kleur = kleuren_array[i].Kleuren.items[0].Omschrijving;
                const urlPath = kleuren_array[i].Beelden.assets_path
                const beeldURL = kleuren_array[i].Beelden.items[0].directory.name;

                document.getElementById(`beeld${element.ProductID}`).innerHTML +=`
                <div style=' width: fit-content; display: inline-block; padding:10px'>
                    <img src='${urlPath}/${beeldURL}' width='50px'> 
                    <br>
                    ${kleur}
                </div>`
            }
            //reeds_bestaande_maten_op_tabel
            maten_array = element.ProductSize.items
            for (let i = 0; i < maten_array.length; i++) {
                const maat = maten_array[i].size.items[0].size_oms;

                document.getElementById(`maat${element.ProductID}`).innerHTML +=`
                <div class='col-3'>
                ${maat}
                </div>` 
            }            
    });    

    navigatie_bar_knoppen(page_setup.page)
}


//////////////////////  MODALMANAGEMENT OP BASIS VAN PRODUCT EN ACTIE //////////////////////////


function zoek_gekozen_item(productID){
    
    productData.forEach(element => {
        if(element.ProductID == productID){
            gekozen_item = element
        }
    });
    return gekozen_item
}

function toon_modal(actie, productID){
    gekozen_item=[]
    beelden=[]
    document.getElementById('nieuw_beeld').innerHTML=''
    document.getElementById('nieuw_beeld_knop').setAttribute("onclick",`nieuw_beeld('${productID}')`);    
    document.getElementById('gekozen_productID').innerHTML = productID

  /*   if(actie =='toevoegen'){
        document.getElementById('productModalLabel').innerHTML = "Product Toevoegen"
        document.getElementById('naam').value = ''
        document.getElementById('omschrijving').value = ''
        document.getElementById('prijs').value = ''
        document.getElementById('categorie').value = ''
        toon_categorieen_opties(0)
        document.getElementById('origineel_beeldURL').value = ''
        document.getElementById('beeldURL_path').innerHTML = "Kies beeld" 
        document.getElementById("bevestig").setAttribute("onclick",`bevestig('${actie}','${productID}')`);    
    }  
     */
    if (actie =='bewerken'){

        gekozen_item = zoek_gekozen_item(productID);

        document.getElementById('productModalLabel').innerHTML = "Product Bewerken - "
        document.getElementById('naam').value = gekozen_item.ProductNaam
        document.getElementById('omschrijving').value = gekozen_item.product_oms
        document.getElementById('prijs').value = gekozen_item.Prijs

        toon_categorieen_opties(gekozen_item)
        toon_bestaande_maat_opties(gekozen_item)
        toon_bestaande_afbeelding_opties(gekozen_item,productID)
        toon_bestaande_kleuren ()
        
        document.getElementById("bevestig").setAttribute("onclick",`bevestig_bewerken("${productID}")`);    

    }  
     
    if(actie =='verwijderen'){
        gekozen_item = zoek_gekozen_item(productID);
        console.log(gekozen_item)

        document.getElementById('verwijderen_container').innerHTML =`Weenst u het <strong> ${gekozen_item.ProductNaam}</strong> te verwijderen?`
        document.getElementById("bevestig_verwijderen").setAttribute("onclick",`bevestig_verwijderen('${productID}')`);    

    } 
}

function bevestig_verwijderen(id){
    var token = JSON.parse(sessionStorage.getItem('gebruiker_token'))

    $.ajax({
        url: "https://api.data-web.be/item/delete?project=f5gh8JhjAXBd&entity=Producten",
        type: "DELETE",
        "headers": {
            "Authorization": `Bearer ${token}`
          },    
          data:{
              "filter": ["ProductID", "=", id]
          }
    }).done(function(response) {
        console.log("delete done:");
       haal_en_toon_de_data()
    }).fail(function (msg) {
        console.log("delete fail:");
        console.log(msg.responseText);
    });
}

function toon_categorieen_opties(gekozen_item){
    gekozen_item_categorie_ID = gekozen_item.Product_typ;


    let categorieenHTML;
    let selectie = document.getElementById('categorie')
    selectie.innerHTML =''
    selectie.innerHTML = `<option value="0">Kies Product Categorie</option>`
        
    categorieen.forEach(categorie => {   
        if(categorie.productTypeID == gekozen_item_categorie_ID){
            categorieenHTML+= `<option value='${categorie.productTypeID}' selected>${categorie.product_type_naam}</option>`
        }else{
            categorieenHTML+= `<option value='${categorie.productTypeID}'>${categorie.product_type_naam}</option>`
        }
    });
    selectie.innerHTML+= categorieenHTML
}

function toon_sub_tabel_bewerken_modal(tabel_naam){  

    document.getElementById('productModal').style.zIndex = '1040'

    if(tabel_naam=='categorie'){
        modal_titel = `Nieuwe categorie`
        
        modal_content =`
        <form>
            <div class="form-group">
                <input type="text" class="form-control" id="nieuwe_categorienaam" aria-describedby="nieuwe_categorienaam" placeholder="Schrijf een nieuwe categorienaam">
                <small class="form-text text-muted">Zorg ervoor dat u geen typefout maakt</small> 
                <br>
                <div class="custom-file">
                    <input onchange="beeld_toevoegen('categorie_')" type="file" class="custom-file-input" id="categorie_beeldURL">
                    <input type="hidden" class="custom-file-input" id="categorie_beeldURL_hidden">
                    <label class="custom-file-label" for="categorie_beeldURL" id="categorie_beeldURL_path">
                        Kies beeld voor categorieen pagina
                    </label>
                    <small class="form-text text-muted">Idealiter zou de afbeelding moeten hebben: width = 400px; height = 533px</small> 
                    <br>
                </div>
                <div class="custom-file">
                    <input onchange="beeld_toevoegen('categorie_slide_')" type="file" class="custom-file-input" id="categorie_slide_beeldURL" value="" multiple>
                    <input type="hidden" class="custom-file-input" id="categorie_slide_beeldURL_hidden">
                    <label class="custom-file-label" for="categorie_slide_beeldURL" id="categorie_slide_beeldURL_path">
                        Kies beeld voor slideshow
                    </label>
                    <small class="form-text text-muted">Idealiter zou de afbeelding moeten hebben: width = 1295px; height = 539px;
                    </small> 
                    <br>
                </div>
                <br>
                <input type="text" class="form-control" id="nieuwe_slide_text" aria-describedby="nieuwe_slide_text" placeholder="Schrijf een nieuwe slideshow text">
                <small class="form-text text-muted">maximaal 30 woorden</small> 
            </div>
        </form>`
        onclick_parameter = 'categorie'

    } else if(tabel_naam == 'maat'){
        modal_titel = `Nieuwe maat`
        modal_content =`
        <input type="text" class="form-control" id="nieuwe_maatnaam" aria-describedby="nieuwe_maatnaam" placeholder="Schrijf een nieuwe maatnaam">
        <small class="form-text text-muted">Definieer uw maat met een letter</small>`
        onclick_parameter = 'maat'

    } else if(tabel_naam=='kleur'){
        modal_titel= 'Nieuwe kleur'
        modal_content=`
        <input type="text" class="form-control" id="nieuwe_kleurnaam" aria-describedby="nieuwe_kleurnaam" placeholder="Schrijf een nieuwe kleur">
        <small class="form-text text-muted">Zorg ervoor dat het alstublieft nog niet bestaat</small>
        `
        onclick_parameter = 'kleur'
    }

    document.getElementById('nieuw_op_database_modal_titel').innerHTML = modal_titel
    document.getElementById('nieuw_op_database_modal_body').innerHTML = modal_content;
    productID=document.getElementById('gekozen_productID').innerHTML
    document.getElementById('bevestig_post_database').setAttribute('onclick',`post_sub_table_changes_on_database("${onclick_parameter}","${productID}")`)
}

function post_sub_table_changes_on_database(tabel_naam,geopened_productID){
    var gebruiker_token = JSON.parse(sessionStorage.getItem('gebruiker_token')) 
    var entity='';
    var values={};
    var formData = new FormData();

    if(tabel_naam=='categorie'){

        entity = "product_typ"
        var neiuwe_categorienaam = document.getElementById('nieuwe_categorienaam').value
        var neiuwe_categorie_slideTxt = document.getElementById('nieuwe_slide_text').value
        values = {
              "product_type_naam": neiuwe_categorienaam,
              "Omschrijving": neiuwe_categorie_slideTxt,
              "voorbeeldafbeelding" : document.getElementById('categorie_beeldURL_hidden').value,
              "slideshowimage" : document.getElementById('categorie_slide_beeldURL_hidden').value
          };
        formData.set("values", JSON.stringify(values));         
        formData.set("voorbeeldafbeelding", document.getElementById('categorie_beeldURL').files[0]);
        formData.set("slideshowimage", document.getElementById('categorie_slide_beeldURL').files[0]);
   
    } else if(tabel_naam=='maat'){
        entity = "size"

        var nieuwe_maatnaam = document.getElementById('nieuwe_maatnaam').value.toUpperCase()
        values = {
            "size_oms": nieuwe_maatnaam
        }
        formData.set("values", JSON.stringify(values)); 

    }else if(tabel_naam=='kleur'){
        entity = "Kleuren"

        var nieuwe_kleurnaam = document.getElementById('nieuwe_kleurnaam').value
        values = {
            "Omschrijving": nieuwe_kleurnaam
        }
        formData.set("values", JSON.stringify(values));         
    }

    $.ajax({
        url: `https://api.data-web.be/item/create?project=f5gh8JhjAXBd&entity=${entity}`,
        type: 'POST',
        "headers": {
            "Authorization": `Bearer ${gebruiker_token}`
          },  
          processData: false,
          contentType: false,
          data: formData
      
      }).done(function(response) {
        if(tabel_naam=='categorie'){
            new_cat_id = response.data.item_id
            categorieen.push( {
              "productTypeID": new_cat_id,
              "product_type_naam": neiuwe_categorienaam,
              "Omschrijving": neiuwe_categorie_slideTxt,
              "voorbeeldafbeelding" : document.getElementById('categorie_beeldURL_hidden').value,
              "slideshowimage" : document.getElementById('categorie_slide_beeldURL_hidden').value
          })
            toon_categorieen_opties(geopened_productID)
        } else if(tabel_naam =='maat'){
            new_maat_id = response.data.item_id
            maten.push({
                'size_id': new_maat_id,
                'size_oms':nieuwe_maatnaam})

            toon_bestaande_maat_opties(geopened_productID) 
        } else if(tabel_naam=='kleur'){
            new_kleur_id =response.data.item_id
            kleuren.push({
                "KleurID": new_kleur_id,
                "Omschrijving": nieuwe_kleurnaam
            })

            toon_bestaande_kleuren (geopened_productID)
            
            extra_beeld_teller;
            if(extra_beeld_teller>0){
                kleur_opties_om_te_kiezen(extra_beeld_teller,new_kleur_id)
                disable_gekozen_kleur(extra_beeld_teller, geopened_productID)
            }
        }
      }).fail(function(response){
          console.log(response)
      })

    sluit_sub_tabel_bewerken_modal_af()
}

function sluit_sub_tabel_bewerken_modal_af(){
    document.getElementById('productModal').style.zIndex = '1060'
}


function toon_bestaande_maat_opties(gekozen_item){

    gekozen_item_maten= gekozen_item.ProductSize.items

    document.getElementById('maten').innerHTML = '';
    //Toon alle maat opties
    maten.forEach(maat_element => {
        document.getElementById('maten').innerHTML += `
            <div class="form-check ml-2 col-2">
                <input class="form-check-input" type="checkbox" value="${maat_element.size_id}" name='maten' id="maat_op_modal${maat_element.size_id}">
                <label class="form-check-label" for="maat_op_modal${maat_element.size_id}">
                    ${maat_element.size_oms}
                </label>
            </div>`   
    });

    //Check the old versions
    gekozen_item_maten.forEach(item => {
        maten.forEach(database_element => {
        if(database_element.size_id == item.SizeID){
            document.getElementById(`maat_op_modal${database_element.size_id}`).checked = true
        }
        });
    });
}

function toon_bestaande_afbeelding_opties(gekozen_item,productID){
    document.getElementById('bestaande_afbeelding').innerHTML = '';

    gekozen_item_kleur_en_beeld_relatie = gekozen_item.productKleuren.items;

    gekozen_item_kleur_en_beeld_relatie.forEach(element => {
        console.log(element)
        beeldURL = element.Beelden.items[0].directory.name
        beeldPath = element.Beelden.assets_path
        kleurID =element.KleurID
        beeldID = element.BeeldID

        document.getElementById('bestaande_afbeelding').innerHTML += `
            <div class="form-check ml-2 col-2">
                <input class="form-check-input" type="checkbox" value="${productID} ${kleurID} ${beeldID}" name='beelden_checkbox' onclick='controleren_checkbox(${productID},${kleurID},this)' checked>
                <label class="form-check-label" for="beeld_op_modal${kleurID}">
                    ${element.Kleuren.items[0].Omschrijving}
                </label>
                <img src='//api.data-web.be/files/f5gh8JhjAXBd/Beelden/${beeldURL}' width=30px>
            </div>`   
    });
}

function toon_bestaande_kleuren (){

    document.getElementById('bestaande_kleuren').innerHTML =''

    kleuren.forEach(element => {
        document.getElementById('bestaande_kleuren').innerHTML += `<div class='col-3' style='color: grey;'>${element.Omschrijving}</div>`
    });
}



/////////////////////////////// BEVESTIG DE WIJZIGINGEN VAN HET SPECIFIEKE PRODUCT EN DE BIJBEHORENDE TABELLEN /////////////////////////////


function bevestig_bewerken(productID){
    var gebruiker_token = JSON.parse(sessionStorage.getItem('gebruiker_token'))

    var formData = new FormData();
    var values = {
        "ProductNaam": document.getElementById('naam').value,
        "product_oms": document.getElementById('omschrijving').value,
        "Prijs" : document.getElementById('prijs').value,
        "Product_typ" : document.getElementById('categorie').value
    };
    formData.set("values", JSON.stringify(values));         
    formData.set("filter", JSON.stringify(["ProductID", "=", productID]));
    
    $.ajax({
            url: "https://api.data-web.be/item/update?project=f5gh8JhjAXBd&entity=Producten",
            headers: {"Authorization": `Bearer ${gebruiker_token}`},  
            type: "PUT",
            processData: false,
            contentType: false,
            data: formData  

    }).done(function(response) {
        console.log("update done:");
        leeg_entiteiten(productID,'ProductSize',gebruiker_token)
        leeg_entiteiten(productID,'productKleuren',gebruiker_token)
    }).fail(function (msg) {
        console.log("update fail:");
        console.log(msg);
    }); 

}

function leeg_entiteiten(productID,tabel_naam,token){
    
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://api.data-web.be/item/delete?project=f5gh8JhjAXBd&entity=${tabel_naam}`,
        "method": "DELETE",
        "headers": {
          "authorization": `Bearer ${token}` 
        },
        "data": {
          "filter": `[\"ProductID\", \"=\",\"${productID}\"]`
        }
      }
      
      $.ajax(settings).done(function (response) {

        update_bijbehorende_tabellen(productID,tabel_naam,token)
 
      });
}



//////////////////////////////////// andere  functionaliteiten ////////////////////////////////////////////////////////
var ascending_order = true
var last_element;

function sorteer(table_name,element){

    if(last_element==element){
        ascending_order = !ascending_order
    }else{
        ascending_order=true
    }
    
    sort_opties=document.getElementsByName('sorteer')

    sort_opties.forEach(span => {
        span.innerHTML =''
    });

    if(ascending_order){
        sign =`
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
        </svg>`
        order_direction= 'ASC'
    }else{
        sign = `
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>`
        order_direction = 'DESC'
    }

    element.firstElementChild.innerHTML = sign

    tabelNaam_omte_sorteeren = table_name
    
    last_element=element
    
    haal_en_toon_de_data()
}


function filter_waarde(gezochte_box){
    zoekwaarde = document.getElementById(gezochte_box+'_filter').value;

    if(gezochte_box == 'Prijs'){
        gezochte_waarde= [[gezochte_box, ">", zoekwaarde]]
    }else{
        gezochte_waarde= [["CONCAT(ProductNaam, ' ', product_oms, ' ', ProductID, ' ', Prijs)", "LIKE", "%"+zoekwaarde+"%"]]
    } 
    paginanummer = 1
    haal_en_toon_de_data()
}

function afmelden(){
    var gebruiker_token = JSON.parse(sessionStorage.getItem('gebruiker_token'))
    
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.data-web.be/user/logout?project=f5gh8JhjAXBd",
        "method": "GET",
        "headers": {
          "authorization": `Bearer ${gebruiker_token}`
        }
      }
    $.ajax(settings)
    .done(function (response) {
        console.log(response)
        sessionStorage.setItem('gebruiker_token',' ')
        session_control()
    }).fail(function(response){
        console.log(res)
        
    })

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
function initialiseren(){
    extra_beeld_teller =0;
    gekozen_categorie=''
    gekozen_item=[]
}
