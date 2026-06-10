import responseStore from "../store/responseStore.js";
import { sendChatCompletion } from "../services/llmChatCompletion.js";

function getModelMap() {
    return {
        openai: process.env.OPENAI_MODEL,
        anthropic: process.env.ANTHROPIC_MODEL,
        gemini: process.env.GEMINI_MODEL
    };
}

export default async function compareModels(req, res) {
    const { prompt } = req.body;
    const modelMap = getModelMap();
    const models = Object.entries(modelMap)
        .filter(([, upstreamModel]) => Boolean(upstreamModel))
        .map(([model]) => model);

    if (!models.length) {
        return res.status(500).json({
            message: "No comparison models configured in .env"
        });
    }

    const tasks = models.map(async (model) => {
        const upstreamModel = modelMap[model];

        try {
            const response = await sendChatCompletion({
                model: upstreamModel,
                prompt
            });

            return {
                model,
                response
            };
        } catch (error) {
            return {
                model,
                response: null,
                error: error.message || "Failed to generate response"
            };
        }
    });

    const results = await Promise.all(tasks);

    const record = await responseStore.save(prompt, results);

    return res.status(200).json({
        id: record.id,
        time: record.time,
        prompt: record.prompt,
        responses: record.responses
    });
}
