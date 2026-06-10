export default function validateCompareRequest(req, res, next) {
    const { prompt } = req.body;

    if (typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({
            message: "prompt is required"
        });
    }

    req.body.prompt = prompt.trim();

    next();
}
