const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
res.send("ApuGPT AI Backend is running!");
});

app.get("/health", (req, res) => {
res.json({
status: "ok",
service: "ApuGPT Backend"
});
});

app.post("/chat", async (req, res) => {
try {
if (!API_KEY) {
return res.status(500).json({
error: "Gemini API key is not configured."
});
}

const message = req.body?.message;

if (typeof message !== "string" || !message.trim()) {
  return res.status(400).json({
    error: "Please provide a message."
  });
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.8-flash"
});

const result = await model.generateContent(message);
const response = await result.response;

return res.json({
  reply: response.text()
});

} catch (error) {
console.error("Gemini request failed:", error.message);

return res.status(500).json({
  error: "AI could not respond. Please try again."
});

}
});

app.listen(PORT, "0.0.0.0", () => {
console.log("ApuGPT backend running on port ${PORT}");
});
