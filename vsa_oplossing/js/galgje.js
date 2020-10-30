var alfabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
var letters_gevonden = 0;
var woorden = ["appel", "peer", "ananas", "citroen", "meloen", "sinaasappel", "kiwi", "passievrucht", "aardbei", "framboos", "braambes", "bosbes", 
            "kiwibes", "mango", "papaya", "banaan", "druif", "mandarijn", "vijg", "perzik", "nectarine", "pruim", "abrikoos", "limoen", "kers", "granaatappel",
            "lychee", "pompelmoes", "stekelbes"];
var woord = [];
var foute_pogingen;
var maximum_pogingen = 6;

/**
 * Start het programma bij het laden van de pagina
 */
function start(){
    foute_pogingen = 0;

    document.getElementById("resultaat").innerHTML = "";
    toonPogingen();
    toonAlfabet();
    bedenkWoord();
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
    for(poging_count = 1; poging_count <= maximum_pogingen; poging_count++) {
        if (poging_count <= foute_pogingen) {
            html += '<span class="rood" id="poging_' + poging_count + '"><i class="far fa-times-circle"></i></span>';
        }
        else {
            html += '<span class="zwart" id="poging_' + poging_count + '"><i class="far fa-times-circle"></i></span>';
        }
    }
    document.getElementById("pogingen").innerHTML = html;
}

/**
 * Bij het klikken op een letter
 * @param {*} letter 
 */
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

/**
 * Bij het vinden van een een letter in het woord
 * @param {*} gekozen_letter 
 */
function vulLettersIn(gekozen_letter) {
    for (letter_count=0; letter_count< woord.length; letter_count++) {
        if (woord[letter_count] == gekozen_letter) {
            letters_gevonden++;

            //vervang ? door letter
            document.getElementById("letter_" + (letter_count + 1)).innerHTML = gekozen_letter;
        }
    }
}

/**
 * Na het controleren van een letter
 */
function nieuwePoging() {
    foute_pogingen++;
    toonPogingen();
    if (foute_pogingen == maximum_pogingen) {
        verloren();
    }
}

/**
 * Wanneer gewonnen
 */
function gewonnen() {
    maakAlfabetOnbruikbaar();
    document.getElementById("resultaat").innerHTML = "Proficiat, u bent gewonnen.";
}

/**
 * Wanneer verloren
 */
function verloren() {
    maakAlfabetOnbruikbaar();
    toonWoord();
    document.getElementById("resultaat").innerHTML = "Spijtig, u bent verloren.";
}

/**
 * Indien gewonnen of verloren
 */
function maakAlfabetOnbruikbaar() {
    for (letter_count=0; letter_count< alfabet.length; letter_count++) {
        document.getElementById("alfabet_letter_" + alfabet[letter_count]).disabled = true;
    }
}

/**
 * Indien verloren
 */
function toonWoord() {
    //vul elke letter van het woord in
    for (letter_count=0; letter_count< woord.length; letter_count++) {       
        document.getElementById("letter_" + (letter_count + 1)).innerHTML = woord[letter_count];
    }
}