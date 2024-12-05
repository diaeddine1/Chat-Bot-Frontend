import React from "react";
import { Box, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { format, isValid, parseISO } from "date-fns";

const HistoryContainer = styled(Box)({
  width: "30%",
  maxHeight: "100vh",
  overflowY: "auto",
  borderRight: "1px solid #ccc",
  padding: "16px",
});

export default function ChatHistory({ chatHistory, setSelectedChat }) {
  const groupChatsByMonth = () => {
    const groupedChats = {};
    chatHistory.forEach((chat, index) => {
      if (chat[0] && chat[0].date) {
        const date = parseISO(chat[0].date);
        if (isValid(date)) {
          const month = format(date, "MMMM yyyy");
          if (!groupedChats[month]) {
            groupedChats[month] = [];
          }
          groupedChats[month].push({ chat, index });
        }
      }
    });
    return groupedChats;
  };

  const groupedChats = groupChatsByMonth();

  return (
    <>
      
      <h1 style={{textAlign:"center"}}>Historique</h1>
      <List>
        {Object.entries(groupedChats).map(([month, chats]) => (
          <Box key={month} sx={{ marginBottom: "16px" }}>
            <Typography variant="h6">{month}</Typography>
            {chats.map(({ chat, index }) => (
              <Paper
                key={index}
                onClick={() => setSelectedChat(index)}
                sx={{
                  padding: "8px",
                  marginBottom: "8px",
                  cursor: "pointer",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <ListItemText
                  primary={chat[0].text}
                  secondary={format(parseISO(chat[0].date), "MMMM dd, yyyy")}
                />
              </Paper>
            ))}
          </Box>
        ))}
      </List>
    </>
  );
}
