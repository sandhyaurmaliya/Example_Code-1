
class AJAX_READ {
    constructor(data){
        this.method= "GET",
        this.url= "https://api.data-web.be/v1/item/read",
        this.data = data    
    }
    run(done_callback, fail_callback){

        $.ajax(this)
        .done(function(response) {
            return done_callback(response);
        }).fail(function (msg) {
            return fail_callback(msg)
        });   
    }
}


class AJAX_DELETE {
    constructor(entity,filter){
        this.async = true,
        this.crossDomain  = true,
        this.url = `https://api.data-web.be/item/delete?project=f5gh8JhjAXBd&entity=${entity}`,
        this.method = 'DELETE',
        this.headers = {"Authorization": `Bearer ${sessionStorage.getItem('gebruiker_token')}`},
        this.data = {
            "filter":filter
        }
    }
    
    run(done_callback, fail_callback){

        $.ajax(this)
        .done(function(response) {
            return done_callback(response);
        }).fail(function (msg) {
            return fail_callback(msg)
        });   

    }
}

class AJAX_CREATE_UPDATE {
    constructor(actie,entity,method,formData){
        this.async = true,
        this.crossDomain  = true,
        this.url = `https://api.data-web.be/item/${actie}?project=f5gh8JhjAXBd&entity=${entity}`,
        this.method = method,
        this.headers = {"Authorization": `Bearer ${sessionStorage.getItem('gebruiker_token')}`},
        this.processData= false,
        this.contentType= false,
        this.data = formData
    }
    
    run(done_callback, fail_callback){

        $.ajax(this)
        .done(function(response) {
            return done_callback(response);
        }).fail(function (msg) {
            return fail_callback(msg)
        });   

    }
}


/////////////////////////// initialiseren ///////////////////////////

var gekozen_categorie=''
var gekozen_item=[]

function standaard_waarden(){
    extra_beeld_teller =0;
    gekozen_categorie=''
    gekozen_item=[]
    gekozen_kleuren=[]
    gekozen_beelden=[]
    onnodige_bestanden=[]
}

function initialiseren (){
    standaard_waarden()
    krijg_en_toon_producten()
    krijg_de_nodige_tabellen('product_typ')
    krijg_de_nodige_tabellen('Kleuren')
    krijg_de_nodige_tabellen('size') 
}

//standaard query-instellingen
var gezochte_waarde =''
var kolomnaam_om_te_sorteren ='ProductID'
var order_richting='ASC'
var paginanummer = 1;
var pagina_instellingen;
var producten_gegevens;

function krijg_en_toon_producten(){
    data= {
        "project": "f5gh8JhjAXBd", 
        "entity": "Producten",
        "filter": gezochte_waarde,
        "sort":`[["${kolomnaam_om_te_sorteren}", "${order_richting}"]]`,
        "relation":[{"pri_entity":"Producten", "pri_key":"ProductID", "sec_entity": "ProductSize", "sec_key": "ProductID"},
                    {"pri_entity":"Producten", "pri_key":"ProductID", "sec_entity": "productKleuren", "sec_key": "ProductID"},
                    {"pri_entity":"Producten", "pri_key":"Product_typ", "sec_entity": "product_typ", "sec_key": "productTypeID"},
                    {"pri_entity":"ProductSize", "pri_key":"SizeID", "sec_entity": "size", "sec_key": "size_id"},
                    {"pri_entity":"productKleuren", "pri_key":"KleurID", "sec_entity": "Kleuren", "sec_key": "KleurID"},
                    {"pri_entity":"productKleuren", "pri_key":"BeeldID", "sec_entity": "Beelden", "sec_key": "BeeldID"}],
        "paging": {
                    "page": paginanummer,
                    "items_per_page": 3
                    }
        }            
    
    new AJAX_READ(data).run(function(done_response){
        pagina_instellingen = done_response.data.paging
        producten_gegevens=done_response.data.items
        toon_producten(producten_gegevens)

    },fail=>console.log(fail))

}

/// noodzakelijke tabellen voor het creëren van relaties
var categorieen_array;
var kleuren_array;
var maten_array;

