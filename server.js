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
  const message = req.body?.message;

  if (!API_KEY) {
    return res.status(500).json({
      error: "Gemini API key is not configured."
    });
  }

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Please provide a message."
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash"
    });

    let result;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        result = await model.generateContent(message);
        break;
      } catch (error) {
        const errorMessage = error.message || "";

        console.error(
          `Gemini attempt ${attempt} failed:`,
          errorMessage
        );

        const temporaryError =
          /503|429|500|502|504|overloaded|high demand|temporarily unavailable/i
            .test(errorMessage);

        if (attempt === 1 && temporaryError) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        throw error;
      }
    }

    if (!result) {
      throw new Error("Gemini did not return a response.");
    }

    const response = await result.response;
    const reply = response.text();

    return res.json({ reply });

  } catch (error) {
    console.error("Gemini request failed:", error.message);

    const message = error.message || "";

    if (/429|quota|rate.?limit/i.test(message)) {
      return res.status(429).json({
        error: "AI request limit reached. Please try again later."
      });
    }

    if (/503|overloaded|high demand|temporarily unavailable/i.test(message)) {
      return res.status(503).json({
        error: "AI server is busy. Please try again shortly."
      });
    }

    return res.status(502).json({
      error: "AI could not respond. Please try again."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ApuGPT backend running on port ${PORT}`);
});
