import { Box, Typography, useTheme, Divider, IconButton, Tooltip, Button, InputBase } from "@mui/material";
import {
  ManageAccountsOutlined,
  WorkOutlineOutlined,
  LocationOnOutlined,
  Edit,
  Twitter,
  LinkedIn,
  Explore,
} from "@mui/icons-material";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";
import { autoBatchEnhancer } from "@reduxjs/toolkit";

const MyPostWidget = ({ picturePath }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  // const user = useSelector((state) => state.user);

  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const medium = theme.palette.neutral.medium;
  const main = theme.palette.neutral.main;

  return (
    <Box>
      <WidgetWrapper theme={theme}>
        <FlexBetween gap='1.5rem' mb='1rem'>
            <UserImage image={picturePath} size="50px"></UserImage>
            <Box sx={{
                backgroundColor: theme.palette.neutral.light,
                borderRadius: "1.5rem",
                height: '50px',
                width: '100%',
                padding: "0.2rem 1.5rem",
                display: 'flex',
                alignItems: 'center'
            }}>
                <InputBase placeholder="What's on your mind?" />
            </Box>
        </FlexBetween>
        <Divider />
      </WidgetWrapper>
    </Box>
  );
};

export default MyPostWidget;