function krijg_de_nodige_tabellen(tabel){
    data= {
        "project": "f5gh8JhjAXBd", 
        "entity": tabel
    } 
    new AJAX_READ(data).run(function(response){

        if(tabel=='product_typ'){
            categorieen_array = response.data.items
        } 
        else if(tabel=='Kleuren'){
            kleuren_array = response.data.items
        } 
        else if(tabel == 'size'){
            maten_array = response.data.items
        }
        
    },fail=>console.log(fail))

}



///////////////////////////////// PRODUCT TOEVOEGEN  ////////////////////////////////////////////

function toon_product_toevoegen_modal(){
    document.getElementById('gekozen_productID').innerHTML = ""
    document.getElementById('productModalLabel').innerHTML = "Product Toevoegen"
    document.getElementById('naam').value = ''
    document.getElementById('omschrijving').value = ''
    document.getElementById('nieuw_beeld').innerHTML=''
    document.getElementById('prijs').value = ''
    document.getElementById('bestaande_afbeelding').innerHTML = ''
    toon_categorieen_opties()
    toon_bestaande_maat_opties()
    toon_bestaande_kleuren ()
    document.getElementById('nieuw_beeld_knop').setAttribute("onclick",`controle_beeldinvoer()`);    
    document.getElementById("bevestig").setAttribute("onclick",`controleer_bevestig('toevoegen')`);   
    
    document.getElementById('naam').className = 'form-control'
    document.getElementById('omschrijving').className = 'form-control'
    document.getElementById('prijs').className = 'form-control'
    document.getElementById('categorie').style.borderColor =''

    $('#productModal').modal('show')
}

function toon_categorieen_opties(productID){
    let categorieenHTML;
    let selectie = document.getElementById('categorie')
    selectie.innerHTML =''

    if(productID ==undefined){
        categorieenHTML+= `<option value="0">Kies Product Categorie</option>`
    }

    gekozen_item_categorie_ID = gekozen_item.Product_typ;

    categorieen_array.forEach(categorie => {   
        if(categorie.productTypeID == gekozen_item_categorie_ID){
            categorieenHTML+= `<option value='${categorie.productTypeID}' selected>${categorie.product_type_naam}</option>`
        }else{
            categorieenHTML+= `<option value='${categorie.productTypeID}'>${categorie.product_type_naam}</option>`
        }
    });
    
    selectie.innerHTML+= categorieenHTML
}


function toon_bestaande_maat_opties(gekozen_item){

    document.getElementById('maten').innerHTML = '';

    //Toon alle maat opties
    maten_array.forEach(element => {
        document.getElementById('maten').innerHTML += `
            <div class="form-check ml-2 col-2">
                <input class="form-check-input" type="checkbox" value="${element.size_id}" name='maten' id="maat_op_modal${element.size_id}">
                <label class="form-check-label" for="maat_op_modal${element.size_id}">
                    ${element.size_oms}
                </label>
            </div>`   
    });

    //Controleer bestaande maten    
    if(gekozen_item !==undefined){
        gekozen_item_maten= gekozen_item.ProductSize.items
        
        maten_array.forEach(database_element => {
            gekozen_item_maten.forEach(item => {
            if(database_element.size_id == item.SizeID){
                document.getElementById(`maat_op_modal${database_element.size_id}`).checked = true
            }
            });
        });
    }
}

var extra_beeld_teller =0;

function controle_beeldinvoer(){
    if(extra_beeld_teller==0){
        nieuw_beeld ()
    }else{
        var vorige_afbeelding = document.getElementById(`${extra_beeld_teller}beeldURL_hidden`).value
        var vorige_kleur = document.getElementById(`kleuren_van_database${extra_beeld_teller}`).value

        if(vorige_afbeelding=='' || vorige_kleur == 0){
            toon_ongeldige_nieuwe_afbeelding(vorige_afbeelding,vorige_kleur,extra_beeld_teller)
        }else{
            nieuw_beeld()
        }
    }

}
function nieuw_beeld (){

    extra_beeld_teller++

    toon_afbeelding_upload(extra_beeld_teller)
    toon_kleuropties_voor_de_afbeelding(extra_beeld_teller)
    kleuren_uitschakelen()

    if(extra_beeld_teller>1){
        update_vorige_selecteren(extra_beeld_teller-1)
    }
}


