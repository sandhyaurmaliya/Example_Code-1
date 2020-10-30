var naam = ["Product 1", "Product 2", "Product 3"];
var prijs = [10.12, 12.10, 20];


function toonProductenWinkelwagentje() {
    var producten = "";
    for (teller = 0; teller < naam.length; teller++) {
        producten += '<div class="row bold">' +
                        '<label id="naam_' + teller + '">' + naam[teller] + '</label>' +
                        '<div class="bedrag" id="prijs_' + teller + '">' + prijs[teller] + '</div>' +
                        '<div><input type="number" id="aantal_' + teller + '" value="0" /></div>' +
                        '<div class="actie">' +
                        '<button onclick="plusMin(\'plus\', ' + teller + ');"><i class="fas fa-plus"></i></button>' +
                        '<button onclick="plusMin(\'min\', ' + teller + ');"><i class="fas fa-minus"></i></button>' +
                        '</div>' +
                    '</div>';
    }

    document.getElementById("producten").innerHTML = producten;
}
function plusMin(actie, id) {

    var aantal = Number(document.getElementById("aantal_" + id).value);    
    if (actie == "plus") {       
        aantal++;
    }
    else {
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
                transport = 0;
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
    /* bereken het totaal excl. BTW en excl. transportkost */
    var totaal_excl_btw_excl_transport = 0;
    for (teller = 0; teller < naam.length; teller++) {
        aantal = Number(document.getElementById("aantal_" + teller).value);
        totaal_excl_btw_excl_transport = totaal_excl_btw_excl_transport + (aantal * prijs[teller]);
    }

    /* bereken de transportkost */
    var transportkost = berekenTransportKost(land, totaal_excl_btw);
    
    /* bereken het totaal excl. BTW en incl. transportkost */
    totaal_excl_btw = totaal_excl_btw_excl_transport + transportkost;

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