package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"
)

type LocationNode struct {
	Location string `json:"location"`
	NodeURL  string `json:"nodeURL"`
}

const confInit = `worker_processes 1;
events {
	worker_connections 1024;
}
http {
	sendfile on;
	server {
		listen 8889;
`

const confEnd = `
	}
}`

func main() {
	jsonFile, err := os.Open("locations.json")
	if err != nil {
		fmt.Println(err)
	}

	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	locations := []LocationNode{}
	json.Unmarshal([]byte(byteValue), &locations)

	var sb strings.Builder
	sb.WriteString(confInit)
	for _, item := range locations {
		var innerSb strings.Builder
		innerSb.WriteString("\t\tlocation /")
		innerSb.WriteString(item.Location)
		innerSb.WriteString("/ {\n")
		innerSb.WriteString("\t\t\tproxy_pass\t\t")
		innerSb.WriteString(item.NodeURL)
		innerSb.WriteString(";\n")
		innerSb.WriteString("\t\t}")
		sb.WriteString(innerSb.String())
	}
	sb.WriteString(confEnd)

	f, err := os.Create("nginx.conf")
	if err != nil {
		fmt.Println(err)
	}

	f.WriteString(sb.String())

	cmd := exec.Command("mv", "nginx.conf", "testMv/")
	stdout, err := cmd.Output()
	fmt.Print(string(stdout))
}
