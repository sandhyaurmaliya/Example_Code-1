var getal_1;
var getal_2;

function bereken() {
    getal_1 = parseFloat(document.getElementById("getal_1").value);
    getal_2 = parseFloat(document.getElementById("getal_2").value);

    if (getal_1 > 0 && getal_2 > 0) {
        var optelling = getal_1 + getal_2;
        document.getElementById("optelling").innerHTML = optelling;        

        var aftrekking = getal_1 - getal_2;
        document.getElementById("aftrekking").innerHTML = aftrekking;        

        var vermenigvuldiging = getal_1 * getal_2;
        document.getElementById("vermenigvuldiging").innerHTML = vermenigvuldiging;        

        var deling = getal_1 / getal_2;
        document.getElementById("deling").innerHTML = deling;        
    }
    else {
        alert("getal 1 en getal 2 moeten groten zijn dan 0");
    }
}
 
function vergelijken() {
    var vergelijking_omschrijving = 
        ["getal 1 kleiner dan getal 2", 
        "getal 1 groter dan  getal 2",
        "getal 1 kleiner of gelijk aan getal 2", 
        "getal 1 groter of gelijk aan getal 2",
        "getal 1 groter dan 10 EN kleiner dan 20",
        "getal 1 kleiner dan 10 EN groter dan 5",
        "getal 1 kleiner dan 10 EN getal 2 groter dan 5",
        "getal 1 kleiner dan 10 OF getal 2 groter dan 5"];

    var vergelijkingen = "";
    vergelijkingen += vergelijking_omschrijving[0] + ": ";
    if (getal_1 < getal_2) { vergelijkingen += "JA<br>"; } else { vergelijkingen += "NEEN<br>"; }
    vergelijkingen += vergelijking_omschrijving[1] + ": ";
    if (getal_1 > getal_2) { vergelijkingen += "JA<br>"; } else { vergelijkingen += "NEEN<br>"; }
    vergelijkingen += vergelijking_omschrijving[2] + ": ";
    if (getal_1 <= getal_2) { vergelijkingen += "JA<br>"; } else { vergelijkingen += ": NEEN<br>"; }
    vergelijkingen += vergelijking_omschrijving[3] + ": ";
    if (getal_1 >= getal_2) { vergelijkingen += "JA<br>"; } else { vergelijkingen += ": NEEN<br>"; }
    vergelijkingen += vergelijking_omschrijving[4] + ": ";
    if (getal_1 > 10 && getal_1 < 20 ) { vergelijkingen += "JA<br>"; } else { vergelijkingen += ": NEEN<br>"; }
    vergelijkingen += vergelijking_omschrijving[5] + ": ";
    if (getal_1 < 10 && getal_1 > 5) { vergelijkingen += "JA<br>"; } else { vergelijkingen += ": NEEN<br>"; }
    vergelijkingen += vergelijking_omschrijving[6] + ": ";
    if (getal_1 < 10 && getal_2 > 5) { vergelijkingen += "JA<br>"; } else { vergelijkingen += ": NEEN<br>"; }
    vergelijkingen += vergelijking_omschrijving[7] + ": ";
    if (getal_1 < 10 || getal_2 > 5) { vergelijkingen += "JA<br>"; } else { vergelijkingen += ": NEEN<br>"; }

    document.getElementById("vergelijkingen").innerHTML = vergelijkingen;
}

function opnieuw() {
    document.getElementById("optelling").innerHTML = "...";
    document.getElementById("aftrekking").innerHTML = "...";
    document.getElementById("vermenigvuldiging").innerHTML = "...";
    document.getElementById("deling").innerHTML = "...";
    document.getElementById("vergelijkingen").innerHTML = "...";

    document.getElementById("getal_1").value = "";
    document.getElementById("getal_2").value = "";
}