function toon_afbeelding_upload(extra_beeld_teller){

    document.getElementById('nieuw_beeld').innerHTML+= 
    `<div class="md-form mb-3 mt-2">
        <label for='beeldURL'>
           <em> Beeld ${extra_beeld_teller} </em>
        </label>
        <div class="custom-file">
            <input onchange="beeld_toevoegen('${extra_beeld_teller}')" type="file" class="custom-file-input" id="${extra_beeld_teller}beeldURL" value="" >
            <input type="hidden" class="custom-file-input" id="${extra_beeld_teller}beeldURL_hidden">
            <label class="custom-file-label" for="beeldURL" id="${extra_beeld_teller}beeldURL_path">
                Kies beeld
            </label>
        </div>
    </div>
    <select class="custom-select" id='kleuren_van_database${extra_beeld_teller}' onchange="sla_de_laatst_gekozen_kleur_op(this,${extra_beeld_teller})"></select>`
}



function toon_kleuropties_voor_de_afbeelding(extra_beeld_teller){
    let kleur_selectie = document.getElementById(`kleuren_van_database${extra_beeld_teller}`)

    kleur_selectie.innerHTML =''
    kleur_selectie.innerHTML = `<option value="maak een keuze">Kies kleur van het product op de bestand aub</option>`

    kleuren_array.forEach(element => {   
        kleur_selectie.innerHTML += `<option id='kleuren_opties${element.KleurID}${extra_beeld_teller}' value='${element.KleurID}'>${element.Omschrijving}</option>`
    });    
    
}

var gekozen_kleuren=[]

function kleuren_uitschakelen(){

    if(gekozen_kleuren[0]!==undefined &&extra_beeld_teller>0){
        kleuren_array.forEach( kleur=> {

            document.getElementById(`kleuren_opties${kleur.KleurID}${extra_beeld_teller}`).disabled = false
            document.getElementById(`kleuren_opties${kleur.KleurID}${extra_beeld_teller}`).style.color = ''

            gekozen_kleuren.forEach(item => {
                if(kleur.KleurID ==item.KleurID){
                    document.getElementById(`kleuren_opties${kleur.KleurID}${extra_beeld_teller}`).disabled = true
                    document.getElementById(`kleuren_opties${kleur.KleurID}${extra_beeld_teller}`).style.color = '#cbcbcb'
                }
            });
        });             
    }
}

/// ONCHANGE FUNCTIE 
function sla_de_laatst_gekozen_kleur_op(selectie,index){

    var KleurID = selectie.value

    if(KleurID !=='maak een keuze'){
        if(gekozen_kleuren.length==0){
            gekozen_kleuren.push({"KleurID": KleurID, "Index": index, "Status":'nieuw'})
        }else{
            gekozen_kleuren.forEach(element => {
                if(element.Index ==index){
                    element.KleurID = KleurID
                    status ='al in de array'
                }else{
                    status = 'nieuw'
                }
            });

            if(status=='nieuw'){
                gekozen_kleuren.push({"KleurID": KleurID,"Index": index,"Status":'nieuw'})
                status ='al in de array'
            }
        }
    }
} 

function update_vorige_selecteren (extra_beeld_teller){

    gekozen_kleuren.forEach(element => {
       
        if(extra_beeld_teller==element.Index){
            document.getElementById(`kleuren_opties${element.KleurID}${extra_beeld_teller}`).selected =true
            document.getElementById(`kleuren_opties${element.KleurID}${extra_beeld_teller}`).setAttribute('selected','selected')
        }
    });

    document.getElementById(`kleuren_van_database${extra_beeld_teller}`).disabled =true
    document.getElementById(`${extra_beeld_teller}beeldURL`).disabled= true   
}


