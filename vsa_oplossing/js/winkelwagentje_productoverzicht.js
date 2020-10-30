var producten = [
    {
        naam: "The Bastard Small",
        prijs: 269,
        promo: 219,
        beeld: "https://image.coolblue.be/max/500x500/products/1367641"
    },
    {
        naam: "Barbecook Loewy 40",
        prijs: 79.99,
        promo: null,
        beeld: "https://image.coolblue.be/max/500x500/products/1374308"
    },
    {
        naam: "RedFire vuurschaal BBGrill Orion Classic Rust",
        prijs: 999,
        promo: 500,
        beeld: "https://static.dreamland.be/wcsstore/ColruytB2CCAS/JPG/JPG/646x1000/std.lang.all/01/10/asset-1660110.jpg"
    },
    {
        naam: "Outsunny Houtskoolgrill BBQ",
        prijs: 146.99,
        promo: null,
        beeld: "https://l-westfalia-eu.secure.footprint.net/medien/scaled_pix/1200/1200/000/000/000/000/066/923/72.jpg"
    },
    {
        naam: "Boretti Barbecue Barilo",
        prijs: 347.35,
        promo: null,
        beeld: "https://img.artencraft.be/i/3189128.jpg"
    }, 
    {
        naam: "Weber Master Touch GBS C-5750 Grijs",
        prijs: 279,
        promo: null,
        beeld: "https://image.coolblue.be/max/2048x1536/products/1408500"
    }
];

function start() {
    toonProductenOverzicht(); 
    toonProductenWinkelwagentje();
}

function toonProductenOverzicht() {
    var output = "";
    for (teller = 0; teller < producten.length; teller++) {
        var product = producten[teller];
        output += '<div class="kolom">' +
                        '<img src="' + product.beeld + '" />' +
                        '<div>' +
                        '  <label id="naam_' + teller + '">' + product.naam + '</label>';

        if (product.promo !== null) {
            output +=   '  <div class="bedrag" id="prijs_' + teller + '"><del>€ ' + product.prijs + '</del><br /><span class="promo">€ ' + product.promo + '</span></div>';
        }
        else {
            output +=   '  <div class="bedrag" id="prijs_' + teller + '">€ ' + product.prijs + '</div>';
        }

        output +=       '  <div class="actie">' +
                        '    <button onclick="plusMin(\'plus\', ' + teller + ');"><i class="fas fa-plus"></i></button>' +
                        '    <button onclick="plusMin(\'min\', ' + teller + ');"><i class="fas fa-minus"></i></button>' +
                        '  </div>' +
                        '</div>' +
                    '</div>';
    }

    document.getElementById("producten_overzicht").innerHTML = output;
}


function toonProductenWinkelwagentje() {
    var output = "";
    for (teller = 0; teller < producten.length; teller++) {
        var product = producten[teller];

        if (product.promo !== null) {
            prijs = product.promo;
        }
        else {
            prijs = product.prijs;
        }

        output += '<div class="row bold">' +
                        '<label id="naam_' + teller + '">' + product.naam + '</label>' +
                        '<div class="bedrag" id="prijs_' + teller + '">€ ' + prijs + '</div>' +
                        '<div><input type="number" id="aantal_' + teller + '" value="0" /></div>' +
                        '<div class="actie">' +
                        '<button onclick="plusMin(\'plus\', ' + teller + ');"><i class="fas fa-plus"></i></button>' +
                        '<button onclick="plusMin(\'min\', ' + teller + ');"><i class="fas fa-minus"></i></button>' +
                        '</div>' +
                    '</div>';
    }

    document.getElementById("producten_winkelwagentje").innerHTML = output;
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
    for (teller = 0; teller < producten.length; teller++) {
        var product = producten[teller];
        if (product.promo !== null) {
            var prijs = product.promo;
        }
        else {
            var prijs = product.prijs;
        }
        aantal = Number(document.getElementById("aantal_" + teller).value);
        totaal_excl_btw_excl_transport = totaal_excl_btw_excl_transport + (aantal * prijs);
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