const { GoogleGenerativeAI } = require('@google/generative-ai');

const ai = new GoogleGenerativeAI({ apiKey: "AIzaSyCZK4l6BbmPi-oMz4X_Nq8e9P6Zpj1yO2o" });

async function sendMessage() {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // ou "gemini-pro"
  
  const result = await model.generateContent("How does AI work?");
  const response = await result.response;
  console.log("Resposta:", response.text());
}

sendMessage();