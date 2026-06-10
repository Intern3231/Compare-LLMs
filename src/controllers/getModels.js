import { fetchModels } from "../services/llmModels.js";

export default async function getModels(req, res) {
    const data = await fetchModels();
    return res.status(200).json(data);
}
