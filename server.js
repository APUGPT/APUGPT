const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
res.send("ApuGPT AI Backend is running!");
});

app.post("/chat", async (req, res) => {
try {
if (!API_KEY) {
return res.status(500).json({
error: "Gemini API key is not configured."
});
}

const message = req.body.message;

if (!message || typeof message !== "string") {
  return res.status(400).json({
    error: "Please provide a message."
  });
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

const result = await model.generateContent(message);
const response = await result.response;

res.json({
  reply: response.text()
});

} catch (error) {
console.error("Gemini request failed:", error.message);
res.status(500).json({
error: "AI could not respond. Please try again."
});
}
});

app.listen(PORT, "0.0.0.0", () => {
console.log("ApuGPT backend running on port ${PORT}");
});