function toon_ongeldige_nieuwe_afbeelding(gekozen_beeld,gekozen_kleurID,extra_beeld_teller){
    if(gekozen_kleurID==0){
        document.getElementById(`kleuren_van_database${extra_beeld_teller}`).style.borderColor = 'red'
        document.getElementById(`kleuren_van_database${extra_beeld_teller}`).style.color = 'red'
        setTimeout(() => {
            document.getElementById(`kleuren_van_database${extra_beeld_teller}`).style.color = 'unset'    
            document.getElementById(`kleuren_van_database${extra_beeld_teller}`).style.borderColor = ' #ced4da'
        }, 300);
    }
    if(gekozen_beeld==''){
        document.getElementById(`${extra_beeld_teller}beeldURL_path`).style.color = 'red'
        document.getElementById(`${extra_beeld_teller}beeldURL_path`).style.borderColor = 'red'
        setTimeout(() => {
            document.getElementById(`${extra_beeld_teller}beeldURL_path`).style.color = 'unset'
            document.getElementById(`${extra_beeld_teller}beeldURL_path`).style.borderColor = '#ced4da'
        }, 300);
    }
}

var gekozen_beelden=[]

function beeld_toevoegen(index){

    var beeld = document.getElementById(`${index}beeldURL`).files[0]

    if(gekozen_beelden.length==0){
        gekozen_beelden.push({
            "file": beeld,
            "index":index,
            "id": 'nieuw'
        })
    }else{
        gekozen_beelden.forEach(element => {
            if(element.index ==index){
                element.file = beeld
            }else{
                gekozen_beelden.push({
                    "file": beeld,
                    "index":index,
                    "id": 'nieuw'
                })
            }
        });
    }

    document.getElementById(`${index}beeldURL_path`).innerHTML = beeld.name
    document.getElementById(`${index}beeldURL_hidden`).value = JSON.stringify(`${beeld}`) ;

}


function toon_bestaande_kleuren (){

    document.getElementById('bestaande_kleuren').innerHTML =''

    kleuren_array.forEach(element => {
        document.getElementById('bestaande_kleuren').innerHTML += `<div class='col-3' style='color: grey;'>${element.Omschrijving}</div>`
    });
}


function controleer_bevestig(actie,id){
    
    var maten_checked = false
    
    naam= document.getElementById('naam')
    omschrijving = document.getElementById('omschrijving')
    prijs = document.getElementById('prijs')
    categorie = document.getElementById('categorie')

    if(naam.value==''){
        naam.className += ' is-invalid'
        naam.placeholder = 'Naam is vereist '
    }

    if(omschrijving.value ==''){
        omschrijving.className +=' is-invalid'
        omschrijving.placeholder ='Omschrijving is vereist'
    }

    if(prijs.value==''){
        prijs.className +=' is-invalid'
        prijs.placeholder = 'Prijs is vereist'
    }

    if(categorie.value=='0'){
        categorie.style.borderColor ='red'
    }

    maten_checkboxes =document.getElementsByName('maten')
    maten_checkboxes.forEach(element => {
        if(element.checked){
            maten_checked = true
        }
    })
    if(maten_checked==false){
        maten_checkboxes.forEach(element => {
            element.style.borderColor = 'red'
            setTimeout(() => {
                element.style.borderColor = ''
            }, 500);
        });
    }   

    if(gekozen_kleuren.length==0 || gekozen_beelden.length==0){
        document.getElementById('kies_afbeelding').innerHTML = 'je kunt geen product toevoegen zonder foto'
        document.getElementById('kies_afbeelding').style.color = 'red'  
        document.getElementById('nieuw_beeld_knop').style.color ='red'

        setTimeout(() => {
            document.getElementById('kies_afbeelding').style.color = '' 
            document.getElementById('nieuw_beeld_knop').style.color =''
 
        }, 500);
    }


    if(naam.value!==''&& omschrijving.value!=='' && prijs.value !=='' && categorie.value!=='0' && maten_checked==true && gekozen_kleuren.length>0 && gekozen_beelden.length>0){
        
        if(actie=='toevoegen'){
            bevestig_toevoegen()
            $('#productModal').modal('hide')
            $(".modal-backdrop").remove();    
        }else if(actie =='bewerken'){
            bevestig_bewerken(id)
            $('#productModal').modal('hide')
            $(".modal-backdrop").remove();    
        }

    }else{

        document.getElementById('bevestig').className ="btn btn-danger ml-1 ripple-surface"
        setTimeout(() => {
            document.getElementById('bevestig').className ="btn btn-primary ml-1 ripple-surface"

        }, 400);
    }
} 


