var vandaag = new Date();
vandaag.setHours(0,0,0,0);

var maand = vandaag.getMonth(); // 0 = januari, 1 = februari, ... 
var jaar = vandaag.getFullYear();

var maand_voluit = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];

function start() {
    toonMaand();
}

function toonMaand() {
    var label = maand_voluit[maand] + " " + jaar;
   
    var dagen_html = toonLegeDagenVoorEersteDag();
    dagen_html += toonDagenVanDeMaand();

    document.getElementById("label").innerHTML = label;
    document.getElementById("dagen").innerHTML = dagen_html;
} 

function toonLegeDagenVoorEersteDag() {
    var dagen_html = "";
    var week_dag_1 = new Date(jaar, maand, 1).getDay(); // 0 = zondag, 1 = maandag, 2 = dinsdag, ...
    if (week_dag_1 == 0) { week_dag_1 = 7 } // zondag
       
    for(i=1;i<week_dag_1;i++) {
        dagen_html += "<span></span>";
    }

    return dagen_html;
}

function toonDagenVanDeMaand() {
    var aantal_dagen_in_maand = new Date(jaar, maand + 1, 0).getDate();

    var dagen_html = "";
    for (dag=1; dag<=aantal_dagen_in_maand;dag++) {        
        var getoonde_dag = new Date(jaar, maand, dag, 0,0,0,0);
        if (isVandaag(getoonde_dag)) {
            dagen_html += "<span class='vandaag'>" + dag + "</span>";
        }
        else {
            dagen_html += "<span>" + dag + "</span>";
        }
    }

    return dagen_html;
}

function isVandaag(getoonde_dag) {
    // getTime geeft een getal van combinatie dag/maand/jaar met uur/minuut/second
    if (getoonde_dag.getTime() == vandaag.getTime()) {
        return true;
    }
}

function naarVolgendeMaand() {
    if (maand == 11) {
        maand = 0;
        jaar++;
    }
    else {
        maand++;
    }
    toonMaand();
}

function naarVorigeMaand() {
    if (maand == 0) {
        maand = 11;
        jaar--;
    }
    else {
        maand--;
    }
    toonMaand();
}