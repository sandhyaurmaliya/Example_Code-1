
var extra_beeld_teller =0
var gekozen_kleurID;

// Onchange functies
var beelden= []

function beeld_toevoegen(parameter){

    beeld = document.getElementById(`${parameter}beeldURL`).files[0]
   
    beelden.push({beeld})

    document.getElementById(`${parameter}beeldURL_path`).innerHTML = beeld.name

    document.getElementById(`${parameter}beeldURL_hidden`).value = JSON.stringify(`${beeld}`) ;
}

function controleren_checkbox(productID,kleurID,element){
    if(element.checked){
        update_gekozen_product_kleuren_op_frontend(productID,kleurID,"push")
    }else{
        update_gekozen_product_kleuren_op_frontend(productID,kleurID,"delete")
    }
}


//Als gebruiker op "voeg een nieuw beeld toe" knop klikt
function nieuw_beeld (productID){
 
    extra_beeld_teller++

    if(extra_beeld_teller==1)
    {
        toon_kleur_selection(extra_beeld_teller,productID,gekozen_kleurID)
        disable_gekozen_kleur(extra_beeld_teller, productID)

    }else if(extra_beeld_teller>1){   
        gekozen_kleurID= get_selected_kleur(extra_beeld_teller)
        gekozen_beeld =document.getElementById(`${extra_beeld_teller-1}${productID}beeldURL_hidden`).value

        
        if(gekozen_kleurID==0|| gekozen_beeld==''){
            toon_foutmeldingen(gekozen_beeld,gekozen_kleurID,extra_beeld_teller,productID)
            extra_beeld_teller--
        }else{
            update_gekozen_product_kleuren_op_frontend(productID,gekozen_kleurID,'push')

            toon_kleur_selection(extra_beeld_teller,productID,gekozen_kleurID)
            disable_gekozen_kleur(extra_beeld_teller, productID)

            disable_previous_select(extra_beeld_teller,productID)
       }
    }
}


function toon_kleur_selection(extra_beeld_teller,productID,gekozen_kleurID){
    //TOON NIEWUE BEELD UPLOAD MET KLEUR SELECTIES
    document.getElementById('nieuw_beeld').innerHTML+= 
    `<div class="md-form mb-3 mt-2">
        <label for='beeldURL'>
           <em> Beeld ${extra_beeld_teller} </em>
        </label>
        <div class="custom-file">
            <input onchange="beeld_toevoegen('${extra_beeld_teller}${productID}')" type="file" class="custom-file-input" id="${extra_beeld_teller}${productID}beeldURL" value="" >
            <input type="hidden" class="custom-file-input" id="${extra_beeld_teller}${productID}beeldURL_hidden">
            <label class="custom-file-label" for="beeldURL" id="${extra_beeld_teller}${productID}beeldURL_path">
                Kies beeld
            </label>
        </div>
    </div>
    <select class="custom-select" id='kleuren_van_database${extra_beeld_teller}'></select>`

    //Kleur opties om te kiezen 
    kleur_opties_om_te_kiezen(extra_beeld_teller,gekozen_kleurID)

    
}

function kleur_opties_om_te_kiezen(extra_beeld_teller,gekozen_kleurID){
    let kleur_selectie = document.getElementById(`kleuren_van_database${extra_beeld_teller}`)

    kleur_selectie.innerHTML =''
    kleur_selectie.innerHTML = `<option value="0">Kies kleur van het product op de bestand aub</option>`

    kleuren.forEach(kleuren => {   
        kleur_selectie.innerHTML += `<option id='kleuren_opties${kleuren.KleurID}${extra_beeld_teller}' value='${kleuren.KleurID}'>${kleuren.Omschrijving}</option>`
    });    
    
    if(extra_beeld_teller>1 && gekozen_kleurID!==undefined){
        document.getElementById(`kleuren_opties${gekozen_kleurID}${extra_beeld_teller-1}`).selected =true
        document.getElementById(`kleuren_opties${gekozen_kleurID}${extra_beeld_teller-1}`).setAttribute('selected','selected')
    }
}

function disable_gekozen_kleur(extra_beeld_teller, productID){

    gekozen_item_kleuren = zoek_gekozen_item(productID).productKleuren.items;
 
    gekozen_item_kleuren.forEach(item => {
        kleuren.forEach(kleur => {
            if(item.KleurID == kleur.KleurID){
            
              document.getElementById(`kleuren_opties${kleur.KleurID}${extra_beeld_teller}`).disabled = true
              document.getElementById(`kleuren_opties${kleur.KleurID}${extra_beeld_teller}`).style.color = '#cbcbcb'
          }
          });
      }); 
}


function get_selected_kleur(extra_beeld_teller){
    previous_beeld_selectID = Number(extra_beeld_teller)-1
    kleurID = document.getElementById(`kleuren_van_database${previous_beeld_selectID}`).value
    return kleurID
}

function toon_foutmeldingen(gekozen_beeld,gekozen_kleurID,extra_beeld_teller,productID){
    if(gekozen_kleurID==0){
        document.getElementById(`kleuren_van_database${extra_beeld_teller-1}`).style.borderColor = 'red'
        document.getElementById(`kleuren_van_database${extra_beeld_teller-1}`).style.color = 'red'
        setTimeout(() => {
            document.getElementById(`kleuren_van_database${extra_beeld_teller-1}`).style.color = 'black'    
            document.getElementById(`kleuren_van_database${extra_beeld_teller-1}`).style.borderColor = 'unset'
        }, 300);
    }
    if(gekozen_beeld==''){
        document.getElementById(`${extra_beeld_teller-1}${productID}beeldURL_path`).style.color = 'red'
        document.getElementById(`${extra_beeld_teller-1}${productID}beeldURL_path`).style.borderColor = 'red'
        setTimeout(() => {
            document.getElementById(`${extra_beeld_teller-1}${productID}beeldURL_path`).style.color = 'black'
            document.getElementById(`${extra_beeld_teller-1}${productID}beeldURL_path`).style.borderColor = 'unset'
        }, 300);
    }
}

