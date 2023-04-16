import requests
import json

import config

url = "https://api.openai.com/v1/completions"

payload = json.dumps({
  "model": "text-davinci-003",
  "prompt": "What are your impressions of the Bricky Lab brand?",
  "temperature": 0.9,
  "max_tokens": 100,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0.6,
  "stop": [
    " Human:",
    " AI:"
  ]
})
headers = {
  'model': 'text-davinci-003',
  'Content-Type': 'application/json',
  'Authorization': config.api_key
}
response = requests.request("POST", url, headers=headers, data=payload)

main_response = json.loads(response.text)
print(main_response["choices"][0]["text"])