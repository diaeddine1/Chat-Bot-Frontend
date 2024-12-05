import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from "@mui/material";
import { styled } from "@mui/system";
import logoIcon from "../assets/icon.png"; // Replace with your logo icon
import logout from "../assets/logout.png";

const NavBar = styled(AppBar)({
  backgroundColor: "#fff", // White background
  boxShadow: "none", // Remove the default shadow
  border: "2px solid beige",
});

const ToolbarStyled = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
});

const Logo = styled(Avatar)({
  height: "40px",
  width: "40px",
  backgroundColor:"green"
});

const CenteredUserName = styled(Typography)({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  color: "grey", // Grey text color
  fontSize: "1.25rem",
});

const UserSection = styled(Box)({
  display: "flex",
  alignItems: "center",
});

export default function NavBarComponent() {
  const user = {
    username: "Dia Eddine",
    avatar: "D", // Replace with the actual avatar URL
  };

  return (
    <NavBar position="static">
      <ToolbarStyled>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Logo src={user.avatar} alt="D" />
        </IconButton>
        <CenteredUserName variant="h6">Welcome {user.username}</CenteredUserName>
        <UserSection>
          <IconButton edge="end" color="inherit" aria-label="logout">
            <Avatar src={logout} alt="Logout Icon" />
          </IconButton>
        </UserSection>
      </ToolbarStyled>
    </NavBar>
  );
}
