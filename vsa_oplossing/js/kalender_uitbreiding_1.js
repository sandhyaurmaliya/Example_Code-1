var vandaag = new Date();
var maand = vandaag.getMonth();
var jaar = vandaag.getFullYear();

var maand_voluit = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];

var activiteiten = [{"datum": "2020-07-11", "omschrijving": "Vlaamse feestdag"},
                    {"datum": "2020-07-21", "omschrijving": "Nationale feestdag"}];

function start() {
    toonMaand();
    toonActiviteiten();
}

function toonMaand() {
    var label = maand_voluit[maand] + " " + jaar;

    var maand_html = toonLegeDagenVoorEersteDag();
    maand_html += toonDagenVanDeMaand();

    document.getElementById("label").innerHTML = label;
    document.getElementById("dagen").innerHTML = maand_html;
} 

function toonLegeDagenVoorEersteDag() {
    var dagen_html = "";
    var week_dag_1 = new Date(jaar, maand, 1).getDay(); // 0 = zondag, 1 = maandag, 2 = dinsdag, ...
    if (week_dag_1 == 0) { week_dag_1 = 7 }
       
    for(i=1;i<week_dag_1;i++) {
        dagen_html += "<span></span>";
    }

    return dagen_html;
}

function toonDagenVanDeMaand() {
    var aantal_dagen_in_maand = new Date(jaar, maand+1, 0).getDate();

    var dagen_html = "";
    for (dag=1; dag<=aantal_dagen_in_maand;dag++) {
        var getoonde_dag = new Date(jaar, maand, dag);
        if (isVandaag(getoonde_dag)) {
            dagen_html += "<span class='vandaag'>" + dag + "</span>";
        }
        else {
            if (heeftActiviteit(getoonde_dag)) {
                dagen_html += "<span class='activiteit'>" + dag + "</span>";
            }
            else {
                dagen_html += "<span>" + dag + "</span>";
            }
        }
    }

    return dagen_html;
}

function isVandaag(getoonde_dag) {
    // getTime geeft een getal van combinatie dag/maand/jaar met uur/minuut/second
    if (getoonde_dag.getTime() == vandaag.getTime()) {
        return true;
    }
    return false;
}


function heeftActiviteit(getoonde_dag) {
    for(activiteit_counter = 0; activiteit_counter < activiteiten.length; activiteit_counter++) {        
        var activiteit = activiteiten[activiteit_counter];
        
        var activiteit_datum = new Date(activiteit.datum);
        activiteit_datum.setHours(0,0,0,0);
    
        if (getoonde_dag.getTime() == activiteit_datum.getTime()) {
            return true;
        }
    }
    return false;
}


function naarVolgendeMaand() {
    if (maand == 12) {
        maand = 1;
        jaar++;
    }
    else {
        maand++;
    }
    toonMaand();
    toonActiviteiten();
}

function naarVorigeMaand() {
    if (maand == 1) {
        maand = 12;
        jaar--;
    }
    else {
        maand--;
    }

    toonMaand();
    toonActiviteiten();
}

function toonActiviteiten() {
    var activteiten_html = "";
    for(activiteit_counter = 0; activiteit_counter < activiteiten.length; activiteit_counter++) {        
        var activiteit = activiteiten[activiteit_counter];
        var activiteit_datum = new Date(activiteit.datum);
    
        if (activiteit_datum.getMonth() == maand &&
            activiteit_datum.getFullYear() == jaar) {

            activteiten_html += "<li>";

            // toon datum
            activteiten_html += activiteit_datum.getDate() + " " + 
                maand_voluit[activiteit_datum.getMonth()] + " " + 
                activiteit_datum.getFullYear();
            
            // toon omschrijving
            activteiten_html += ": " + activiteit.omschrijving;

            activteiten_html += "</li>";
        }
    }
    
    document.getElementById("activiteiten").innerHTML = "<ul>" + activteiten_html + "</ul>";
}