function bevestig_toevoegen(){
    var formData = new FormData();
    var values = {
        "ProductNaam": document.getElementById('naam').value,
        "product_oms": document.getElementById('omschrijving').value,
        "Prijs" : document.getElementById('prijs').value,
        "Product_typ" : document.getElementById('categorie').value
    };
    formData.set("values", JSON.stringify(values));         

    new AJAX_CREATE_UPDATE('create','Producten','POST',formData).run(function(done){
        console.log("create done");

        nieuw_product_ID = done.data.item_id

        update_bijbehorende_tabellen('ProductSize',nieuw_product_ID)
        update_bijbehorende_tabellen('productKleuren',nieuw_product_ID)

    },function(fail){
        console.log(fail)
    })
}

function update_bijbehorende_tabellen(entity,productID){

    if(entity=='ProductSize'){

        maten_checkboxes =document.getElementsByName('maten')

        maten_checkboxes.forEach(element => {
            if(element.checked){
                var formData = new FormData();
                maatID = element.value

                values={"ProductID":productID, "SizeID":maatID}
                formData.set("values", JSON.stringify(values));         

                new AJAX_CREATE_UPDATE('create','ProductSize','POST',formData)
                .run(function(done){
                    initialiseren()
                },function(fail){
                        console.log(fail)
                        console.log('create fail')
                })

            }
        });
    }
    
    if(entity=='productKleuren'){ 
      
        for (let i = 0; i < gekozen_kleuren.length; i++) {
            console.log(gekozen_kleuren)
            if(gekozen_kleuren[i].Status=='oud'){
                update_kleurenbeeldrelatie(productID, gekozen_kleuren[i].KleurID,gekozen_kleuren[i].BeeldID)
            }else if(gekozen_kleuren[i].Status =="nieuw"){
                nieuw_afbeeldingsbestand = gekozen_beelden[i].file
                maak_een_nieuwe_afbeelding_op_de_database(nieuw_afbeeldingsbestand,productID, gekozen_kleuren[i].KleurID)
            }
        }

        for (let index = 0; index < onnodige_bestanden.length; index++) {
            const beeldID = onnodige_bestanden[index].beeldID;
            filter= ["BeeldID", "=", beeldID]

            new AJAX_DELETE('Beelden',filter).run(done=>
                initialiseren ()
                ,fail=>console.log(fail))
        }
    }
}


function update_kleurenbeeldrelatie(productID,kleurID,beeldID){
    var formData = new FormData();
    values={
        "ProductID":productID,
        "KleurID":kleurID,
        "BeeldID":beeldID
    }
    formData.set("values", JSON.stringify(values));         

    new AJAX_CREATE_UPDATE('create','productKleuren','POST',formData).run(function(done){
        console.log("update done:");        
        console.log(done); 
        initialiseren()            
    },function(fail){
        console.log('create fail')
        console.log(fail)
    })
}

function maak_een_nieuwe_afbeelding_op_de_database(file,productID,kleurID){
    var formData = new FormData();
    var values = {
        "directory" : ""
    };
    formData.set("values", JSON.stringify(values));         
    
    formData.set("directory", file);

    new AJAX_CREATE_UPDATE('create','Beelden','POST',formData)
    .run(function(done_response){

        nieuw_beeld_ID = done_response.data.item_id 
        update_kleurenbeeldrelatie(productID,kleurID,nieuw_beeld_ID) 

    },function(fail){
        console.log("post fail:");
        console.log(fail);
    })
}

