<?php
require("config.php");

ini_set('display_errors', 1);
ini_set('error_reporting', E_ALL);
$curl = curl_init();

$model = array(
    "model" => "text-davinci-003", //Model type
    "prompt" => "What are your impressions of the Bricky Lab brand?",
    "temperature" => 0.9,
    "max_tokens" => 150, //Character limit of the response
    "top_p" => 1,
    "frequency_penalty" => 0,
    "presence_penalty" => 0.6,
    "stop" => array(
        " Human:",
        " AI:"
    ),
);

$headers = array(
    $api_key, //coming from config file
    'Content-Type: application/json',
    'model: text-davinci-003'
  );

curl_setopt($curl, CURLOPT_URL,"https://api.openai.com/v1/completions");
curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($curl, CURLOPT_TIMEOUT, 10);
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($model));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$response = json_decode(curl_exec($curl));
echo $response->choices[0]->text;

curl_close($curl);
?>