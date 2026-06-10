const DEFAULT_URL = "https://int.sapientaiproducts.com/api/v1/llm/models";

function buildHeaders() {
    const authToken = process.env.LLM_AUTH_TOKEN;
    const appToken = process.env.LLM_APP_AUTH_TOKEN;

    if (!authToken) {
        throw new Error("LLM_AUTH_TOKEN is missing");
    }

    if (!appToken) {
        throw new Error("LLM_APP_AUTH_TOKEN is missing");
    }

    return {
        accept: "application/json",
        Authorization: `Bearer ${authToken}`,
        "X-App-Authorization": `Bearer ${appToken}`
    };
}

export async function fetchModels() {
    const url = process.env.LLM_MODELS_URL || DEFAULT_URL;
    const response = await fetch(url, {
        method: "GET",
        headers: buildHeaders()
    });

    const rawText = await response.text();
    let data = null;

    if (rawText) {
        try {
            data = JSON.parse(rawText);
        } catch {
            data = { rawText };
        }
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.error?.message ||
            data?.error ||
            rawText ||
            `HTTP ${response.status}`;

        throw new Error(`Model list request failed: ${message}`);
    }

    return data ?? {};
}
