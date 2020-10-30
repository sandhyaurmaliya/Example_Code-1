
var woorden_lijst = [ 
    "vowels" , "origin" , "about" ,  "above" ,  "actor" ,  "acute" , "admit" , "adopt" ,
    "africa" ,  "animal" ,	"august" , "banana" , "beach" , "began" , "begin" , "begun" , "below" , "blur",
    "cable", "calif" , "carry" , "catch" , "cause" , "chain", "chair" ,"beer",
    "earth" , "eight" , "elite" , "empty" , "enemy" , "enjoy", "enter" ,"vijand","frankrijk",
    "false" , "fault" , "fiber" , "fifth" , "fifty" , "fight" , "final" , "first" , "opmerking", "verhaal",
    "giant" , "given" , "glass" , "globe" , "going" , "grace" , "grade" , "grand" ,
    "happy" , "harry" , "heart" , "heavy" , "hence" , "henry" , "horse" , "hotel" ,
    "austin" , "breath" ,  "broken" ,	"change" ,	"circle" ,	"circus" ,	"donate" ,	
    "eleven" ,  "energy" ,	"family" ,	 "father" ,	"friday" , "future" , "heaven" ,		
    "london" ,  "moment" ,	"monday" ,  "monkey" ,  "mother" ,  "mumbai" ,"droom",	
    "nature" , "ninety" , "orange" , "person" ,	 "pirate" ,	 "poetry" ,	
    "rachel" ,	"school" , "secret" , "silver" ,  "snitch" , "spring" ,
    "sunday" , "system" , "thirty" ,  "turtle" ,  "twenty" ,  "yellow"];

var verborgen_woord = "";
var toon_woord = "";
var gissen = [];
var gissenLetter;
var letter;
var mistakes = 0;
var level= "";
var hangman = ["1.jpg" , "2.jpg" , "3.jpg" ,"4.jpg" ,"5.jpg" , "6.jpg" , "7.jpg" , "8.jpg" ,"9.jpg" , "10.jpg" , "11.jpg" , "12.jpg" ];

function start()
{ 
    //levelselecteer();
    
    document.getElementById("hangman").src = " ";
    document.getElementById("resultaat").innerHTML = " ";

    mistakes = 0;
    level= "";
    verborgen_woord = " ";
    toon_woord = "";
    gissen = [];
    randomwoord();
    
    ToonKeyboard();
    denkWoord();

}

/*function levelselecteer()
{
  level = document.getElementById("levels").value ;
  console.log(level);
}*/

function randomwoord()
{                        
    verborgenWoord = woorden_lijst[Math.floor(Math.random() * woorden_lijst.length)];
    console.log(verborgenWoord);
}


function ToonKeyboard()
{
    var keyboard_buttons = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter =>
        '<button class = "button" id = '+letter+' onClick = "handleGuess(id)"> '+letter+' </button>'        
        ).join('');
    document.getElementById("keyboard").innerHTML = keyboard_buttons;
}
 
function denkWoord()
{
    toon_woord = verborgenWoord.split('').map(letter => (gissen.indexOf(letter) >= 0 ? letter : " ? ")).join('');
    document.getElementById("woordspotlight").innerHTML = toon_woord;
}

function handleGuess(gissenLetter)
{
    gissenLetter = gissenLetter.toLowerCase();
    gissen.indexOf(gissenLetter) === -1 ? gissen.push(gissenLetter) : null;
    document.getElementById(gissenLetter).disabled = true;
    document.getElementById(gissenLetter).style.opacity = "0.5";
  
    if (verborgenWoord.indexOf(gissenLetter) >= 0)
    {
        denkWoord();
        geWonnen();        
    }
    else if (verborgenWoord.indexOf(gissenLetter) === -1)
    {
        updatemistake();    
    }
}

function geWonnen()
{
    if (toon_woord == verborgenWoord )
    {
       document.getElementById("resultaat").innerHTML = "You won, Proficiat...";
       
    }
    else return;
}

function verloren()
{
       
    var text = "You lost, better luck next time";
    document.getElementById("resultaat").innerHTML = text + " " + "Right word is" + " " + verborgenWoord;
    document.getElementById("keyboard").innerHTML = "";
    
}

function updatemistake()
{
    level = document.getElementById("levels").value ;
    console.log(level);
    
    if (mistakes >= 12)
    {
        verloren();  
        return; 
    }  
    else if (level == "level_1")
    {
        document.getElementById("hangman").src = hangman[mistakes];  
        mistakes++;        
    }

    else if (level == "level_2")
    {
        if (mistakes == 0)
        {
            mistakes = mistakes + 2;
        }
        document.getElementById("hangman").src = hangman[mistakes];  
        mistakes++;        
    }
    
    else if (level == "level_3")
    {
        if (mistakes == 0)
        {
            mistakes = mistakes + 5;
        }
        document.getElementById("hangman").src = hangman[mistakes];  
        mistakes++;
                
    }     
     
}