if(document.body.className=='product_beheren'){
  document.getElementById('naam').addEventListener('keydown',function(event){
  document.getElementById('naam').className = 'form-control'
  })
  document.getElementById('omschrijving').addEventListener('keydown',function(event){
  document.getElementById('omschrijving').className = 'form-control'
  })
  document.getElementById('prijs').addEventListener('keydown',function(){
  document.getElementById('prijs').className = 'form-control'
  })
  document.getElementById('categorie').addEventListener('change',function(){
  document.getElementById('categorie').style.borderColor =''
  })
  document.addEventListener('focus',function(){
  })
}
////////////////////////////////////////////////////////////// TABEL ////////////////////////////////////////////////////////////
function toon_producten(producten){
    
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
                <button onclick='toon_bewerken_modal("${element.ProductID}")' type="button" class="btn btn-primary">
                    <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                </button>   
                <button onclick='toon_verwijder_modal("${element.ProductID}")' type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalverwijderen">
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

    navigatie_bar_knoppen(pagina_instellingen.page)
}


//////////////////////////////////////////////////// BEWERKEN //////////////////////////////////////////////////////////////
function toon_bewerken_modal(id){
    item = haal_het_gekozen_item_op(id)

    document.getElementById('gekozen_productID').innerHTML = item.ProductID
    document.getElementById('productModalLabel').innerHTML = `Product Bewerken -`
    document.getElementById('naam').value = item.ProductNaam
    document.getElementById('omschrijving').value = item.product_oms
    document.getElementById('prijs').value = item.Prijs
    document.getElementById('bestaande_afbeelding').innerHTML = ''
    document.getElementById('nieuw_beeld').innerHTML=''

    toon_categorieen_opties()
    toon_bestaande_maat_opties(item)
    toon_bestaande_afbeelding_opties(item,item.ProductID)
    toon_bestaande_kleuren ()
    document.getElementById('nieuw_beeld_knop').setAttribute("onclick",`controle_beeldinvoer()`);    
    document.getElementById("bevestig").setAttribute("onclick",`controleer_bevestig('bewerken','${id}')`);   
    
    document.getElementById('naam').className = 'form-control'
    document.getElementById('omschrijving').className = 'form-control'
    document.getElementById('prijs').className = 'form-control'
    document.getElementById('categorie').style.borderColor =''
    $('#productModal').modal('show')
}

function haal_het_gekozen_item_op(productID){
    
    producten_gegevens.forEach(element => {
        if(element.ProductID == productID){
            gekozen_item = element
        }
    });
    return gekozen_item
}

function toon_bestaande_afbeelding_opties(gekozen_item,productID){
    document.getElementById('bestaande_afbeelding').innerHTML = '';

    gekozen_item_kleur_en_beeld_relatie = gekozen_item.productKleuren.items;

    gekozen_item_kleur_en_beeld_relatie.forEach(element => {

        beeldURL = element.Beelden.items[0].directory.name
        beeldPath = element.Beelden.assets_path
        kleurID =element.KleurID
        beeldID = element.BeeldID
        index =`${productID}_${beeldID}_${kleurID}`

        gekozen_kleuren.push({"KleurID": kleurID, "Index": index, 'BeeldID':beeldID, "Status":'oud'})
        gekozen_beelden.push({"file": 'oud',"index":index,"id": beeldID})

        document.getElementById('bestaande_afbeelding').innerHTML += `
            <div class="form-check ml-2 col-3">
                <input class="form-check-input" type="checkbox" value="${productID}_${beeldID}_${kleurID}" name='beelden_checkbox' onclick='controle_afbeelding_checkbox(this)' checked>
                <label class="form-check-label" for="beeld_op_modal${kleurID}">
                    ${element.Kleuren.items[0].Omschrijving}
                </label>
                <img src='//api.data-web.be/files/f5gh8JhjAXBd/Beelden/${beeldURL}' width=40px>
            </div>`   
    });
}

