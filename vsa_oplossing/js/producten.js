var categorien = [
        {"id": 1, naam: "categorie 1"},
        {"id": 2, naam: "categorie 2"}
    ];

var producten = [
        {"id": 1, "categorie_id": 1, "naam": "Product 1", "omschrijving": "omschrijving 1", "prijs": 101, "beeld": "http://api.data-web.be/files/LluG3gwZKPzC/product/Schermafbeelding%202020-06-29%20om%2016.30.23.png"},
        {"id": 2, "categorie_id": 1, "naam": "Product 2", "omschrijving": "omschrijving 2", "prijs": 102, "beeld": "http://api.data-web.be/files/LluG3gwZKPzC/product/Schermafbeelding%202020-06-29%20om%2016.30.23.png"},
        {"id": 3, "categorie_id": 2, "naam": "Product 3", "omschrijving": "omschrijving 3", "prijs": 103, "beeld": "http://api.data-web.be/files/LluG3gwZKPzC/product/Schermafbeelding%202020-06-29%20om%2016.30.23.png"},
        {"id": 4, "categorie_id": 2, "naam": "Product 4", "omschrijving": "omschrijving 4", "prijs": 104, "beeld": "http://api.data-web.be/files/LluG3gwZKPzC/product/Schermafbeelding%202020-06-29%20om%2016.30.23.png"}
    ];

var filter = {"naam": "", "omschrijving": "", "prijs": 0};
var huidig_product;
var product_actie;

function matchFilter(product) {
    if (product.naam.indexOf(filter.naam) == -1 ||
    product.omschrijving.indexOf(filter.omschrijving) == -1 ||
    product.prijs < filter.prijs) {
        return false;
    }

    return true;
}

function haalCategorieOp(id) {
    var categorie;
    categorien.forEach(function(cat) {
        if (cat.id == id) {
            categorie = cat;
        }
    });

    return categorie;
}

function haalHuidigProductOp(id) {
    producten.forEach(function(product) {
        if (product.id == id) {
            huidig_product = product;
        }
    });
}

function toonProductenTabel() {
    $("#producten_table tbody").html("");
    producten.forEach(function(product) {
        if (product.id != null && matchFilter(product)) {
            var categorie = haalCategorieOp(product.categorie_id);
            var image = "";
            if (product.beeld != null) {
                image = '<img src="' +  product.beeld + '" />';
            }
            var row = "<tr>" +
                "<td>" + product.naam + "</td>" +
                "<td>";
                if (categorie !== undefined) {
                    row += categorie.naam;
                }
                row += "</td>";
                row += "<td>" + product.omschrijving + "</td>" +
                "<td>&euro; " + product.prijs + "</td>" +
                "<td>" + image + "</td>" +
                "<td>" +
                "<button class=\"btn btn-sm btn-primary\" onclick=\"toonPopup('delete', " + product.id + ");\"  data-toggle=\"modal\" data-target=\"#delete_modal\">verwijderen</button>" +

                "<button class=\"btn btn-sm btn-primary\" onclick=\"toonPopup('update', " + product.id + ")\" data-toggle=\"modal\" data-target=\"#product_modal\">bewerken</button>" +
                "</td>" +
                "</tr>";

            $("#producten_table").append(row);
        }
    });
    
}

function doSort() {
    sort = [{"field": $("#sort_select").val(), "direction": "ASC"}];
    toonProductenTabel();
}

function doFilter() {
    filter.naam = $("#filter_naam").val();
    filter.omschrijving = $("#filter_omschrijving").val();
    filter.prijs = $("#filter_prijs").val();

    toonProductenTabel();
}

function doeProductActie() {
    if (product_actie == "delete") {
        huidig_product.id = null;
        $('#delete_modal').modal('hide');      
    }
 
    if (product_actie == "update") {
        huidig_product.naam = $("#product_naam").val();
        huidig_product.omschrijving = $("#product_omschrijving").val();
        huidig_product.prijs = $("#product_prijs").val();
        huidig_product.categorie_id = $("#product_categorie").val();
        $('#product_modal').modal('hide');      
    }

    if (product_actie == "insert") {
        id = producten.length + 1;
        producten.push(
            {"id": id, "categorie_id": $("#product_categorie").val(), 
            "naam": $("#product_naam").val(), 
            "omschrijving": $("#product_omschrijving").val(), 
            "prijs": $("#product_prijs").val()
        })
        $('#product_modal').modal('hide');      
    }

    
    toonProductenTabel();  
    
}


function toonPopup(actie, id) { 
    product_actie = actie;

    if (actie == "update" || actie == "delete") { 
        haalHuidigProductOp(id);
    }

    if (actie == "update" || actie == "insert") { 
        vulCategorieSelect();
    }

    if (actie == "insert") {
        $("#product_modal_titel").html("Product toeveogen");        
        $('#product_naam').val("");
        $('#product_omschrijving').val("");
        $('#product_prijs').val("");
        $('#product_categorie').val("");
    }

    if (actie == "update") {
        $("#product_modal_titel").html("Product wijzigen");
        $('#product_naam').val(huidig_product.naam);
        $('#product_omschrijving').val(huidig_product.omschrijving);
        $('#product_prijs').val(huidig_product.prijs);        
        $('#product_categorie').val(huidig_product.categorie_id);        
    }

    
}

function vulCategorieSelect() {
    $("#product_categorie").html("<option></option>");
    categorien.forEach(function(categorie) {
        $("#product_categorie").append("<option value='" + categorie.id + "'>" + categorie.naam + "</option>");
    });
}

function start() {
    toonProductenTabel();

}