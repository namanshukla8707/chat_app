import React, { useState, useEffect } from "react";
import {
  AppBar,
    Toolbar,
    Typography,
    Container,
    Paper,
    TextField,
    Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  // Simulated received messages (replace with actual messages from your server)
  const simulatedMessages = [
    { id: 1, text: "Hello, how are you?", sender: "user1" },
    { id: 2, text: "I'm good, thanks!", sender: "user2" },
  ];

  useEffect(() => {
    // Simulate receiving new messages
    setTimeout(() => {
      const newMessage = {
        id: simulatedMessages.length + 1,
        text: "New message!",
        sender: "user1",
      };
      setMessages([...messages, newMessage]);
    }, 3000000);
  }, [messages,simulatedMessages.length]);

  const handleSendMessage = () => {
    if (messageText.trim() !== "") {
      const newMessage = {
        id: messages.length + 1,
        text: messageText,
        sender: "user1",
      }; // Replace 'user1' with the sender's name
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Chat App</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: "20px", margin: "20px 0" }}>
      <div style={{ height: "300px", overflowY: "scroll" }}>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.sender}:</strong> {message.text}
          </div>
        ))}
      </div>
      <TextField
            fullWidth
            variant="outlined"
            label="Type your message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
      <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
          >
      Send
      </Button>
      </Paper>
      </Container>
    </div>
  );
};

export default Chat;
