import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";
import { Box, Button, useMediaQuery, Modal, useTheme, Typography } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import ScrollToTop from "components/ScrollToTop";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import PostWidget from "scenes/widgets/PostWidget";
import environment from "env";
import FriendsList from "scenes/widgets/FriendsList";

const ChatScreen = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const theme = useTheme();
    const navigate = useNavigate();

    return (<Box
        width="100%"
        p='2rem'
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box p='1rem'
            backgroundColor= {theme.palette.background.alt} 
            borderRadius= '0.75rem'
            display={isNonMobileScreens ? "flex" : "block"}
        >
            <Box flexBasis='25%'>
                <Button startIcon={
                    <ArrowBackIos/>
                    } onClick={() => {navigate('/home')}}><Typography variant="h5">
                        Back to Home
                    </Typography>
                </Button>
                <FriendsList />
            </Box>
            <hr />
            <Box flexBasis='72%'>
                <img
                    width="100%"
                    height="auto"
                    alt="advert"
                    src={`${environment.backendUrl}/assets/info4.jpeg`}
                    style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
                />
            </Box>
        </Box>
    </Box>);
}

export default ChatScreen;