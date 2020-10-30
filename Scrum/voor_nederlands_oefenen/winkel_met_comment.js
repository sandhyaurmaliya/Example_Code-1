// op de specific-product.html en ook t-shirt-winkle.html pagina hebben we dynamische knoppen gegenereerd op basis van reacties van ajax-verzoek. 
//al deze knoppen hebben een onclick ===product_toevoegen()=== functie met unieke parameters

function product_toevoegen(product_naam, product_id, prijs, beeld){
 // wanneer een gebruiker het product met deze knoppen wil toevoegen, krijgen we de parameterwaarden om ze toe te voegen op ons winkelwagantje
    
    winkelwagantje_producten = winkelwagengegevens_ophalen();      
    //maar voordat we dat doen, moeten we weten of de winkelwagen al vol of leeg is. winkelwagengegevens_ophalen() 
    //functie stuurt een lege of volledige array die we aan een variabele kunnen toewijzen terug.

    var aantal = 1; //aangezien, één klik 'één stuk product' betekent, zeggen we dat het aantal gelijk is aan 1
    var uniek = true; //en we gaan ervan uit dat het product eerst uniek is
     
    // aangezien we geen "gekozen waarden" met parameters kunnen verzenden, moeten we ze binnen de functie krijgen                          
    //Gekozen maat
    var e = document.getElementById(`maat${product_id}`);
    var gekozenmaatID = e.options[e.selectedIndex].value; //we zoeken het geselecteerde maat met 'selectedIndex' en slaan het op
    var gekozenmaatnaam = e.options[e.selectedIndex].text;
               
    //geopened_product_kleur
    kleuropties = document.getElementsByName(`kleur${product_id}`);

    kleuropties.forEach(element => {  
        if (element.checked== true){ //we zoeken het aangevinkte element met 'checked' en slaan het op
            gekozenkleurID = element.value;
            gekozenkleurnaam= element.id;
        }
    });

    
    if( gekozenmaatID!=='0'){ 
        //aangezien we niet willen dat de gebruiker een product toevoegt zonder een keuze, plaatsen we deze voorwaarde en voegen we alleen
        // producten toe aan onze winkelwagen wanneer aan deze voorwaarde is voldaan

        winkelwagantje_producten.forEach(element => { //voordat we een product toevoegen, zoeken we of het product al bestaat
            if(element!==null && element.id == product_id && element.kleurid == gekozenkleurID && element.maatid == gekozenmaatID){ //we doen dat door te controleren of alle belangrijke waarden exact met elkaar overeenkomen in een forEach-lus
                bedrag_wijzigen('+',element.id, element.kleurid,element.maatid ) //als ze allemaal overeenkomen, weten we dat het product niet uniek is en hoeven we alleen het aantal te wijzigen
                uniek = false
            }
        });
        
        if (uniek == true){ // en als het niet overeenkomt, betekent ons product dat het uniek is. dus we pushen alle productdetailwaarden die we hebben uit parameters en geselecteerde elementen als een object in winkelwagantje array
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
            voeg_productgegevens_toe_aan_winkelwagen(winkelwagantje_producten) //nadat we ze hebben gepusht, updaten we ons winkelwagantje op de sessionStorage
            toon_winkelwagantje() //daarna tonen we ze
        };
    }
}

function bedrag_wijzigen(voorwaarde,productID, kleur, maat){ 
    //deze functie gebruikt een extra parameter genaamd "voorwaarde" om te bepalen of het aantal van een product met overeenkomende 
    //id en gekozen kleur en maat kleiner of groter moet worden

    winkelwagantje_producten.forEach(element => {
        
        if(element!==null && element.id==productID && element.kleurid == kleur && element.maatid == maat ){

            if(voorwaarde=='+'){ //als voorwaarde plus is, voegt het er nog een toe
                element.aantal++
            }
            if(voorwaarde=='-'){//als het min is, trekt het er één af.
                element.aantal--
            }
        }
    });  

    for (let index = 0; index < winkelwagantje_producten.length; index++) { 
        //als het min is en het productbedrag wordt 0, dan wordt het product uit de array verwijderd.
        
        if(voorwaarde=='-' && winkelwagantje_producten[index]!==null && winkelwagantje_producten[index].aantal==0){
            
            delete winkelwagantje_producten[index]

        }
    
    }
    //en aangezien we een wijziging in de array hebben aangebracht, werken we deze bij in sessionStorage en geven we de bijgewerkte versie weer
    voeg_productgegevens_toe_aan_winkelwagen(winkelwagantje_producten) 
    toon_winkelwagantje()
}

function voeg_productgegevens_toe_aan_winkelwagen(x){
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
    winkelwagantje_producten = winkelwagengegevens_ophalen() //aangezien we dit als onload draaien, zorgen we ervoor dat we elke keer dat we deze functie uitvoeren het bijgewerkte winkelwagantje krijgen en ons winkelwagantje tonen op basis van waarden in de winkelwagantje array

    document.getElementById('productInfo').innerHTML =''

    winkelwagantje_producten.forEach(element => {
        if(element!==null){
            document.getElementById('productInfo').innerHTML +=
            ` <div class="dropdown-item d-flex px-0">
            <div class="col-3 product_winkel_image" >
            <img height="80px" src="${element.beeld}" alt="">
            </div>
            <div class="col-5">
                <div>
                    <strong>${element.naam}</strong>
                    <br>${element.kleurnaam}
                    <br>${element.maatnaam} 
                    <br>€${element.prijs} 
                </div>
            </div>
            <div class="col-4 antaal">
            <div class="row">
                <p class="product_antaal_knop"  onclick="bedrag_wijzigen('-','${element.id}','${element.kleurid}','${element.maatid}')">-</p>
                <p class='product_antaal' type="text" id="product_id_1" >${element.aantal}</p>
                <p class="product_antaal_knop"  onclick="bedrag_wijzigen('+','${element.id}','${element.kleurid}','${element.maatid}')">+</p>
            </div>
            </div>
        </div> 
        <div class="dropdown-divider"></div>
        `
        }
    });
    //aangezien we de totale prijs en het bedrag wilden laten zien, voeren we daar extra functies voor uit.
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
    document.getElementById('hoeveelProducten').innerHTML = totaalAntaal;
}  


function berekenTotal_prijs(){
    var totaal=0;
    document.getElementById('total_prijs_winkelwag').innerHTML = 0;
    winkelwagantje_producten = winkelwagengegevens_ophalen();

    winkelwagantje_producten.forEach(element => {
        if(element!== null){
            totaal = Number(document.getElementById('total_prijs_winkelwag').innerHTML);
            totaal = (element.aantal * element.prijs) + totaal; 
            document.getElementById('total_prijs_winkelwag').innerHTML =totaal ;  
        }         
    });
}
