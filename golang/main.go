package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

type AIResult struct {
	Id      int64
	Choices json.RawMessage
}

func main() {

	url := "https://api.openai.com/v1/completions"
	method := "POST"

	payload := strings.NewReader(`{
		"model": "text-davinci-003",
		"prompt": "What are your impressions of the Bricky Lab brand?",
		"temperature": 0.9,
		"max_tokens": 10,
		"top_p": 1,
		"frequency_penalty": 0,
		"presence_penalty": 0.6,
		"stop": [" Human:", " AI:"]
		}`)

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		fmt.Println(err)
		return
	}
	req.Header.Add("model", "text-davinci-003")
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", api_key)

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}

	//fmt.Println(string(body)) //whole result

	var result = []byte(body)
	var mapResult AIResult

	json.Unmarshal(result, &mapResult)

	fmt.Println(string(mapResult.Choices))
}
