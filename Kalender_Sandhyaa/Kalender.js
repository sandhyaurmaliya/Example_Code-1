window.onload = function() {datum()};

var Dagen = ["Man", "Din" , "Woe" , "Don" , "Vri" , "Zat" , "Zon"];
var Maanden = ["Jan" , "Feb" , "Maart" , "April" , "Mei" , "Juni" , "Juli", "Aug" , "Sept" , "Okt" , "Nov" , "Dec"];
var feestdag = " ";

function datum()
{    
    var Vandaag = new Date();
    var maand = Vandaag.getMonth();
    
    var yyyy = Vandaag.getFullYear();
    document.getElementById("maand").innerHTML = Maanden[maand] ;
    document.getElementById("jaar").innerHTML = yyyy;

    ToonKalender(maand, yyyy)

}

function ToonKalender(maand, jaar )
{
    var today = new Date();
    var eerstDaag = (new Date(jaar, maand)).getDay();
    
    var daysInMonth = daysInMonths( jaar, maand);
   
    var  beginDatum = 1;
    var maandString = Maanden[maand];
  
    document.getElementById("Kalenderdatum").innerHTML = " ";


    var kalender = document.getElementById("Kalenderdatum");  
    var kalender_cell = [];  
    feestdag = " ";
    document.getElementById("feestdagen").innerHTML = " ";
    
    for( var row = 0; row <= 5; row++ )
    {  
        if (beginDatum <= daysInMonth)
        {
            var kalender_row = kalender.insertRow(row);
            for (var b=0; b<7; b++)
            {
                kalender_cell[b] = kalender_row.insertCell(b);
                if ( row == 0 && b < (eerstDaag - 1))
                {
                    document.getElementById("Kalenderdatum").rows[row].cells[b].innerHTML = " ";
                    
                }
                else if(beginDatum <= daysInMonth)
                {
                    document.getElementById("Kalenderdatum").rows[row].cells[b].innerHTML = beginDatum;
                    if (beginDatum == today.getDate() && jaar == today.getFullYear() && maand == today.getMonth()) 
                    {
                        document.getElementById("Kalenderdatum").rows[row].cells[b].style.backgroundColor = "lightblue"
                    }
                    if (jaar == today.getFullYear() && feestDagen(beginDatum, maand))
                    {
                        document.getElementById("Kalenderdatum").rows[row].cells[b].style.backgroundColor = "lightgray"
                        
                        document.getElementById("feestdagen").innerHTML += "&bull;" + " "+ beginDatum + " " + maandString + " " 
                                                                            + jaar + ":  " + feestdag +  " "+ "</br>" + "</br>";
                        
                    }

                    if (jaar == today.getFullYear() && maand == 6 || maand == 7)
                    {
                        if (verlofdagen(beginDatum, maand) && !feestDagen(beginDatum, maand))
                        {
                            document.getElementById("Kalenderdatum").rows[row].cells[b].style.backgroundColor = "yellow"; 
                        }
                    }
                
                    beginDatum++                
                }           
            }
        }
    } 
    
    if (jaar == today.getFullYear() && maand == 6)
    {
        document.getElementById("feestdagen").innerHTML += "&bull;" + " 20 juli 2020 - 7 aug 2020: Verlof" 
    }

}

function daysInMonths( iyear, imaand)
{
    return 32 - new Date(iyear, imaand, 32).getDate();
}

function vorige_maand()
{
    var huidigeMaand = document.getElementById("maand").innerHTML;
    var huidigjaar = document.getElementById("jaar").innerHTML; 
    var maandNum = Maanden.indexOf(huidigeMaand);
     
    huidigjaar = (maandNum == 0) ? huidigjaar - 1 : huidigjaar;
    maandNum = (maandNum == 0) ? 11 : maandNum - 1;
    huidigeMaand = Maanden[maandNum];
    document.getElementById("maand").innerHTML = huidigeMaand;
    document.getElementById("jaar").innerHTML = huidigjaar;
    
    ToonKalender(maandNum, huidigjaar);    

}
function volgende_maand()
{
    var huidigeMaand = document.getElementById("maand").innerHTML;
    var huidigjaar = document.getElementById("jaar").innerHTML; 
    var maandNum = Maanden.indexOf(huidigeMaand);
     
    huidigjaar = (maandNum === 11) ? Number(huidigjaar) + 1 : huidigjaar;
    maandNum = (maandNum + 1) % 12;

    huidigeMaand = Maanden[maandNum];

    document.getElementById("maand").innerHTML = huidigeMaand;
    document.getElementById("jaar").innerHTML = huidigjaar;
    ToonKalender(maandNum, huidigjaar);
}

 function feestDagen(daag, maand)
{
    var daag;    

    if (daag == 1  && maand == 0)
    {
        feestdag = "Nieuwjaar";
    }
    else if (daag == 13  && maand == 3)
    {
        feestdag = "Paasmaandag";
    } 
    else if (daag == 1  && maand == 4)
    {
        feestdag = "Dag van de Arbeid";
    } 
    else if (daag == 21  && maand == 4)
    {
        feestdag = "O.H. Hemelvaart";
    } 
    else if (daag == 1  && maand == 5)
    {
        feestdag = "Pinkstermaandag";
    } 
    else if (daag == 11  && maand == 6)
    {
        feestdag = "Feest van de Vlaamse Gemeenschap";
    } 
    else if (daag == 21  && maand == 6)
    {
        feestdag = "Nationale feestdag";
    } 
    else if (daag == 15  && maand == 7)
    {
        feestdag = "O.L.V. hemelvaart";
    } 
    else if (daag == 1  && maand == 10)
    {
        feestdag = "Allerheiligen";
    } 
    else if (daag == 2  && maand == 10)
    {
        feestdag = "Allerzielen";
    } 
    else if (daag == 11  && maand == 10)
    {
        feestdag = "Wapenstilstand";
    } 
    else if (daag == 15  && maand == 10)
    {
        feestdag = "Feest van de Dynastie";
    } 
    else if (daag == 25  && maand == 11)
    {
        feestdag = "Kerstmis";
    } 

    else 
    {
        return 0;
    } 

    return 1;

}

function verlofdagen(daag, maand)
{
  var verlofdagenjuli = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  var verlofdagenaug = [1, 2, 3, 4, 5, 6, 7];
    if (maand == 6 && verlofdagenjuli.includes(daag))
    {
         return 1;
    }

    else if (maand == 7 && verlofdagenaug.includes(daag))
    {
         return 1;
    }

    else 
    {
        return 0;
    }
}
