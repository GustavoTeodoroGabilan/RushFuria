const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Sua chave da API aqui
const API_KEY = 'AIzaSyCZK4l6BbmPi-oMz4X_Nq8e9P6Zpj1yO2o';

// Inicializa o cliente
const genAI = new GoogleGenerativeAI(API_KEY);

async function runChat() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const chat = model.startChat({
    history: [],
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    },
  });

  const prompt = "Oi, quero aprender sobre HTML!";
  const result = await chat.sendMessage(prompt);
  const response = result.response;
  console.log("Bot:", response.text());
}

runChat();

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Configuração da chave de API
// const API_KEY = process.env.API_KEY;
// if (!API_KEY) {
//   console.error("A chave de API não foi configurada no arquivo .env");
//   process.exit(1);
// }

// // Caminho para as imagens
// const IMAGE_FOLDER = path.join(__dirname, "images");

// // Middleware
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));

// // Configuração do LangChain com o modelo Gemini
// const llm = new ChatGoogleGenerativeAI({
//   model: "gemini-1.5-pro", // Modelo Gemini
//   temperature: 0,
//   maxRetries: 2,
//   apiKey: API_KEY, // Passa a chave de API diretamente
// });

// // Rota principal para servir o frontend
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.post("/send_message", async (req, res) => {
//     const userMessage = req.body.message;
  
//     if (!userMessage) {
//       return res.status(400).json({ error: "Mensagem vazia" });
//     }
  
//     try {
//       // Configura o prompt para o LangChain
//       const aiMsg = await llm.invoke([
//         [
//           "system",
//           `Você é um assistente útil que responde em português brasileiro. 
//           Seu nome é Luiz e voce é uma assistente virtual da empresa Sec4You, uma empresa de segurança digital.
//           Você é amigável e educado.
//           Você também pode ajudar com perguntas gerais sobre tecnologia e ciência.
//           Analise o tom emocional da mensagem do usuário e inclua o tom no formato [TOM: feliz, bravo, triste, explicando, neutro].
//           Depois, responda de forma clara e objetiva.`,
//         ],
//         ["human", userMessage],
//       ]);
  
//       const aiResponse = aiMsg.content || "Desculpe, não consegui gerar uma resposta.";
  
//       // Detecta perguntas ou solicitações de explicação no texto do usuário
//       let mood = "neutro"; // Tom padrão
//       if (userMessage.trim().endsWith("?") || /explique|como|por que|o que|qual/i.test(userMessage)) {
//         mood = "explicando";
//       } else {
//         // Extrai o tom da resposta gerada pela IA
//         const moodMatch = aiResponse.match(/\[TOM:\s*(feliz|bravo|triste|explicando|neutro)\]/i);
//         mood = moodMatch ? moodMatch[1].toLowerCase() : "neutro";
//       }
  
//       // Remove o marcador de tom da resposta antes de enviá-la ao frontend
//       const cleanResponse = aiResponse.replace(/\[TOM:\s*(feliz|bravo|triste|explicando|neutro)\]/i, "").trim();
  
//       res.json({ response: cleanResponse, mood });
//     } catch (error) {
//       console.error("Erro ao se comunicar com a API do Gemini:", error.message || error);
//       res.status(500).json({ error: "Erro ao se comunicar com a API do Gemini." });
//     }
//   });
// // Rota para servir imagens
// app.use("/images", express.static(IMAGE_FOLDER));

// // Inicia o servidor
// app.listen(PORT, () => {
//   console.log(`Servidor rodando em http://localhost:${PORT}`);
// });