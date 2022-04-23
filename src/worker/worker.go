package main

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

var mongoClient *mongo.Client = initMongo()

func main() {

	defer func() {
		if err := mongoClient.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	getUser("oscarv201008@gmail.com")

}
