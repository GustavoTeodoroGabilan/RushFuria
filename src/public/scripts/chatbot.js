async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const chatBox = document.getElementById("chat-box");

  if (!userInput.value.trim()) return;

  // Desabilita o campo de entrada e o botão de envio
  userInput.disabled = true;
  sendButton.disabled = true;

  // Adiciona a mensagem do usuário na interface
  const userMessage = document.createElement("div");
  userMessage.className = "message user";
  userMessage.textContent = userInput.value;
  chatBox.appendChild(userMessage);

  // Adiciona o balão de digitação da IA
  const typingIndicator = document.createElement("div");
  typingIndicator.className = "message ai";
  typingIndicator.textContent = "Digitando...";
  chatBox.appendChild(typingIndicator);

  // Faz a requisição para o backend
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
    
    // Remove o balão de digitação
    chatBox.removeChild(typingIndicator);

    // Adiciona a resposta da IA na interface
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

    // Remove o balão de digitação
    chatBox.removeChild(typingIndicator);

    // Exibe uma mensagem de erro na interface
    const errorMessage = document.createElement("div");
    errorMessage.className = "message ai";
    errorMessage.textContent = "Erro ao se comunicar com o servidor. Tente novamente mais tarde.";
    chatBox.appendChild(errorMessage);
  } finally {
    // Reabilita o campo de entrada e o botão de envio
    userInput.disabled = false;
    sendButton.disabled = false;

    // Limpa o campo de entrada
    userInput.value = "";

    // Rola para o final da caixa de chat
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}