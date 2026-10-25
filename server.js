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

let result;
let lastError;

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    result = await model.generateContent(message);
    break;
  } catch (error) {
    lastError = error;

    console.error(
      `Gemini attempt ${attempt} failed:`,
      error.message
    );

    if (attempt < 3) {
      await new Promise(resolve =>
        setTimeout(resolve, attempt * 2000)
      );
    }
  }
}

if (!result) {
  throw lastError;
}

const response = await result.response;

return res.json({
  reply: response.text()
});

} catch (error) {
console.error("Gemini request failed:", error.message);

return res.status(502).json({
  error: error.message || "AI request failed."
});

}
});

app.listen(PORT, "0.0.0.0", () => {
console.log("ApuGPT backend running on port ${PORT}");
});
