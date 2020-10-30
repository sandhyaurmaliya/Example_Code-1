<?php
session_start();
if (isset($_POST["token"])) {
  $_SESSION["token"] = $_POST["token"];
}

function valid_token($project, $entity)
{
  if ($project != "" && $entity != "" && isset($_SESSION["token"]) && $_SESSION["token"] != "") {
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://api.data-web.be/user/validate_token?project=" . $project . "&entity=" . $entity,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "authorization: Bearer " . $_SESSION["token"]
      ),
    ));

    $response = json_decode(curl_exec($curl), true);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err || $response["status"]["success"] == 0) {
      $res = false;
    } else {
      $res = true;
    }
  }
  else {
    $res = false;
  }

  if ($res == false) {
    $_SESSION["token"] = "";
  }

  return $res;
}
?>