
function inloggen(){
  email = document.getElementById('email').value;
  wachtwoord = document.getElementById('wachtwoord').value

  var inloggen_waarden = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.data-web.be/v1/user/login?project=f5gh8JhjAXBd",
      "method": "POST",
      "headers": {},
      "data": {
        "email": email,
        "password": wachtwoord
      }
    }
    
    $.ajax(inloggen_waarden)
    .done(function (response) {
      console.log(response)
      
      if(response.data.item.role =='Admin'){
        sessionStorage.setItem("gebruiker_token",response.status.token)
        document.location = "product_beheren.html"
      }else{
        document.getElementById('invalid_login').innerHTML = "U mag niet inloggen op deze pagina. <br> Vraag uw beheerderswachtwoord op bij IT"
        document.getElementById('invalid_login').style.display= 'unset'
      }

    
    })
    .fail(function(response){
        var error_message = response.responseJSON.status.message
        console.log(error_message)
        if(error_message == '400: Email is required.'){
          document.getElementById('email').className += ' is-invalid'
          document.getElementById('email').placeholder = "E mail is required"
        }
        if(error_message == "400: Password is required."){
          document.getElementById('wachtwoord').className += ' is-invalid'
          document.getElementById('wachtwoord').placeholder = "Password Required"
        }
        if(error_message =="User with this e-mail/password not found."){
          document.getElementById('wachtwoord').className += ' is-invalid'
          document.getElementById('email').className += ' is-invalid'
          document.getElementById('invalid_login').innerHTML = "Onjuist wachtwoord of e-mailadres"
          document.getElementById('invalid_login').style.display= 'unset'
        }        
      });
}

/////////////////////////////  SESSIE CONTROLEREN ////////////////////////



function session_control(){
  var token = sessionStorage.getItem('gebruiker_token')

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.data-web.be/v1/user/validate_token?project=f5gh8JhjAXBd",
    "method": "GET",
    "headers": {
      "authorization": `Bearer ${token}`
    }
  }     
      $.ajax(settings)
      .done(function (response) {
        if(document.body.className == 'klant_beheren_page')
        {
            krijg_klant_data();  
        }
        else if(document.body.className == 'product_beheren')
        {
          initialiseren();
        }      
      })
      .fail(function(response){
          console.log(response)
          document.location = 'login.html'
        })
}


/* 
function registreren(){
    
  nieuwe_email = document.getElementById('nieuwe_email').value;
  nieuw_wachtwoord = document.getElementById('nieuw_wachtwoord').value;

  var aanmelden_waarden = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.data-web.be/v1/user/register?project=f5gh8JhjAXBd",
      "method": "POST",
      "headers": {},
      "data": {
        "values": `{\"email\":\"${nieuwe_email}\",\"password\":\"${nieuw_wachtwoord}\"}`
      }
    }
    $.ajax(aanmelden_waarden)
    .done(function () {
        console.log('register done')
    })
    .fail(function(response){
        console.log(response.responseText)
    });
}
 */

function afmelden(){  
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.data-web.be/user/logout?project=f5gh8JhjAXBd",
      "method": "GET",
      "headers": {
        "authorization": `Bearer ${sessionStorage.getItem('gebruiker_token')}`
      }
    }
  $.ajax(settings)
  .done(function (response) {
      console.log(response)
      sessionStorage.setItem('gebruiker_token','logged out')
      session_control()
  }).fail(function(response){
      console.log(res)
      
  })

}




// reset inloggen 
if(document.body.className=='login_pagina'){
  document.getElementById('email').addEventListener('keydown',function(event){
    document.getElementById('email').className = 'form-control'
    document.getElementById('wachtwoord').className = 'form-control'
    document.getElementById('wachtwoord').value = ''
    document.getElementById('invalid_login').style.display= 'none'
})
document.getElementById('email').addEventListener('focus',function(event){
document.getElementById('email').className = 'form-control'
})
document.getElementById('wachtwoord').addEventListener('focus',function(){
document.getElementById('wachtwoord').className = 'form-control'
})
document.getElementById('wachtwoord').addEventListener('keydown',function(){
document.getElementById('wachtwoord').className = 'form-control'
})


// druk op enter om in te loggen
document.getElementById("wachtwoord").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
      event.preventDefault();
      inloggen()
  }
  });
}


