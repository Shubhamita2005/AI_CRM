require("dotenv").config();

const { generateRecommendations } = require("./src/services/ai_service");

(async () => {
    try {

        console.log("Starting AI recommendation generation...\n");

        await generateRecommendations();

        console.log("\nAll recommendations generated successfully!");

    } catch (error) {

        console.error(error);

    }

})();