import { MongoClient } from "mongodb";

let client;
let db;

export async function connectMongo() {
    if (db) {
        return db;
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME);

    return db;
}

export async function getResponsesCollection() {
    const database = await connectMongo();
    return database.collection(process.env.MONGODB_COLLECTION || "model_comparisons");
}
