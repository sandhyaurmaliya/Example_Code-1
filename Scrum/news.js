function latstenews(){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.data-web.be/item/read?project=f5gh8JhjAXBd&entity=news",
        "method": "GET",
        "headers": {}
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response.data.items);
        newsarray = response.data.items
        toon_latstenews(newsarray)
      });
}


function toon_latstenews (news){
    for (let i = 0; i < news.length; i++) {
        console.log(news[i])
        document.getElementById('latste').innerHTML+=
        `
        <div  class="col-lg-4">
            <h3 class="mb-4">${news[i].titel}</h3>
           
            <img src="${news[i].beeld}" class="bd-placeholder-img rounded-circle" width="240" height="350" focusable="false" role="img" style='object-fit: cover;'>
           
            <h5 class="mt-3">${news[i].omshrijving}</h5>
           
            <p>
                ${news[i].tijd}
            </p>
            <button><a href="newsdetail.html?newsid=${news[i].news_id}">Lees meer</a></button>
            
        </div>
        `
    }

}

function get_chosen_news(){
  const urlParameter = new URLSearchParams(window.location.search);
  console.log(window.location)
  const gekozen_id = urlParameter.get('newsid');
  console.log(gekozen_id)

  $.ajax({
    url: "https://api.data-web.be/item/single_read",
    data: {
        "project": "f5gh8JhjAXBd", 
        "entity": "news",
        "id": gekozen_id
    }
    }).done(function (response) {
      console.log(response);
      gekozenarray = response.data.item
      show_gekozennews(gekozenarray)
      
    }).fail(function(response){
        console.log(response)
    })
  

}

function show_gekozennews(item){

 

        document.getElementById('gekozen_news').innerHTML+=
        `
        <div class="col-xs-1" stlye='text-align: center;'>
            <h1>${item.titel}</h1>
           
            <img src="${item.beeld}" class="bd-placeholder-img rounded-circle" width="500" height="500" focusable="false" role="img" style='object-fit: cover;'>
           
           
            <p> ${item.news_bigger}
            <p>
                ${item.tijd}
            </p>
          </div>
            
      
        `
    }

