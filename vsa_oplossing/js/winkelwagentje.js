var naam = ["Product 1 naam", "Product 2 naam"];
var prijs = [10.12, 12.10];


function start() {
    document.getElementById("naam_1").innerHTML = naam[0];
    document.getElementById("prijs_1").innerHTML = "&euro; " + prijs[0].toFixed(2);
    document.getElementById("naam_2").innerHTML = naam[1];
    document.getElementById("prijs_2").innerHTML = "&euro; " + prijs[1].toFixed(2);
}
function plus(id) {
    var aantal = Number(document.getElementById("aantal_" + id).value);
    aantal = aantal + 1;
    document.getElementById("aantal_" + id).value = aantal;

    verwerkTotalen();
}

function min(id) {
    var aantal = Number(document.getElementById("aantal_" + id).value);
    aantal = aantal - 1;
    document.getElementById("aantal_" + id).value = aantal;

    verwerkTotalen();
}

function verwerkTotalen() {   
    /* haal aantallen op uit de html */ 
    var aantal_1 = Number(document.getElementById("aantal_1").value);
    var aantal_2 = Number(document.getElementById("aantal_2").value);
  
    /* bereken het totaal excl. BTW en excl. transportkost */
    var totaal_excl_btw = (aantal_1 * prijs[0]) + (aantal_2 * prijs[1]);
    
    /* bereken het totaal incl. BTW en de btw */
    var totaal_incl_btw = totaal_excl_btw * 1.21;
    var btw = totaal_incl_btw - totaal_excl_btw;

    /* plaats de bedragen terug in de html */
    document.getElementById("totaal_excl_btw").innerHTML = "&euro; " + totaal_excl_btw.toFixed(2);
    document.getElementById("btw").innerHTML = "&euro; " + btw.toFixed(2);
    document.getElementById("totaal_incl_btw").innerHTML = "&euro; " + totaal_incl_btw.toFixed(2);
}