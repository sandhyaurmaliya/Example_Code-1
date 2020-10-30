function read_all() {
  const urlParams = new URLSearchParams(window.location.search);
  let type = urlParams.getAll('type');

  const newurlParam = new URLSearchParams(window.location.search);
  let zoekwaarde = newurlParam.getAll('zoekwaarde')

  $.ajax({          
    method: "GET",
    url: "https://api.data-web.be/item/read",
    data: {
        "project": "f5gh8JhjAXBd", 
        "entity": "Producten"
          }            
  }).done(function(response) {
    product_typ = response.data.items;
    
    $.ajax({
        method: "GET",
        url: "https://api.data-web.be/item/read",
        data: {
            "project": "f5gh8JhjAXBd", 
            "entity": "Producten",
            "filter": [["Product_typ","LIKE","%" +type + "%"],["CONCAT(ProductNaam, ' ', product_oms)", "LIKE", "%"+zoekwaarde+"%"]],
            "relation":
                        [{"pri_entity":"Producten", "pri_key":"ProductID", "sec_entity": "ProductSize", "sec_key": "ProductID"},
                        {"pri_entity":"Producten", "pri_key":"ProductID", "sec_entity": "productKleuren", "sec_key": "ProductID"},
                        {"pri_entity":"ProductSize", "pri_key":"SizeID", "sec_entity": "size", "sec_key": "size_id"},
                        {"pri_entity":"productKleuren", "pri_key":"KleurID", "sec_entity": "Kleuren", "sec_key": "KleurID"},
                        {"pri_entity":"productKleuren", "pri_key":"BeeldID", "sec_entity": "Beelden", "sec_key": "BeeldID"}
                     ], 
            "paging": {
                        "page": 1,
                        "items_per_page": 20
                        }
                }            
        }).done(function(response) {

          product = response.data.items;          
          toonProducten (product)
  
        }).fail(function (msg) {
            console.log("read fail:");
            console.log(msg);
        });             
    }).fail(function (msg) {
    console.log("read fail:");
      console.log(msg);
    }); 
  
  }
  
  
  
function toonProducten (producten){

  for (i=0; i<producten.length; i++){

    const product_id = producten[i].ProductID
    const product_naam = producten[i].ProductNaam
    const product_prijs = producten[i].Prijs
    const beeldPath = producten[i].productKleuren.items[0].Beelden.assets_path
    const beeldNaam = producten[i].productKleuren.items[0].Beelden.items[0].directory.name
    const beeldURL = `${beeldPath}/${beeldNaam}`


    document.getElementById('producten').innerHTML += 
    `<div class="col-md-3">
      <div class="card mb-3 shadow-sm" >
        <img id="product_img${product_id}" class='card-img-top' src='${beeldURL}' onclick="detail('${product_id}')" style='cursor:pointer; height:395px; object-fit: cover;'>
        <div class="card-body text-center pb-0">
          <p class="card-title mb-0"><strong> ${product_naam}</strong></p>
          <p class="card-text mb-0">\u20AC ${product_prijs}</p>
          <div class="input-group m-2">
                <select class="browser-default custom-select" id='maat${product_id}' aria-label="Example select with button addon">
                <option value=0 selected>Kies maat</option> 
                </select>  
          </div> 
          
          <div class="form-check mb-3 pt-1" id='kleur${product_id}'>
          </div>   
          <div class="row d-flex justify-content-center mb-3">
          <a class="btn btn-outline m-1" onclick='detail("${product_id}")'  href='javascript:;' >
            <svg width="1.4em" height="1.4em" viewBox="0 0 16 16" class="bi bi-zoom-in" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
              <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
              <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
            </svg>
          </a>
          <a id='product_toevoegen_knop${product_id}' class="btn btn-outline m-1" onclick='product_toevoegen("${product_naam}","${product_id}","${product_prijs}","${beeldURL}")' >
            <svg width="1.4em" height="1.4em" viewBox="0 0 16 16" class="bi bi-bag-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M8 1a2.5 2.5 0 0 0-2.5 2.5V4h5v-.5A2.5 2.5 0 0 0 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5H2z"/>
              <path fill-rule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"/>
            </svg>              
          </a>
         </div>    
        </div>
      </div>
    `
      //MAAT OPTIES
      productenMaten = producten[i].ProductSize.items
      for (let j = 0; j < productenMaten.length; j++) {

        const value = productenMaten[j].SizeID
        const maat_omschrijving = productenMaten[j].size.items[0].size_oms

        document.getElementById(`maat${product_id}`).innerHTML+=`<option value="${value}"> ${maat_omschrijving}</option>`
      }
  
       //Kleur opties
      productenKleuren =producten[i].productKleuren.items
      for (let k = 0; k < productenKleuren.length; k++) {
        console.log(productenKleuren[k])
      
        var kleurnaam = productenKleuren[k].Kleuren.items[0].Omschrijving;
        var kleurID = productenKleuren[k].KleurID
        var path = productenKleuren[k].Beelden.assets_path
        var beeld_naam = productenKleuren[k].Beelden.items[0].directory.name
        var kleur_beelden_directory = `${path}/${beeld_naam}`

        if(k==0){
            state='checked'
          }else{
            state = ''
          }
        document.getElementById(`kleur${product_id}`).innerHTML+=`
          <div class="form-check form-check-inline" style='font-size: 14px;'>
              <input onclick='verander_beeld_en_parameters("${product_naam}","${product_id}","${product_prijs}","${kleur_beelden_directory}")' class="form-check-input" type="radio" name="kleur${product[i].ProductID}" id="${kleurnaam}" value="${kleurID}" ${state}>
              <label class="form-check-label" for="inlineRadio1">${kleurnaam}</label>
          </div>`
          } 
      }    
};
  
