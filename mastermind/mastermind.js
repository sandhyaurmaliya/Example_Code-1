var getalen = [];
var input_getalen = [];
var score_getalen = [];
var attempt;

function generateRandomNumber()
{
    var n = 10;    
        getalen[0] = Math.floor(Math.random()*n);
        getalen[1] = Math.floor(Math.random()*n);
        getalen[2] = Math.floor(Math.random()*n);
        getalen[3] = Math.floor(Math.random()*n);
        console.log(getalen);
}

function getelement()
{
    var speel_input = "";
    for (var index =0; index < 4 ; index++)   
    {
        speel_input += '<input type="text" id= "getaal_'+index+'" value =""/>';
    }

    speel_input += '<button id = "controleer" onclick="controleer()"> ✔</button>';
    document.getElementById("speel_input").innerHTML = speel_input;
}

function controleer()
{
    for (var count = 0; count<4; count++)
    {    
        input_getalen[count] = Number(document.getElementById("getaal_"+count).value);
    }
    
    console.log(input_getalen);

    var status = getMatch(input_getalen, getalen);
    if (status == "true")
    {
        var resultaat = "Gewonnen";
        document.getElementById("resultaat").innerHTML = resultaat;
        getelement();
        document.getElementById("controleer").disabled = true;
    }
    else if (attempt < 10)
        {   
            getelement();
        }
        else{
            var resultaat = "Verloren";
            document.getElementById("resultaat").innerHTML = resultaat;
            getelement();
            document.getElementById("controleer").disabled = true;
        }    
}

function getMatch(a, b) 
{
    var flag = "true"  ; 
    var mastermind_cell = []; 
    var score_cell= [];
    for (var j = 0; j < 4; j++)
    {

        var n = b.includes(a[j]);
            if (n == true) 
            {
                if (a[j] == b[j])
                {
                     score_getalen[j] = "Groen";
                    
                }
                else                {                
                   
                    score_getalen[j] = "Rode";
                    flag = "false"
                }
            }
            else
            {              
                score_getalen[j] = "Grijs";
                flag = "false"
            }
        
    }    
    console.log(score_getalen);  

    var mastermind = document.getElementById("mastermind");    
    var score = document.getElementById("score");
    
    var mastermind_row = mastermind.insertRow(0);
    var score_row = score.insertRow(0);   

     for (var b=0; b<4; b++)
    {
        mastermind_cell[b] = mastermind_row.insertCell(b);
        score_cell[b] = score_row.insertCell(b);
        mastermind_cell[b].innerHTML = a[b];

        if (score_getalen[b] == "Groen")
        {
            //score_cell[b].style.backgroundColor = "green"; 
            score_cell[b].style.color = "green"; 

        }
        else if (score_getalen[b] == "Rode") 
        {
            score_cell[b].style.color = "red"; 

        }
        else if (score_getalen[b] == "Grijs") 
        {
           score_cell[b].style.color = "gray"; 

        }
        
        score_cell[b].innerHTML ="&diams;";     
         
    }
    attempt = document.getElementById("score").rows.length;
    return flag;
}



    


