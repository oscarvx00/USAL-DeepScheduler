package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"os"
	"os/exec"
	"strings"

	"github.com/streadway/amqp"
)

type LocationNode struct {
	Location string `json:"location"`
	NodeURL  string `json:"nodeURL"`
}

type RabbitMessage struct {
	Operation string       `json:"operation"`
	Location  LocationNode `json:"location"`
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

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func main() {

	RABBIT_HOST := os.Getenv("RABBIT_HOST")
	fmt.Println(RABBIT_HOST)

	_, err := net.Dial("tcp", "golang.org:80")
	failOnError(err, "DIAL")

	//RabbitMQ connection
	conn, err := amqp.Dial(RABBIT_HOST)
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failer to open a channel")
	defer ch.Close()

	//Declare proxy exchange
	err = ch.ExchangeDeclare(
		"proxy_exchange", //name
		"fanout",         //type
		true,             //durable
		false,            //auto-deleted
		false,            //internal
		false,            //no-wait
		nil,              //args
	)
	failOnError(err, "Failer to declare proxy_exchange")

	//Declare proxy queue
	q, err := ch.QueueDeclare(
		"proxy_queue", //name
		true,          //durable
		false,         //delete when unused
		true,          //exclusive
		false,         //no-wait
		nil,           //args
	)
	failOnError(err, "Failed to declare proxy_queue")

	//Bind queue to exhange
	err = ch.QueueBind(
		q.Name, //queue name
		"",     //routing key
		"proxy_exchange",
		false,
		nil,
	)
	failOnError(err, "Failed to bind proxy_queue to proxy_exchange")

	msgs, err := ch.Consume(
		q.Name, //queue name
		"",     //consumer
		true,   //auto-ack
		false,  //exclusive
		false,  //no-local
		false,  //no-wait
		nil,    //args
	)
	failOnError(err, "Failed to register consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			var content RabbitMessage
			json.Unmarshal([]byte(d.Body), &content)
			fmt.Println(content)
			needToReload := manageMessage(content)
			if needToReload {
				buildNginxConf()
				moveConfAndReloadService()
			}
		}
	}()

	fmt.Println(" [*] Waiting for mesages")
	<-forever

}

func manageMessage(rMessage RabbitMessage) bool {

	locations := readLocationsDatabase()
	needToUpdate := false

	if rMessage.Operation == "ADD" {
		found := false
		for _, item := range locations {
			if rMessage.Location.Location == item.Location {
				found = true
				break
			}
		}
		if !found {
			locations = append(locations, rMessage.Location)
			needToUpdate = true
		}
	} else if rMessage.Operation == "DEL" {
		mIndex := -1
		for index, item := range locations {
			if rMessage.Location.Location == item.Location {
				mIndex = index
				break
			}
		}
		if mIndex > -1 {
			locations = append(locations[:mIndex], locations[mIndex+1:]...)
			needToUpdate = true
		}
	}

	if needToUpdate {
		writeLocationsDatabase(locations)
	}

	return needToUpdate
}

func readLocationsDatabase() []LocationNode {
	jsonFile, err := os.Open("locations.json")
	if err != nil {
		fmt.Println(err)
	}

	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	locations := []LocationNode{}
	json.Unmarshal([]byte(byteValue), &locations)
	return locations
}

func writeLocationsDatabase(locations []LocationNode) {
	file, _ := json.MarshalIndent(locations, "", " ")
	_ = ioutil.WriteFile("locations.json", file, 0644)
}

func buildNginxConf() {
	locations := readLocationsDatabase()

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
		innerSb.WriteString("\t\t}\n")
		sb.WriteString(innerSb.String())
	}
	sb.WriteString(confEnd)

	f, err := os.Create("nginx.conf")
	if err != nil {
		fmt.Println(err)
	}

	f.WriteString(sb.String())
}

func moveConfAndReloadService() {

	cmd := exec.Command("mv", "nginx.conf", "/etc/nginx/")
	_, err := cmd.Output()
	failOnError(err, "Error moving nginx.conf")

	cmd = exec.Command("service", "nginx", "reload")
	_, err = cmd.Output()
	failOnError(err, "Error reloading nginx")
}
