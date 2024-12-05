import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  List,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useState, useEffect } from "react";
import icon from "../assets/icon.png";
import ChatHistory from "./ChatHistory"; // Import the ChatHistory component
import { format } from "date-fns";
import NavBarComponent from "./NavBar";

const ChatContainer = styled(Box)({
  display: "flex",
  height: "100vh",
});

const HistoryContainer = styled(Box)({
  width: "30%",
  maxHeight: "100vh",
  overflowY: "auto",
  borderRight: "1px solid #ccc",
  padding: "16px",

});


const ChatBoxContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "62%", // Adjust the width
  padding: "16px",
  marginTop: "16px", // Add margin at the top
  marginLeft: "8px", // Push the container to the left
});

const ChatBox = styled(Box)({
  width: "100%",
  height: "60%",
  maxHeight: "100vh",
  overflowY: "auto",
  border: "1px solid #ccc",
  padding: "16px",
  borderRadius: "8px",
  flexDirection: "column",
  marginBottom: "16px",
});

const InputContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "1200px",
});

const TextFieldStyled = styled(TextField)({
  flexGrow: 1,
  marginRight: "8px",
});

const ButtonStyled = styled(Button)({
  height: "56px",
});

const LoadingText = styled(ListItemText)({
  fontStyle: "italic",
});

export default function Aiducator() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const user = {
    username: "Dia Eddine",
    avatar: "D",
  };

  useEffect(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    }
  }, []);

  useEffect(() => {
    if (selectedChat !== null) {
      setMessages(chatHistory[selectedChat] || []);
    }
  }, [selectedChat, chatHistory]);

  const handleNewChat = () => {
    const updatedChatHistory = [...chatHistory, []];
    setChatHistory(updatedChatHistory);
    setSelectedChat(updatedChatHistory.length - 1);
    setMessages([]);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage = {
      user: "User",
      text: input,
      date: new Date().toISOString(),
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/generate/",
        { prompt: input },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      const botMessage = {
        user: "Bot",
        text: data.response,
        date: new Date().toISOString(),
      };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      // Update chat history
      const updatedChatHistory = [...chatHistory];
      if (selectedChat !== null) {
        updatedChatHistory[selectedChat] = finalMessages;
      } else {
        updatedChatHistory.push(finalMessages);
        setSelectedChat(updatedChatHistory.length - 1);
      }

      setChatHistory(updatedChatHistory);
      localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
    } catch (error) {
      console.error("Error while generating text", error);
      const errorMessage = {
        user: "Bot",
        text: "Error: Unable to get a response.",
        date: new Date().toISOString(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);

      const updatedChatHistory = [...chatHistory];
      if (selectedChat !== null) {
        updatedChatHistory[selectedChat] = finalMessages;
      } else {
        updatedChatHistory.push(finalMessages);
        setSelectedChat(updatedChatHistory.length - 1);
      }

      setChatHistory(updatedChatHistory);
      localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
    }

    setLoading(false);
  };

  return (
    <>
    <NavBarComponent></NavBarComponent>
    <ChatContainer>

      <HistoryContainer>
        <ButtonStyled
          variant="contained"
          color="primary"
          onClick={handleNewChat}
          sx={{ marginTop: "16px",width:"40%",marginLeft:"165px" }}
        >
          Nouvelle Conversation
        </ButtonStyled>
        <ChatHistory chatHistory={chatHistory} setSelectedChat={setSelectedChat} />
      </HistoryContainer>
      
      
      <ChatBoxContainer>
        <Typography
          variant="h4"
          sx={{ display: "flex", alignItems: "center" }}
          gutterBottom
        >
          <Avatar src={icon} sx={{ marginRight: 1 }} />
          Aiducator
        </Typography>

        <ChatBox>
          <List>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    message.user === "User" ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                {message.user === "User" && user && (
                  <Avatar
                    sx={{
                      fontSize: 25,
                      margin: "auto 4px auto 0",
                      backgroundColor: "green",
                    }}
                  >
                    {user.username && user.username.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                {message.user === "Bot" && (
                  <Avatar src={icon} sx={{ margin: "auto 4px auto 0" }} />
                )}
                <Paper
                  sx={{
                    padding: "8px",
                    borderRadius: "12px",
                    backgroundColor:
                      message.user === "User" ? "#f0f0f0" : "#e0e0e0",
                  }}
                >
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  ></Typography>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: "8px",
                }}
              >
                <Avatar src={icon} />
                <Paper
                  sx={{
                    padding: "8px",
                    borderRadius: "12px",
                    backgroundColor: "#f0f0f0",
                    marginLeft: "8px",
                  }}
                >
                  <Typography variant="body1">
                    Aiducator est entrain d'écrire...
                  </Typography>
                  <CircularProgress size={24} />
                </Paper>
              </Box>
            )}
          </List>
        </ChatBox>
        <InputContainer>
          <TextFieldStyled
            label="Type your message"
            variant="outlined"
            autocomplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <ButtonStyled
            variant="contained"
            color="primary"
            onClick={handleSend}
            disabled={loading}
          >
            Send
          </ButtonStyled>
        </InputContainer>
      </ChatBoxContainer>
      
    </ChatContainer>
    </>
  );
}