// verander afbeelding en "product_toevoegen(argumenten)" met radiobutton  
function verander_beeld_en_parameters(naam,id,prijs,directory){

  document.getElementById(`product_img${id}`).src = directory;

  var product_toevoegen_knop=  document.getElementById(`product_toevoegen_knop${id}`)

  product_toevoegen_knop.setAttribute("onclick",`product_toevoegen('${naam}','${id}','${prijs}','${directory}')`);    

  if(document.body.className=='product_detail'){
    document.getElementById(`zoomed`).src = directory;
    setTimeout(() => {
      document.getElementById('img-magnifier-glass').remove()
      magnify('zoomed', 3)

    }, 500);
  }
}

  
// Product Detail 
  
function detail(productID){
    document.location = "specific-product.html?id=" + productID;
  }
  
function krijg_product_details(){
  const urlParams = new URLSearchParams(window.location.search);
  const gekozen_id = urlParams.get('id'); 
  
  $.ajax({
    method: "GET",
    url: "https://api.data-web.be/item/single_read",
    data: {
        "project": "f5gh8JhjAXBd", 
        "entity": "Producten",
        "id": gekozen_id,
        "relation":
        [{"pri_entity":"Producten", "pri_key":"ProductID", "sec_entity": "ProductSize", "sec_key": "ProductID"},
        {"pri_entity":"Producten", "pri_key":"ProductID", "sec_entity": "productKleuren", "sec_key": "ProductID"},
        {"pri_entity":"ProductSize", "pri_key":"SizeID", "sec_entity": "size", "sec_key": "size_id"},
        {"pri_entity":"productKleuren", "pri_key":"KleurID", "sec_entity": "Kleuren", "sec_key": "KleurID"},
        {"pri_entity":"productKleuren", "pri_key":"BeeldID", "sec_entity": "Beelden", "sec_key": "BeeldID"}
        ]     
     }  
  }).done(function(response) {
      console.log(response)
      product_detail = response.data.item
      productMaatArray = product_detail.ProductSize.items
      productKleurArray = product_detail.productKleuren.items
  
      toon_product_detail(product_detail,productMaatArray,productKleurArray)
    
  }).fail(function (msg) {
    console.log("read fail:");
    console.log(msg);
  });
  }
  
  
