app.post('/chat', async (req, res) => {
    const { message } = req.body;
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(message);
    res.json({ reply: result.response.text() });
});