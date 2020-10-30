var vandaag = new Date(); //combinatie van dag/maand/jaar en uren/minuten/seconden/miliseconden
vandaag.setHours(0,0,0,0); //reset uren/minuten/seconden/miliseconden

var maand = vandaag.getMonth();
//var maand_met_0;
var jaar = vandaag.getFullYear();

var maand_voluit = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];

var activiteiten = [{"datum": "2020-07-11", "datumTot": null, "omschrijving": "Vlaamse feestdag"},
                    {"datum": "2020-07-21", "datumTot": null, "omschrijving": "Nationale feestdag"},
                    {"datum": "2020-07-20", "datumTot": "2020-08-07", "omschrijving": "Nationale feestdag"}];

function start() {
    toonMaand();
    toonActiviteiten();
}

function toonMaand() {
    var label = maand_voluit[maand] + " " + jaar;
    //maand_met_0 = ("0" + maand).slice(-2);

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
    var aantal_dagen_in_maand = new Date(jaar, maand + 1, 0).getDate();

    var dagen_html = "";
    for (dag=1; dag<=aantal_dagen_in_maand;dag++) {
        var getoonde_dag = new Date(jaar, maand, dag, 0, 0, 0, 0);
        
        if (isVandaag(getoonde_dag)) {
            dagen_html += "<span class='vandaag'>" + dag + "</span>";
        }
        else {
            if (heeftActiviteit(getoonde_dag)) {
                dagen_html += "<span class='activiteit'>" + dag + "</span>";
            }
            else {
                if (inPeriode(getoonde_dag)) {
                    dagen_html += "<span class='periode'>" + dag + "</span>";
                }       
                else {
                    dagen_html += "<span>" + dag + "</span>";
                }
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
        // bekijk enkel de activiteiten die maar 1 dag duren
        if (activiteit.datumTot == null) {
            var activiteit_datum = new Date(activiteit.datum);
            activiteit_datum.setHours(0,0,0,0);
        
            if (getoonde_dag.getTime() == activiteit_datum.getTime()) {
                return true;
            }
        }
    }
    return false;
}

function inPeriode(getoonde_dag) {
    for(activiteit_counter = 0; activiteit_counter < activiteiten.length; activiteit_counter++) {        
        var activiteit = activiteiten[activiteit_counter];
        // bekijk enkel de activiteiten die meerdere dagen duren
        if (activiteit.datumTot != null) {
            var activiteit_datum = new Date(activiteit.datum);
            activiteit_datum.setHours(0,0,0,0);
            var activiteit_datum_tot = new Date(activiteit.datumTot);
            activiteit_datum_tot.setHours(0,0,0,0);

            if (getoonde_dag.getTime() >= activiteit_datum.getTime() && getoonde_dag.getTime() <= activiteit_datum_tot.getTime()) {
                return true;
            }
        }
    }
    return false;
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
    toonActiviteiten();
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
    toonActiviteiten();
}

function toonActiviteiten() {
    var activteiten_html = "";
    for(activiteit_counter = 0; activiteit_counter < activiteiten.length; activiteit_counter++) {        
        var activiteit = activiteiten[activiteit_counter];
        var activiteit_datum = new Date(activiteit.datum);
        //activiteit_datum.setHours(0,0,0,0);
        var activiteit_datum_tot = new Date(activiteit.datumTot);
        //activiteit_datum_tot.setHours(0,0,0,0);

        if (activiteit_datum.getMonth() == maand &&
            activiteit_datum.getFullYear() == jaar) {
            activteiten_html += "<li>";

            //toon datum
            activteiten_html += activiteit_datum.getDate() + " " + 
                maand_voluit[activiteit_datum.getMonth()] + " " + 
                activiteit_datum.getFullYear();

            // toon tot datum indien aanwzig    
            if (activiteit.datumTot != null) {
                activteiten_html += " tot " + activiteit_datum_tot.getDate() + " " + 
                    maand_voluit[activiteit_datum_tot.getMonth()] + " " + 
                    activiteit_datum_tot.getFullYear();
            }

            // toon omschrijving
            activteiten_html += ": " + activiteit.omschrijving;

            activteiten_html += "</li>";
        }
    }
    
    document.getElementById("activiteiten").innerHTML = "<ul>" + activteiten_html + "</ul>";
}