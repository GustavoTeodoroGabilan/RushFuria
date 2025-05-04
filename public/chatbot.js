async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const chatBox = document.getElementById("chat-box");

  if (!userInput.value.trim()) return;

  userInput.disabled = true;
  sendButton.disabled = true;

  const userMessage = document.createElement("div");
  userMessage.className = "message user";
  userMessage.textContent = userInput.value;
  chatBox.appendChild(userMessage);

  const typingIndicator = document.createElement("div");
  typingIndicator.className = "message ai";
  typingIndicator.textContent = "Digitando...";
  chatBox.appendChild(typingIndicator);

  try {
    const response = await fetch("/send_message", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput.value }),
    });

    console.log(response);
    

    if (!response.ok) {
      throw new Error("Erro na resposta do servidor");
    }

    const data = await response.json();
    console.log(data);
    
    chatBox.removeChild(typingIndicator);

    const aiMessageContainer = document.createElement("div");
    aiMessageContainer.className = "message-container ai";

    const profileImage = document.createElement("img");
    profileImage.className = "profile-image";
    profileImage.src = `/images/Furia_Esports_logo.png`;
    profileImage.alt = "Avatar";

    const aiMessage = document.createElement("div");
    aiMessage.className = "message ai";
    aiMessage.textContent = data.response;

    aiMessageContainer.appendChild(profileImage);
    aiMessageContainer.appendChild(aiMessage);
    chatBox.appendChild(aiMessageContainer);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);

    chatBox.removeChild(typingIndicator);

    const errorMessage = document.createElement("div");
    errorMessage.className = "message ai";
    errorMessage.textContent = "Erro ao se comunicar com o servidor. Tente novamente mais tarde.";
    chatBox.appendChild(errorMessage);
  } finally {
    userInput.disabled = false;
    sendButton.disabled = false;

    userInput.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

document.getElementById("user-input").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage() 
  }
})