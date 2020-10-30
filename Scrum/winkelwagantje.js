function product_toevoegen(product_naam, product_id, prijs, beeld){
    winkelwagantje_producten = winkelwagengegevens_ophalen();

    var aantal = 1;
    var uniek = true;
        
    //Gekozen maat
    var e = document.getElementById(`maat${product_id}`);
    var gekozenmaatID = e.options[e.selectedIndex].value;
    var gekozenmaatnaam = e.options[e.selectedIndex].text;
               
    //geopened_product_kleur
    kleuropties = document.getElementsByName(`kleur${product_id}`);

    kleuropties.forEach(element => {  
        if (element.checked== true){
            gekozenkleurID = element.value;
            gekozenkleurnaam= element.id;
        }
    });

    if( gekozenmaatID!=='0'){
             
        winkelwagantje_producten.forEach(element => {
            if(element!==null && element.id == product_id && element.kleurid == gekozenkleurID && element.maatid == gekozenmaatID){
                bedrag_wijzigen('+',element.id, element.kleurid,element.maatid, 'winkel' )
                uniek = false
            }
        });
        

        if (uniek == true){
           winkelwagantje_producten.push({
               'id': product_id,
               'naam':product_naam,
               'prijs': prijs,
               'beeld':beeld,
               'kleurid':gekozenkleurID,
               'maatid':gekozenmaatID,
               'maatnaam':gekozenmaatnaam,
               'kleurnaam':gekozenkleurnaam,
               aantal,
            });
            voeg_productgegevens_toe_aan_winkelwagen(winkelwagantje_producten)
            toon_winkelwagantje()
        }    
        
        //Succesvol toevoegen maakt een witte signal op de winkelwagentje icoon
        document.getElementById(`wagantje_knop`).style.color = 'white'

        setTimeout(() => {
            document.getElementById("wagantje_knop").style.color= '';
        }, 200);
        
    }else{
        document.getElementById(`maat${product_id}`).style.boxShadow = '0px 0px 5px red'
        setTimeout(() => {
            document.getElementById(`maat${product_id}`).style.boxShadow = 'unset'
        }, 200);
    }      
}

function bedrag_wijzigen(voorwaarde,productID, kleur, maat, locatie_naam){

    winkelwagantje_producten.forEach(element => {
        
        if(element!==null && element.id==productID && element.kleurid == kleur && element.maatid == maat ){

            if(voorwaarde=='+'){
                element.aantal++
            }
            if(voorwaarde=='-'){
                element.aantal--
            }
        }
    });  
    for (let index = 0; index < winkelwagantje_producten.length; index++) {
        if(voorwaarde=='-' && winkelwagantje_producten[index]!==null && winkelwagantje_producten[index].aantal==0){
        delete winkelwagantje_producten[index]
        }    
    }

    voeg_productgegevens_toe_aan_winkelwagen(winkelwagantje_producten)
    if (locatie_naam == "bestelling"){
        toon_winkelwagantje()
        bestel_producten()

    }else if(locatie_naam == "winkelwagen_popup" || locatie_naam == "winkel"){
        toon_winkelwagantje()
    }
        

}


function voeg_productgegevens_toe_aan_wi8nkelwagen(x){
    sessionStorage.setItem('winkelwagantje',JSON.stringify(x))
    
}


function winkelwagengegevens_ophalen(){
    var winkelwagantje_producten = JSON.parse(sessionStorage.getItem('winkelwagantje'))
    if(winkelwagantje_producten == null){
        winkelwagantje_producten = []
    }
    return winkelwagantje_producten
}



function toon_winkelwagantje(){
    winkelwagantje_producten = winkelwagengegevens_ophalen()

    winkelwagen_is_vol = false
    winkelwagantje_producten.forEach(element => {
        if(element!== null){
            winkelwagen_is_vol = true
        }
    });

    if(winkelwagen_is_vol == true){
        
        document.getElementById('productInfo').innerHTML =''
        document.getElementById('naar_bestellen_knop').classList.remove('disabled') 
        winkelwagantje_producten.forEach(element => {
            if(element!==null){
            document.getElementById('productInfo').innerHTML +=
            ` <div class="dropdown-item d-flex px-0">
                <div class="col-3 product_winkel_image" >
                <img height="80px" src="${element.beeld}" alt="">
                </div>
                <div class="col-5">
                <div><strong>${element.aantal}-${element.naam}</strong><br> ${element.kleurnaam}<br> ${element.maatnaam} <br><small>${element.prijs} euro per stuk</small></div>
                </div>
                <div class="col-4 antaal">
                <div class="row">
                    <p class="product_antaal_knop"  onclick="bedrag_wijzigen('-','${element.id}','${element.kleurid}','${element.maatid}', 'winkelwagen_popup')">-</p>
                    <p class='product_antaal' type="text" id="product_id_1" >${element.aantal}</p>
                    <p class="product_antaal_knop"  onclick="bedrag_wijzigen('+','${element.id}','${element.kleurid}','${element.maatid}', 'winkelwagen_popup')">+</p>
                </div>
                </div>
            </div> 
            <div class="dropdown-divider"></div>
          `
            }
        });
    } else if (winkelwagen_is_vol == false){
        document.getElementById('productInfo').innerHTML =`<h4 class="text-center">Je winkelwagen is leeg </h4>`
        document.getElementById('total_prijs_winkelwag').innerHTML=''
        document.getElementById('naar_bestellen_knop').classList.add('disabled')     
    }
    berekenTotal ();
    berekenTotal_prijs();
}



function berekenTotal (){
    var totaalAntaal=0;
    winkelwagantje_producten.forEach(element => {
        
        if(element!== null){
            product_aantal = element.aantal
            totaalAntaal = product_aantal + totaalAntaal
        }
    });

    if(totaalAntaal>0){
        document.getElementById('wagantje_knop').innerHTML = `
        <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" class="bi bi-cart-check-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM4 14a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm7 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm.354-7.646a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
        </svg>
        <span id="hoeveelProducten"></span>`
    }else{
        document.getElementById('wagantje_knop').innerHTML = `
        <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" class="bi bi-cart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
        </svg>
        <span id="hoeveelProducten"></span>`
    }

    document.getElementById('hoeveelProducten').innerHTML = totaalAntaal;

} 


function berekenTotal_prijs(){
    var totaal=0;
    winkelwagantje_producten = winkelwagengegevens_ophalen();

    winkelwagantje_producten.forEach(element => {
        if(element!== null){
        totaal = (element.aantal * element.prijs) + totaal;
        totaal = Number(totaal.toFixed(2)) //verwijdert de meer dan 2 decimalen
        document.getElementById('total_prijs_winkelwag').innerHTML = `<strong>Totaal: </strong>${totaal}€`;  
        }         
    });
    return totaal
}

