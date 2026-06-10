import { randomUUID } from "crypto";
import { getResponsesCollection } from "../config/mongo.js";

function normalizeResponses(results) {
    return results.reduce((acc, item) => {
        acc[item.model] = {
            response: item.response ?? null,
            error: item.error ?? null
        };
        return acc;
    }, {});
}

async function save(prompt, results) {
    const id = randomUUID();
    const time = new Date().toISOString();
    const document = {
        id,
        time,
        prompt,
        responses: normalizeResponses(results)
    };

    const collection = await getResponsesCollection();
    await collection.insertOne(document);

    return document;
}

export default {
    save
};