function toon_product_detail (geopend_product,maat_array, kleur_array){

    //Info
    document.getElementById('geopened_product_info').innerHTML=`${geopend_product.ProductNaam}<br> <span class="text-muted">\u20AC ${geopend_product.Prijs}</span>`
        
    //Omschrijving 
    document.getElementById('detail_oms').innerHTML = geopend_product.product_oms
    
    //Maat opties
    document.getElementById("maat_opties").innerHTML = `
    <select class="custom-select" id="maat${geopend_product.ProductID}">
      <option value="0" selected>Kies Maat</option>
    </select>`
    for (let i = 0; i < maat_array.length; i++) {
      value = maat_array[i].SizeID;
      maat_omschrijving = maat_array[i].size.items[0].size_oms;
      
      document.getElementById('maat'+ geopend_product.ProductID).innerHTML+=`
      <option value="${value}"> ${maat_omschrijving}</option>`
    }
  
    //Kleur opties
    for (let i = 0; i < kleur_array.length; i++) {

      if(i==0){
         state='checked'
       }else{
         state = ''
       }
       console.log(kleur_array[i])
       value = kleur_array[i].KleurID

       kleur_omschrijving = kleur_array[i].Kleuren.items[0].Omschrijving
       beeldenPaths = kleur_array[i].Beelden.assets_path
       beeldenNamen = kleur_array[i].Beelden.items[0].directory.name 
       productBeeld_directory = `${beeldenPaths}/${beeldenNamen}`

       
       document.getElementById('geopened_product_kleur').innerHTML+=`
       <div class="form-check form-check-inline">
           <input onclick='verander_beeld_en_parameters("${geopend_product.ProductNaam}","${geopend_product.ProductID}","${geopend_product.Prijs}","${productBeeld_directory}")' class="form-check-input" type="radio" name="kleur${geopend_product.ProductID}" id="${kleur_omschrijving}" value="${value}" ${state}>
           <label class="form-check-label" for="inlineRadio1">${kleur_omschrijving}</label>
       </div>`         
    }

    var beeldPath = geopend_product.productKleuren.items[0].Beelden.assets_path
    var beeldNaam = geopend_product.productKleuren.items[0].Beelden.items[0].directory.name
    var geopend_product_eerst_beeld = `${beeldPath}/${beeldNaam}` 
    document.getElementById('geopened_knop').innerHTML = `<button id='product_toevoegen_knop${geopend_product.ProductID}' onclick='product_toevoegen("${geopend_product.ProductNaam}","${geopend_product.ProductID}","${geopend_product.Prijs}","${geopend_product_eerst_beeld}")' class="btn btn-secondary">Toevoegen aan winkelwagen</button>`
  
    //Beeld vc
    document.getElementById('geopened_product_beeld').innerHTML =`
    <img id="product_img${geopend_product.ProductID}" src='${geopend_product_eerst_beeld}'  class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" style="cursor: zoom-in;" >
    ` 
    document.getElementById('zoomed').src = geopend_product_eerst_beeld

  }

  
function ga_terug(){
  window.history.back();
}


//MAGNIFYING ZOOM AFTER FIRST ZOOM W3 Code

function magnify(imgID, zoom) {
  var img, glass, w, h, bw;
  img = document.getElementById(imgID);
  /*create magnifier glass:*/
  glass = document.createElement("DIV");
  glass.setAttribute("class", "img-magnifier-glass");
  glass.setAttribute("id", "img-magnifier-glass");

  /*insert magnifier glass:*/
  img.parentElement.insertBefore(glass, img);
  /*set background properties for the magnifier glass:*/
  glass.style.backgroundImage = "url('" + img.src + "')";
  glass.style.backgroundRepeat = "no-repeat";
  glass.style.backgroundSize = (1100) + "px " ;
  bw = 3;
  w = glass.offsetWidth / 2;
  h = glass.offsetHeight / 2;
  /*execute a function when someone moves the magnifier glass over the image:*/
  glass.addEventListener("mousemove", moveMagnifier);
  img.addEventListener("mousemove", moveMagnifier);
  /*and also for touch screens:*/
  glass.addEventListener("touchmove", moveMagnifier);
  img.addEventListener("touchmove", moveMagnifier);
  function moveMagnifier(e) {
    var pos, x, y;
    /*prevent any other actions that may occur when moving over the image*/
    e.preventDefault();
    /*get the cursor's x and y positions:*/
    pos = getCursorPos(e);
    x = pos.x;
    y = pos.y;
    /*prevent the magnifier glass from being positioned outside the image:*/
    if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
    if (x < w / zoom) {x = w / zoom;}
    if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
    if (y < h / zoom) {y = h / zoom;}
    /*set the position of the magnifier glass:*/
    glass.style.left = (x - w) + "px";
    glass.style.top = (y - h) + "px";
    /*display what the magnifier glass "sees":*/
    glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
  }
  function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = img.getBoundingClientRect();
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x : x, y : y};
  }
}