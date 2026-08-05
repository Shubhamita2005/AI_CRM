require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
    try {
        const models = await client.models.list();

        for await (const model of models) {
            console.log(model.name);
        }
    } catch (err) {
        console.error(err);
    }
})();