var alfabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
var letters_gevonden = 0;
var woorden = ["appel", "peer", "ananas", "citroen", "meloen", "sinaasappel", "kiwi", "passievrucht", "aardbei", "framboos", "braambes", "bosbes", 
            "kiwibes", "mango", "papaya", "banaan", "druif", "mandarijn", "vijg", "perzik", "nectarine", "pruim", "abrikoos", "limoen", "kers", "granaatappel",
            "lychee", "pompelmoes", "stekelbes"];
var woord = [];
var foute_pogingen;
var maximum_pogingen = 6;

var levels_pogingen = [12, 9, 6];

var galg_beelden = ["images/galgje1.jpg", "images/galgje2.jpg", "images/galgje3.jpg", "images/galgje4.jpg", "images/galgje5.jpg","images/galgje6.jpg",
    "images/galgje7.jpg", "images/galgje8.jpg", "images/galgje9.jpg", "images/galgje10.jpg", "images/galgje11.jpg", "images/galgje12.jpg"];

var toon_bij_pogingen = "beeld"; //kruis of beeld
 
function start(level){
    setLevel(level);
    letters_gevonden = 0;
    foute_pogingen = 0;
    document.getElementById("resultaat").innerHTML = "";
    toonPogingen();
    toonAlfabet();
    bedenkWoord();
}

function setLevel(level) {
    maximum_pogingen = levels_pogingen[level - 1];

    //verwijder active class van elke reset button
    for(level_count = 1; level_count <= 3; level_count++) {
        document.getElementById("start_level_" + level_count).classList.remove("active");
        //bij gekozen level voeg je active class toe
        if (level == level_count) {
            document.getElementById("start_level_" + level).classList.add("active");
        }
    }
    
}

function toonAlfabet() {
    var html = "";
    for (letter_count=0; letter_count< alfabet.length; letter_count++) {
        html += '<button id="alfabet_letter_' + alfabet[letter_count] + '" onclick="controleerLetter(\'' + alfabet[letter_count] + '\')">' + alfabet[letter_count] + '</button>';
    }
    document.getElementById("alfabet").innerHTML = html;
}

function bedenkWoord() {
    var random_woord = woorden[Math.floor(Math.random() * woorden.length)];
    woord = random_woord.split("");
    console.log(woord);
    toonVraagtekens();
}

function toonVraagtekens() {
    var html = "";
    for (letter_count=0; letter_count< woord.length; letter_count++) {
        html += '<span id="letter_' + (letter_count + 1) + '">?</span>';
    }
    document.getElementById("woord").innerHTML = html;
}

function toonPogingen() {
    var html = "";
    if (toon_bij_pogingen == "kruis") {
        for(poging_count = 1; poging_count <= maximum_pogingen; poging_count++) {
            if (poging_count <= foute_pogingen) {
                html += '<span class="rood" id="poging_' + poging_count + '"><i class="far fa-times-circle"></i></span>';
            }
            else {
                html += '<span class="zwart" id="poging_' + poging_count + '"><i class="far fa-times-circle"></i></span>';
            }
        }       
    }
    
    if (toon_bij_pogingen == "beeld") {
        if (foute_pogingen >= 1) {
            // level 1
            if (maximum_pogingen == 12) {
                // start bij beeld 1
                var src = galg_beelden[foute_pogingen - 1];
            }

            // level 2
            if (maximum_pogingen == 9) {
                //start bij beeld 6
                var src = galg_beelden[5 + foute_pogingen - 1];
            }

            //level 3
            if (maximum_pogingen == 6) {
                //start bij beeld 7
                var src = galg_beelden[6 + foute_pogingen - 1];
            }
            var html = '<img src="' + src + '" />';
        }
    }
    document.getElementById("pogingen").innerHTML = html;
}

function controleerLetter(letter) {
    if (woord.indexOf(letter) > -1) {
        vulLettersIn(letter);

        if (letters_gevonden == woord.length) {
            gewonnen();
        }
    }
    else {
        nieuwePoging();
    }
    document.getElementById("alfabet_letter_" + letter).disabled = true;
}

function vulLettersIn(gekozen_letter) {
    for (letter_count=0; letter_count< woord.length; letter_count++) {
        if (woord[letter_count] == gekozen_letter) {
            letters_gevonden++;
            document.getElementById("letter_" + (letter_count + 1)).innerHTML = gekozen_letter;
        }
    }
}

function nieuwePoging() {
    foute_pogingen++;
    toonPogingen();
    if (foute_pogingen == maximum_pogingen) {
        verloren();
    }
}

function gewonnen() {
    document.getElementById("resultaat").innerHTML = "Proficiat, u bent gewonnen.";
}

function verloren() {
    //disable alle alfabet letter
    for (letter_count=0; letter_count< alfabet.length; letter_count++) {
        document.getElementById("alfabet_letter_" + alfabet[letter_count]).disabled = true;
    }
    toonWoord();
    document.getElementById("resultaat").innerHTML = "Spijtig, u bent verloren.";
}

function toonWoord() {
    //vul elke letter van het woord in
    for (letter_count=0; letter_count< woord.length; letter_count++) {       
        document.getElementById("letter_" + (letter_count + 1)).innerHTML = woord[letter_count];
    }
}