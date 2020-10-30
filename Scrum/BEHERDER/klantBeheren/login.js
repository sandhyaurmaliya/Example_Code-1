
function registreren(){
    
  nieuwe_email = document.getElementById('nieuwe_email').value;
  nieuw_wachtwoord = document.getElementById('nieuw_wachtwoord').value;

  var aanmelden_waarden = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.data-web.be/user/register?project=f5gh8JhjAXBd",
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


function inloggen(){
    email = document.getElementById('email').value;
    wachtwoord = document.getElementById('wachtwoord').value

    var inloggen_waarden = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.data-web.be/user/login?project=f5gh8JhjAXBd",
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
        sessionStorage.setItem("gebruiker_token",JSON.stringify(response.status.token))
        document.location = "klant_beheren.html"
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

// reset inloggen 
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



/* 
function email_check (){
    var getypte_email = document.getElementById('email').value;

    var user_tabel = {
        url: "https://api.data-web.be/item/read",
        data: {
            "project": "CFNIOuwTJGyR", 
            "entity": "user",
            "filter": "[\"email\", \"LIKE\", \"%"+getypte_email+"%\"]"
        }
    }
    $.ajax(user_tabel)
    .done(function(response){
        console.log(response)
    })
}
 */