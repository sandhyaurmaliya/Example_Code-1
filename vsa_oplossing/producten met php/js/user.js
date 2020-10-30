function setSiteToken(token, callback) {
    sessionStorage.setItem("token", token);

    data = {"token": token};
    doAjaxRequest(site + "/token.php", "POST", data, "",function(response) {
        if (typeof callback !== "undefined") {
            callback();
        }
    });
}

function login() {

    data = {"email": $("#defaultLoginFormEmail").val(),
            "password": $("#defaultLoginFormPassword").val() }
    doAjaxRequest(api + "/user/login?project=LluG3gwZKPzC", "POST", data, "",function(response) {

        setSiteToken(response.status.token, function() {
            console.log("end login");
            document.location = "producten.php";
        });
    });

}

function logout() {

    doAjaxRequest(api + "/user/logout", "GET", {"project": "LluG3gwZKPzC"}, sessionStorage.getItem("token"),function(response) {

        document.location = "login.php";

    });

}