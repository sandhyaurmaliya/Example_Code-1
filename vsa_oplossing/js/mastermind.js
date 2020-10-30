var opdracht = [];
var aantal_groene_bolletjes;
var pogingen;

function start() {
    aantal_groene_bolletjes = 0;
    pogingen = 1;

    document.getElementById("vorige_pogingen").innerHTML = "";
    document.getElementById("boodschap").innerHTML = "";
    document.getElementById("controlleer").disabled = false;
    document.getElementById("score").innerHTML = '<div id="score_1"></div>';
    for (getal_counter = 1; getal_counter <= 4; getal_counter++) {        
        document.getElementById("getal_" + getal_counter).value = "";
        document.getElementById("getal_" + getal_counter).disabled = false;
    }
    
    // bedenk opdracht
    bepaalOpdracht();
}

function bepaalOpdracht() {
    for (counter = 1; counter <= 4; counter++) {
        opdracht.push(Math.floor(Math.random() * 10));
    }
    console.log(opdracht);
}

function ingevoerdeGetallen() {
    var ingevoerde_getallen = [];
    for (getal_counter = 1; getal_counter <= 4; getal_counter++) {
        ingevoerde_getallen.push(parseInt(document.getElementById("getal_" + getal_counter).value));
    }
    return ingevoerde_getallen;
}

function controleerIngevoerdeGetallen() {
    var ingevoerde_getallen = ingevoerdeGetallen();
    //ingevoerde_getallen.forEach(function(ingevoerd_getal, getal_counter) {
     for(getal_counter=0;getal_counter < ingevoerde_getallen.length; getal_counter++) {
        ingevoerd_getal = ingevoerde_getallen[getal_counter];
        var gevonden = opdracht.includes(ingevoerd_getal);
        if (gevonden == true) {
            if (ingevoerd_getal == opdracht[getal_counter]) {
                toonBolletje("groen");              
            }
            else                {                
                toonBolletje("rood");  
            }
        }
        else {              
            toonBolletje("grijs");  
        }
    }
    //});

    if (!gewonnen() && !verloren()) {
        nieuwePoging();
    }
}

function nieuwePoging() {
    aantal_groene_bolletjes = 0;
    pogingen++;

    // na elke poging de ingevoerde_getallen bij #vorige_pogingen toevoegen
    vorige_pogingen_html = document.getElementById("vorige_pogingen").innerHTML;
    vorige_pogingen_html += '<div class="vorige_poging">';
    
    var ingevoerde_getallen = ingevoerdeGetallen();
    ingevoerde_getallen.forEach(function(ingevoerd_getal, getal_counter) {
        vorige_pogingen_html += "<span>" + ingevoerd_getal + "</span>";
        document.getElementById("getal_" + (getal_counter + 1)).value = "";
    })
    
    vorige_pogingen_html += '</div>';
    document.getElementById("vorige_pogingen").innerHTML = vorige_pogingen_html;


    //lege nieuwe score lijn toevoegen
    score_html = document.getElementById("score").innerHTML;
    score_html += '<div id="score_' + pogingen + '"></div>';
    document.getElementById("score").innerHTML = score_html;
}

function toonBolletje(kleur) {
    score_html = document.getElementById("score_" + pogingen).innerHTML;
    score_html += '<span class="' + kleur + '_bolletje">&#8226;</span>';
    document.getElementById("score_" + pogingen).innerHTML = score_html;

    if (kleur == "groen") {
        aantal_groene_bolletjes++;
    }
    return true;
}

function verloren() {
    if (pogingen == 10) {
        document.getElementById("boodschap").innerHTML = 'U bent verloren.';
        blokkeerInvoer();
        return true;
    }
    return false;
}

function gewonnen() {
    if (aantal_groene_bolletjes == 4) {
        document.getElementById("boodschap").innerHTML = 'Proficiat.';
        blokkeerInvoer();
        return true;
    }
    return false;
}

function blokkeerInvoer() {
    for (getal_counter = 1; getal_counter <= 4; getal_counter++) {        
        document.getElementById("getal_" + getal_counter).disabled = true;
    }
    document.getElementById("controlleer").disabled = true;
}