var naam = ["Product 1 naam", "Product 2 naam"];
var prijs = [10.12, 12.10];


function toonProductInformatie() {
    document.getElementById("naam_1").innerHTML = naam[0];
    document.getElementById("prijs_1").innerHTML = "€ " + prijs[0].toFixed(2);
    document.getElementById("naam_2").innerHTML = naam[1];
    document.getElementById("prijs_2").innerHTML = "€ " + prijs[1].toFixed(2);
}

function plusMin(actie, id) {
    // actie = "plus" of "min"
    var aantal = Number(document.getElementById("aantal_" + id).value);    
    if (actie == "plus") {       
        aantal++;
    }
    else {
        //min
        if (aantal > 0) {
            aantal--;
        }
    }

    document.getElementById("aantal_" + id).value = aantal;

    verwerkTotalen();
}

function berekenTransportKost(land, totaal_excl_btw) {
    var transportkost = 0;
    if (totaal_excl_btw > 0) {
        if (land == "België") {
            transportkost = 10;
            if (totaal_excl_btw > 30) {
                transportkost = 0;
            }
        }
        if (land == "Nederland" || land == "Luxemburg") {
            transportkost = 13;
            if (totaal_excl_btw > 50) {
                transportkost = 0;
            }
        }
        if (land == "Duitsland" || land == "Frankrijk") {
            transportkost = 15;
            if (totaal_excl_btw > 70) {
                transportkost = 0;
            }
        }
    }
    return transportkost;
}

function verwerkTotalen() {  
    /* haal aantallen en land op uit de html */ 
    var aantal_1 = Number(document.getElementById("aantal_1").value);
    var aantal_2 = Number(document.getElementById("aantal_2").value);
    var land = document.getElementById("land").value;

    /* bereken het totaal excl. BTW en excl. transportkost */
    var totaal_excl_btw_excl_transport = (aantal_1 * prijs[0]) + (aantal_2 * prijs[1]);

    /* bereken de transportkost */
    var transportkost = berekenTransportKost(land, totaal_excl_btw_excl_transport);
    
    /* bereken het totaal excl. BTW en incl. transportkost */
    var totaal_excl_btw = totaal_excl_btw_excl_transport + transportkost;

    /* bereken het totaal incl. BTW en de btw */
    var totaal_incl_btw = totaal_excl_btw * 1.21;
    var btw = totaal_incl_btw - totaal_excl_btw;

    /* plaats de bedragen terug in de html */
    if (transportkost > 0) {
        document.getElementById("transportkost").innerHTML = "&euro; " + transportkost;
    }
    else {
        document.getElementById("transportkost").innerHTML = "gratis";
    }
    document.getElementById("totaal_excl_transport").innerHTML = "&euro; " + totaal_excl_btw_excl_transport.toFixed(2);
    document.getElementById("totaal_excl_btw").innerHTML = "&euro; " + totaal_excl_btw.toFixed(2);
    document.getElementById("btw").innerHTML = "&euro; " + btw.toFixed(2);
    document.getElementById("totaal_incl_btw").innerHTML = "&euro; " + totaal_incl_btw.toFixed(2);
}