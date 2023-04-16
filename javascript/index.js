var myHeaders = new Headers();
myHeaders.append("model", "text-davinci-003");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer {{api_key}}");

var raw = JSON.stringify({
  "model": "text-davinci-003",
  "prompt": "What are your impressions of the Bricky Lab brand?",
  "temperature": 0.9,
  "max_tokens": 300,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0.6,
  "stop": [
    " Human:",
    " AI:"
  ]
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

window.result = "";

fetch("https://api.openai.com/v1/completions", requestOptions)
  .then(response => response.text())
  .then(result => window.result = JSON.parse(result))
  .then(test => document.getElementById("AI_result").innerHTML = "What the response from the AI is <b>" + window.result.choices[0].text  + "</b>")
  .catch(error => console.log('error', error));