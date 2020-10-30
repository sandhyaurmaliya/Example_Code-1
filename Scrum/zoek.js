function zoek(){
    zoekwaarde= document.getElementById('zoek').value
    document.location = "winkel.html?type=&zoekwaarde=" + zoekwaarde;
}

//om de Enter-knop te gebruiken om te zoeken
document.getElementById("zoek").addEventListener("keyup", function(event) {

    if(document.getElementById("zoek").value !==''){
        if (event.keyCode === 13) {
            event.preventDefault();
            zoek()
        }
    }else{
        document.getElementById("zoek").placeholder = 'u moet iets typen om te zoeken'
    }

});

