const DEFAULT_URL =
    "https://int.sapientaiproducts.com/api/v1/llm/chat/completions";

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
        "X-App-Authorization": `Bearer ${appToken}`,
        "Content-Type": "application/json"
    };
}

function extractResponseText(data) {
    return (
        data?.choices?.[0]?.message?.content ??
        data?.choices?.[0]?.message?.text ??
        data?.choices?.[0]?.text ??
        data?.response?.content ??
        data?.response?.text ??
        data?.rawText ??
        ""
    )
        .toString()
        .trim();
}

export async function sendChatCompletion({ model, prompt }) {
    if (!model) {
        throw new Error("Model missing");
    }

    const url = process.env.LLM_CHAT_COMPLETIONS_URL || DEFAULT_URL;
    const response = await fetch(url, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model
        })
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

        throw new Error(`LLM request failed: ${message}`);
    }

    const output = extractResponseText(data);

    if (!output) {
        throw new Error("Empty response from LLM endpoint");
    }

    return output;
}
