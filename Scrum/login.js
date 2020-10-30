
function login(user) {
  if(user == 'neiuwe_user'){
    email=$("#create_email").val(), 
    wachtwoord= $("#create_wachtwoord").val()
  }else{
    email = $("#klant_email").val(),
    wachtwoord= $("#klant_wachtwoord").val()
  }

    $.ajax({               
            url: "https://api.data-web.be/user/login?project=f5gh8JhjAXBd",    
            type: "POST",
            data: { 
                "email": email, 
                "password": wachtwoord                   
        }            
    }).done(function(json) {
        
        sessionStorage.setItem("token", json.status.token);
        sessionStorage.setItem("gebruiker", email);
        
        session_control()

    }).fail(function (msg) {
        console.log("read fail:");
        
        console.log(msg.responseText);
        var errormsg=msg.responseText
        if(errormsg.includes("Email is required")){
          document.getElementById("klant_email").placeholder="Email verplicht"
          
        }
        if(errormsg.includes("Password is required")){
          document.getElementById("klant_wachtwoord").placeholder="wachtwoord verplicht"
        }
    }); 
}



function register(){

    email=$("#create_email").val(), 
    wachtwoord= $("#create_wachtwoord").val(),
    voornaam= $("#create_voornaam").val(),
    familienaam= $("#familienaam").val(),
    adres= $("#adres").val(),
    telefoon= $("#telefoonnummer").val(),
    role="Klant"
      
  $.ajax({
    "async": true,
    "crossDomain": true,
    "url": "https://api.data-web.be/user/register?project=f5gh8JhjAXBd",
    "method":"POST",
    "headers": {},
    data:{
      values: { 
        "email": email, 
        "password": wachtwoord,
        "voornaam": voornaam,
        "familienaam": familienaam,              
        "adres": adres,
        "telefoon": telefoon,
        "role": role
      }
    } 
  }).done(function (response) {
        user = 'neiuwe_user'
        login(user)
        console.log(response)
        document.location='index.html'
 
    }).fail(function(response){
         console.log(response.resonseText.status);
      });
}

function logout(){
  token = sessionStorage.getItem('token')

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.data-web.be/user/logout?project=f5gh8JhjAXBd",
    "method": "GET",
    "headers": {
      "authorization": `Bearer ${token}`
    }
  }
  
  $.ajax(settings).done(function (response) {
    sessionStorage.setItem("token", 'afgemeld');
    session_control()            
  });
}


function session_control(){
  var gebruiker = sessionStorage.getItem('gebruiker')
  var token = sessionStorage.getItem("token");

  if(token=='afgemeld'||token == null){
    toon_aanmelden_terug()
  } else{
    toon_afmelden_knop(gebruiker)
  }
  document.getElementById('aanmelden_dropdown').classList.remove('show') 

  if(document.body.className =='gericht_vanaf_bestelling'){
    document.location = 'bestelling.html'
  }
}

function toon_afmelden_knop(aangemelde_gebruiker){
  document.getElementById('aanmelden_dropdown').innerHTML= `
  <form class="px-4 py-3 " style="width: 320px; display: grid;">
  <p  class="dropheader" style="font-size: 1em; color: #2b2b2b;"><strong>${aangemelde_gebruiker}</strong></p>
  <button onclick="logout()" type="button" class="btn btn-danger" style="font-size: 14px;">Afmelden</button>
  </form>`

  document.getElementById('gebruiker_knop').innerHTML=`
  <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" class="bi bi-person-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
  </svg>`
}

function toon_aanmelden_terug(){
  document.getElementById('aanmelden_dropdown').innerHTML=`
  <div class="dropdown-item px-4 py-3" style="width: 400px;">
    <p  class="dropheader" style="font-size: 1.3em; color: #2b2b2b;"><strong>Meld je aan</strong></p>
    <div class="dropdown-divider"></div>
    <div class="form-group">
        <label for="klant_email">Email</label>
        <input type="email" class="form-control" id="klant_email" placeholder="email@voorbeeld.com">
    </div>
    <div class="form-group">
      <label for="klant_wachtwoord">Wachtwoord</label>
      <input type="password" class="form-control" id="klant_wachtwoord" placeholder="wachtwoord">
    </div>
    <button onclick="login()" class="btn btn-secondary" style="font-size: 14px;">Aanmeelden</button>
  </div>
  <div class="dropdown-divider"></div>
  <a class="dropdown-item" onclick="ga_naar_register()" href="javascript:;">Nieuwe gebruiker?</a>
  <a class="dropdown-item" href="#">Uw wachtwoord vergeten? (in progress)</a>

`
document.getElementById('gebruiker_knop').innerHTML=`
<svg width="1.8em" height="1.8em" viewBox="0 0 16 16" class="bi bi-person" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M10 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6 5c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
</svg>
`
}

function ga_naar_register(){
    document.location='register.html'
}