function setSiteToken(token, callback) {
    sessionStorage.setItem("token", token);
    callback();
}

function login() {

    data = {"email": $("#defaultLoginFormEmail").val(),
            "password": $("#defaultLoginFormPassword").val() }
    doAjaxRequest(api + "/user/login?project=LluG3gwZKPzC", "POST", data, "",function(response) {

        setSiteToken(response.status.token, function() {
            console.log("end login");
            document.location = "producten.html";
        });
    });

}

function logout() {

    doAjaxRequest(api + "/user/logout", "GET", {"project": "LluG3gwZKPzC"}, sessionStorage.getItem("token"),function(response) {

        document.location = "login.php";

    });

}