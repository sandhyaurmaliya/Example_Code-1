function bereken() {
    var getal_1 = parseFloat(document.getElementById("getal_1").value);
    var getal_2 = parseFloat(document.getElementById("getal_2").value);

    var optelling = getal_1 + getal_2;
    document.getElementById("optelling").innerHTML = optelling;        

    var aftrekking = getal_1 - getal_2;
    document.getElementById("aftrekking").innerHTML = aftrekking;        

    var vermenigvuldiging = getal_1 * getal_2;
    document.getElementById("vermenigvuldiging").innerHTML = vermenigvuldiging;        

    var deling = getal_1 / getal_2;
    document.getElementById("deling").innerHTML = deling;        
}

function opnieuw() {
    document.getElementById("optelling").innerHTML = "...";
    document.getElementById("aftrekking").innerHTML = "...";
    document.getElementById("vermenigvuldiging").innerHTML = "...";
    document.getElementById("deling").innerHTML = "...";
}