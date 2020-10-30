const api = "https://api.data-web.be";
const site = "http://vdab.data-web.be/test";

function doAjaxRequest(endpoint, method, data, token, done_callback) {

    var ajax_parameters = {
        url: endpoint,
        type: method,
        data: data
    //    contentType: false,
    };

    if (token != "") {
        ajax_parameters.headers = {"Authorization": "Bearer " + token};
    }

    if ( method == "PUT") {
        ajax_parameters.contentType = false;
        ajax_parameters.processData = false;
    }

    console.log(ajax_parameters);

    $.ajax(ajax_parameters).done(function(response) {
        console.log("DONE")
        console.log(response);
        return done_callback(response);
    }).fail(function (msg) {
        console.log(msg.responseText);
        console.log('FAIL');
    }).always(function (msg) {
        console.log('ALWAYS');
    });
}