package main

import (
	"context"
	"encoding/json"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

const mongoUrl = "mongodb://localhost:30002"

func initMongo() *mongo.Client {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoUrl))
	if err != nil {
		panic(err)
	}

	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}

	fmt.Println("Mongo connection completed")

	return client
}

func getUser(mail string) {

	if err := mongoClient.Ping(context.TODO(), readpref.Primary()); err != nil {
		panic(err)
	}

	coll := mongoClient.Database("ds").Collection("users")

	var result bson.M
	coll.FindOne(context.TODO(), bson.D{{"mail", mail}}).Decode(&result)

	output, err := json.MarshalIndent(result, "", "    ")
	if err != nil {
		panic(err)
	}

	fmt.Printf("%s\n", output)
}
