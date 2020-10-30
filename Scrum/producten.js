function go_to_product(producttype){
  document.location = "winkel.html?type=" + producttype;
}
var path;
function krijgproducten_product_typ()
{
    $.ajax({
          
        method: "GET",
        url: "https://api.data-web.be/item/read",
        data: {
            "project": "f5gh8JhjAXBd", 
            "entity": "product_typ",
              }            
       
      }).done(function(response) {
        console.log(response);
        var product_typ = response.data.items;
        path = response.data.assets_path
        toonproducttyp(product_typ) ;                    
      
        }).fail(function (msg) {
        console.log("read fail:");
          console.log(msg);
        });
      
    }

function toonproducttyp(product_typ)
{ 

  if(document.body.className=='index'){
  
    for (let i = 0; i < product_typ.length; i++) {
      const element = product_typ[i];
      if (i==0){
        state = 'active'
      } else{
        state = ''
      }
      document.getElementById('categorieen_caousel').innerHTML += `       
      <div class="carousel-item ${state}" style="background-image: url(${path}/${element.slideshowimage.name}); background-size: cover; ">
        <div class="container">
          <div class="carousel-caption text-left">
            <h1>${element.product_type_naam}</h1>
            <p>${element.Omschrijving}</p>
            <p><a class="btn btn-lg btn-outline-secondary" href="winkel.html?type=${element.productTypeID}" role="button">Shop nu</a></p>
          </div>
        </div>
      </div>
      `
    }

  } else if (document.body.className=='categorieen'){
    product_typ.forEach(element => { 
        console.log(element)
      document.getElementById('product_typ').innerHTML += 
      `<a href="javascript:" onclick="go_to_product(${element.productTypeID})" style='color: #495057;'>
        <div class="card" style="width: 18rem;">
        <h3 class='text-center' style='position: absolute; top: 40%; left: 35%; color: white; font-family: Roboto;'>${element.product_type_naam}</h3>
        <img src="${path}/${element.voorbeeldafbeelding.name}" height='400' class="card-img-top" alt="...">
        </div>
        </a>
`
   });
  }
}
    