function update_gekozen_product_kleuren_op_frontend(productID,kleurID,actie){
    gekozen_item = zoek_gekozen_item(productID);
    productKleurenArray =gekozen_item.productKleuren.items
    
    if(actie=='push'){
        productKleurenArray.push({"KleurID":kleurID})

        }else if(actie=='delete'){
        productKleurenArray.forEach(element => {
            if(element.KleurID==kleurID){
                if(extra_beeld_teller>0){
                    document.getElementById(`kleuren_opties${element.KleurID}${extra_beeld_teller}`).disabled = false
                    document.getElementById(`kleuren_opties${element.KleurID}${extra_beeld_teller}`).style.color = 'unset'
                }
                console.log(element)
                element.KleurID=''
            }
        });
    }
}


function disable_previous_select(extra_beeld_teller,productID){
    document.getElementById(`kleuren_van_database${extra_beeld_teller-1}`).disabled =true
    document.getElementById(`${extra_beeld_teller-1}${productID}beeldURL`).disabled= true   
}


// Bevestig bewerken 

function update_bijbehorende_tabellen(productID,tabel_naam,token){

    if(tabel_naam=='ProductSize'){
         //update reeds bestaande relaties      
        maten_checkboxes =document.getElementsByName('maten')
        maten_checkboxes.forEach(element => {
            if(element.checked){
                maatID = element.value
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": `https://api.data-web.be/item/create?project=f5gh8JhjAXBd&entity=${tabel_naam}`,
                    "method": "POST",
                    "headers": {
                      "authorization": `Bearer ${token}` 
                    },
                    "data": {
                      "values":{"ProductID":productID, "SizeID":maatID}
                    }
                  }
                  
                  $.ajax(settings).done(function (response) {
                    haal_en_toon_de_data ()
                  });
            }
        });
    }else if(tabel_naam=='productKleuren'){ 
        //update reeds bestaande relaties      
        checked_afbeeldingen = document.getElementsByName('beelden_checkbox')

        checked_afbeeldingen.forEach(element => {
            if(element.checked){

                let ids = element.value.split(' ')
                productID= ids[0]
                kleurID = ids[1]
                beeldID = ids[2]

                voeg_relatie_toe_op_database(productID,kleurID,beeldID)     

            }else{
                let ids = element.value.split(' ')
                beeldID = ids[2]
                verwijder_beeld(beeldID,token)
            }
            
        });
          
        //om nieuwe relaties te creëren
        if(extra_beeld_teller>0){
            for (let i = 0; i < extra_beeld_teller; i++) {

                var formData = new FormData();
                var values = {
                    "directory" : ""
                };
                formData.set("values", JSON.stringify(values));         
                
                formData.set("directory", beelden[i].beeld);
    
                $.ajax({
                    url: "https://api.data-web.be/item/create?project=f5gh8JhjAXBd&entity=Beelden",
                    type: "POST",
                    "headers": {
                        "Authorization": `Bearer ${token}`
                      },  
                      processData: false,
                      contentType: false,
                      data: formData
    
                    }).done(function(response) {
                        console.log("post done:");
                        nieuw_beeld_ID = response.data.item_id 
                        kleurID = document.getElementById(`kleuren_van_database${i+1}`).value,
                        voeg_relatie_toe_op_database(productID,kleurID,nieuw_beeld_ID)     
    
                    }).fail(function (msg) {
                    console.log("post fail:");
                    console.log(msg);
                    });
            }     
        }
    }
}


function voeg_relatie_toe_op_database(productID,kleurID,beeldID){
    var token = JSON.parse(sessionStorage.getItem('gebruiker_token'))

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://api.data-web.be/item/create?project=f5gh8JhjAXBd&entity=productKleuren",
        "method": "POST",
        "headers": {
            "Authorization": `Bearer ${token}`
          },  
          "data": {
              "values":{
                "ProductID":productID,
                "KleurID":kleurID,
                "BeeldID":beeldID
            }
          }

        }).done(function(response) {
            console.log("update done:");
            console.log(response); 
                haal_en_toon_de_data()            
            if(extra_beeld_teller>0){
                    update_gekozen_product_kleuren_op_frontend(productID, kleurID,"push")
                    disable_gekozen_kleur(extra_beeld_teller, productID)
                }    

        }).fail(function (msg) {
        console.log("update fail:");
        console.log(msg);
        });
}




function verwijder_beeld(id,token){
    $.ajax({
        url: "https://api.data-web.be/item/delete?project=f5gh8JhjAXBd&entity=Beelden",
        type: "DELETE",
        "headers": {
            "Authorization": `Bearer ${token}`
          },    
          data:{
              "filter": ["BeeldID", "=", id]
          }
    }).done(function(response) {
        console.log("delete done:");
        haal_en_toon_de_data()
    }).fail(function (msg) {
        console.log("delete fail:");
        console.log(msg.responseText);
    });
}