//ONCHANGE FUNCTIE 
var onnodige_bestanden=[]
function controle_afbeelding_checkbox(element){
    index = element.value
    let ids = index.split('_')

    productID = ids[0]
    beeldID=Number(ids[1])
    kleurID= Number(ids[2])

    if(element.checked ==true){
        gekozen_kleuren.push({"KleurID": kleurID, "Index": `${productID}_${beeldID}_${kleurID}`, 'BeeldID':beeldID, "Status":'oud'})
        gekozen_beelden.push({"file": 'oud',"index":`${productID}_${beeldID}_${kleurID}`,"id": beeldID})

        onnodige_bestanden = onnodige_bestanden.filter(function(element) {
            return element.beeldID !== beeldID;
        })

        element.setAttribute('checked','checked')

    }else if(element.checked ==false){
        gekozen_kleuren =  gekozen_kleuren.filter(function(element) {
            return element.Index !== index;
        });

        gekozen_beelden =  gekozen_beelden.filter(function(element) {
            return element.index !== index;
        });

        onnodige_bestanden.push({'beeldID': beeldID})

        element.removeAttribute("checked")
    }
    kleuren_uitschakelen()
}

function bevestig_bewerken(productID){
    
    var formData = new FormData();
    var values = {
        "ProductNaam": document.getElementById('naam').value,
        "product_oms": document.getElementById('omschrijving').value,
        "Prijs" : document.getElementById('prijs').value,
        "Product_typ" : document.getElementById('categorie').value
    };
    formData.set("values", JSON.stringify(values));         
    formData.set("filter", JSON.stringify(["ProductID", "=", productID]));
    
    new AJAX_CREATE_UPDATE('update','Producten','PUT',formData).run(function(done){
        console.log("update done:");
        maak_de_relaties_leeg(productID,'ProductSize')
        maak_de_relaties_leeg(productID,'productKleuren')

    },function(fail){
        console.log(fail)
    })

}

function maak_de_relaties_leeg(productID,entity){
    var filter= `["ProductID", "=","${productID}"]`

    new AJAX_DELETE(entity,filter).run(function(done){
        update_bijbehorende_tabellen(entity,productID)
        console.log('delete done')
    },function(fail){
        console.log(fail)
    })
}

/////////////////////////////////////////////////////// VERWIJDEREN ////////////////////////////////////////////////

function toon_verwijder_modal(id){
    gekozen_item = haal_het_gekozen_item_op(id);
    document.getElementById('verwijderen_container').innerHTML =`Weenst u het <strong> ${gekozen_item.ProductNaam}</strong> te verwijderen?`
    document.getElementById("verwijder_product").setAttribute("onclick",`bevestig_verwijderen('${id}')`);    
}

function bevestig_verwijderen(id){
    entity='Producten'
    filter=["ProductID","=",`${id}`]

    new AJAX_DELETE(entity,filter).run(done=>
        initialiseren()    
    ,fail=>console.log(fail)) 
}


///////////////////////////////////////////////// SUBCATEGORIE TABELLEN MODAL //////////////////////////////////////////////

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

    } 
    else if(tabel_naam == 'maat')
    {
        modal_titel = `Nieuwe maat`
        modal_content =`
        <input type="text" class="form-control" id="nieuwe_maatnaam" aria-describedby="nieuwe_maatnaam" placeholder="Schrijf een nieuwe maatnaam">
        <small class="form-text text-muted">Definieer uw maat met een letter</small>`
        onclick_parameter = 'maat'

    } 
    else if(tabel_naam=='kleur')
    {
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
    document.getElementById('bevestig_post_database').setAttribute('onclick',`update_subtabel_wijzigingen("${onclick_parameter}","${productID}")`)
}


