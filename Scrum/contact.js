function Toevoeg_contact_informatie()
{ 
    
    $.ajax({
        url: "https://api.data-web.be/item/create?project=f5gh8JhjAXBd&entity=contact&token_required=false",       
        
        method: "POST",
        data: {
        values : {
                  "Naam" : $("#name").val(),
                  "Email": $("#email").val(),
                  "Bericht": $("#bericht").val(),                  
                  
                  }   
              }          
    }).done(function(response) {
      console.log(response); 
      document.getElementById('formulier_naam').innerHTML = 'Bedankt voor het contacteren.'
      document.getElementById('contact_formulier').innerHTML = 
      ` <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Uw bericht is verzonden.</h5>
            <p class="card-text">U krijgt een e-mail van onze klantenservice in één of twee dagen..</p>
            <a href="index.html" class="btn btn-primary">Ga terug</a>
          </div>
        </div>`                            
    
      }).fail(function (msg) {
      console.log("create fail:");
        console.log(msg);
      });

}