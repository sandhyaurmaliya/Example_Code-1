var filter = [];
//var property = [{"entity": "product", "field": "*"}];
var property = [];
var sort = [{"field": $("#sort_select").val(), "direction": "ASC"}];
var relation = [];
var producten = [];
var paging = {"page": 2, "items_per_page": 10};
//var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE1OTk3NTY0NzYsImlzcyI6IkxsdUczZ3daS1B6QyIsImlhdCI6MTU5OTcyMDQ3Nn0.tBVfPYWrvbCOQLgfSijiiflci8YwDY1Ol3TjWQigkVM";

function toonProducten() {
    var data = {"filter": filter, "property": property, "sort": sort, "relation": relation};
    doAjaxRequest(api +"/item/read?project=LluG3gwZKPzC&entity=product", "GET", data, sessionStorage.getItem("token"),function(response) {
        producten = response.data.items;
        $("#producten_table tbody").html("");
        producten.forEach(function(product) {
            var image = "";
            if (product.image != null) {
                image = '<img src="' +  response.data.assets_path + "/" +  product.image.name + '" />';
            }
            var row = "<tr>" +
                "<td>" + product.naam + "</td>" +
                "<td>Product categorie 1</td>" +
                "<td>" + product.omschrijving + "</td>" +
                "<td>&euro; " + product.prijs + "</td>" +
                "<td>" + image + "</td>" +
                "<td>" +
                "<button class=\"btn btn-sm btn-primary\" onclick=\"$('#delete_id').val(" + product.id + ");\"  data-toggle=\"modal\" data-target=\"#delete_modal\">verwijderen</button>" +

                "<button class=\"btn btn-sm btn-primary\" onclick=\"toonProductPopup('update', '" + product.id + "')\" data-toggle=\"modal\" data-target=\"#product_modal\">bewerken</button>" +
                "</td>" +
                "</tr>";

            $("#producten_table").append(row);
        });

        setSiteToken(response.status.token);
    });

}

function doSort() {
    sort = [{"field": $("#sort_select").val(), "direction": "ASC"}];
    toonProducten();
}

function doFilter() {
    filter = [];
    if ($("#filter_naam").val() != "") {
        filter.push({"field":"naam","operator":"LIKE", "value": "%" + $("#filter_naam").val() + "%"});
    }

    if ($("#filter_omschrijving").val() != "") {
        filter.push({"field":"omschrijving","operator":"LIKE", "value": "%" + $("#filter_omschrijving").val() + "%"});
    }

    if ($("#filter_prijs").val() != "") {
        filter.push({"field":"prijs","operator":">=", "value": $("#filter_prijs").val()});
    }

    toonProducten();
}

function doDelete() {
    var id = $('#delete_id').val();
    var data = {"filter": [{"field": "id", "operator": "=", "value": id}]};
    doAjaxRequest(api + "/item/delete?project=LluG3gwZKPzC&entity=product", "DELETE", data, sessionStorage.getItem("token"),function(response) {
        toonProducten();
        $('#delete_modal').modal('hide');

        setSiteToken(response.status.token);
    });
}

function doProductActie() {
    var product_actie = $("#product_actie").val();

    var formData = new FormData();

    var post_values = {
        "naam": $("#product_naam").val(),
        "omschrijving": $("#product_omschrijving").val(),
        "prijs": $("#product_prijs").val(),
        "image": $("#product_beeld_origineel").val()};
    formData.set("values", JSON.stringify(post_values));

    var post_image = $('#product_beeld')[0].files[0];
    formData.set("image", post_image);

    if (product_actie == "update") {
        var post_filter = ["id", "=", $("#product_id").val()];
        formData.set("filter", JSON.stringify(post_filter));

        var endpoint = api + "/item/update?project=LluG3gwZKPzC&entity=product";
        var method = "PUT";
    }

    if (product_actie == "insert") {
        var endpoint = api + "/item/create?project=LluG3gwZKPzC&entity=product";
        var method = "POST";
    }

    console.log(post_values);
    doAjaxRequest(endpoint, method, formData, sessionStorage.getItem("token"),function(response) {
        toonProducten();
        $('#product_modal').modal('hide');
        setSiteToken(response.status.token);
    });
}



function toonProductPopup(actie, id) {
    $("#product_actie").val(actie);

    if (actie == "insert") {
        $("#product_modal_titel").html("Product toeveogen");
        $('#product_id').val("");
        $('#product_naam').val("");
        $('#product_omschrijving').val("");
        $('#product_prijs').val("");
        $('#product_beeld_origineel').val("");
    }

    if (actie == "update") {
        $("#product_modal_titel").html("Product wijzigen");
        doAjaxRequest(api + "/item/single_read?project=LluG3gwZKPzC&entity=product&id=" + id, "GET", null, sessionStorage.getItem("token"),function(response) {
            $('#product_id').val(response.data.item.id);
            $('#product_naam').val(response.data.item.naam);
            $('#product_omschrijving').val(response.data.item.omschrijving);
            $('#product_prijs').val(response.data.item.prijs);
            $('#product_beeld_origineel').val(JSON.stringify(response.data.item.image));
            $('#product_beeld').val("");
            $('#product_beeld_label').html("Kies (nieuw) beeld");

            setSiteToken(response.status.token);
        });
    }
}

function start() {

   toonProducten();

}