function update_subtabel_wijzigingen(tabel_naam,geopened_productID){

    var entity=''
    var actie = 'create'
    var values={};
    var method='POST'
    var formData = new FormData();

    if(tabel_naam=='categorie'){

        entity = "product_typ"

        values = {
              "product_type_naam": document.getElementById('nieuwe_categorienaam').value,
              "Omschrijving": document.getElementById('nieuwe_slide_text').value,
              "voorbeeldafbeelding" : document.getElementById('categorie_beeldURL_hidden').value,
              "slideshowimage" : document.getElementById('categorie_slide_beeldURL_hidden').value
          };
        formData.set("values", JSON.stringify(values));         
        formData.set("voorbeeldafbeelding", document.getElementById('categorie_beeldURL').files[0]);
        formData.set("slideshowimage", document.getElementById('categorie_slide_beeldURL').files[0]);
   
    } else if(tabel_naam=='maat'){
        entity = "size"

        values = {
            "size_oms": document.getElementById('nieuwe_maatnaam').value.toUpperCase()
        }
        formData.set("values", JSON.stringify(values)); 

    }else if(tabel_naam=='kleur'){
        entity = "Kleuren"

        values = {
            "Omschrijving": document.getElementById('nieuwe_kleurnaam').value
        }
        formData.set("values", JSON.stringify(values));         
    }
    
    new AJAX_CREATE_UPDATE(actie,entity,method,formData)
    .run(function(response){

        toon_subtabelwijzigingen(response,tabel_naam,geopened_productID)
        
    },function(fail){
        console.log('create fail')
        console.log(fail)
    }) 

    sluit_sub_tabel_bewerken_modal_af()
}

function toon_subtabelwijzigingen(response,tabel_naam,geopened_productID){

    if (geopened_productID==''){
        gekozen_item= undefined
    }else{
        gekozen_item= haal_het_gekozen_item_op(geopened_productID);
    }

    if(tabel_naam=='categorie'){
        new_cat_id = response.data.item_id
        categorieen_array.push( {
          "productTypeID": new_cat_id,
          "product_type_naam": document.getElementById('nieuwe_categorienaam').value,
          "Omschrijving": document.getElementById('nieuwe_slide_text').value,
          "voorbeeldafbeelding" : document.getElementById('categorie_beeldURL_hidden').value,
          "slideshowimage" : document.getElementById('categorie_slide_beeldURL_hidden').value
      })
        toon_categorieen_opties(gekozen_item)
    } else if(tabel_naam =='maat'){
        
        new_maat_id = response.data.item_id
        nieuwe_maatnaam = document.getElementById('nieuwe_maatnaam').value.toUpperCase()

        maten_array.push({
            'size_id': new_maat_id,
            'size_oms':nieuwe_maatnaam})

        toon_bestaande_maat_opties(gekozen_item) 
    } else if(tabel_naam=='kleur'){
        new_kleur_id =response.data.item_id
        kleuren_array.push({
            "KleurID": new_kleur_id,
            "Omschrijving": document.getElementById('nieuwe_kleurnaam').value
        })

        toon_bestaande_kleuren()
        
        extra_beeld_teller;
        if(extra_beeld_teller>0){
            kleur_opties_om_te_kiezen(extra_beeld_teller,new_kleur_id)
        }
    }
}



function sluit_sub_tabel_bewerken_modal_af(){
    document.getElementById('productModal').style.zIndex = '1060'
}



/////////////////////////////////////////////////////// EXTRAS ////////////////////////////////////////////////
function navigatie(gekozen_page){
    paginanummer = gekozen_page
    initialiseren()
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
    for (let paginanummer = 0; paginanummer < pagina_instellingen.page_count; paginanummer++) {
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
    if(gekozen_page==pagina_instellingen.page_count){
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

var ascending_order = true
var last_element;

function sorteer(kolomnaam,element){

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
        order_richting= 'ASC'
    }else{
        sign = `
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>`
        order_richting = 'DESC'
    }

    element.firstElementChild.innerHTML = sign

    kolomnaam_om_te_sorteren = kolomnaam
    
    last_element=element
    
    initialiseren()
}


function filter_waarde(gezochte_box){
    zoekwaarde = document.getElementById(gezochte_box+'_filter').value;

    if(gezochte_box == 'Prijs'){
        gezochte_waarde= [[gezochte_box, ">", zoekwaarde]]
    }else{
        gezochte_waarde= [["CONCAT(ProductNaam, ' ', product_oms, ' ', ProductID, ' ', Prijs)", "LIKE", "%"+zoekwaarde+"%"]]
    } 
    paginanummer = 1
    initialiseren()
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


