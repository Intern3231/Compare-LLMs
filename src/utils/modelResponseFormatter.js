export default function modelResponseFormatter(model, response, error = null) {
    const result = {
        model,
        response
    };

    if (error) {
        result.error = error;
    }

    return result;
}