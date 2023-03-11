import { Box, Modal, Typography, useTheme, Divider, IconButton, Tooltip } from "@mui/material";
import {
  ManageAccountsOutlined,
  WorkOutlineOutlined,
  LocationOnOutlined,
  Edit,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";

const UserWidget = ({ userId, picturePath, modalOpen }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  // const user = useSelector((state) => state.user);

  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const medium = theme.palette.neutral.medium;
  const main = theme.palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return null;
  const {
    firstName,
    lastName,
    occupation,
    location,
    viewedProfile,
    impressions,
    friends,
  } = user;
  const fullName = firstName + " " + lastName;

  

  return (
    <WidgetWrapper theme={theme}>
        <FlexBetween paddingBottom="1rem">
          <FlexBetween
            sx={{ "&:hover": { cursor: "pointer" } }}
          >
            <Tooltip title='User Profile'>
              <Box onClick={() => {
                modalOpen();
              }}>
                <UserImage image={picturePath} size="50px"></UserImage>
              </Box>
            </Tooltip>
            <Box paddingLeft=".75rem" onClick={() => {
              console.log("user profile clicked");
              navigate(`/profile/${userId}`);
            }}>
              <Typography variant="h4" color={dark}>
                {fullName}
              </Typography>
              <Typography color={medium}>{friends.length} friends</Typography>
            </Box>
          </FlexBetween>
          <IconButton
            onClick={() => {
              console.log("edit user clicked");
            }}
          >
            <ManageAccountsOutlined sx={{ color: main }} />
          </IconButton>
        </FlexBetween>
        <Divider />
        <Box p="1rem 0">
          <Box gap="1rem" alignItems="center" display="flex" mb="0.5rem">
            <LocationOnOutlined sx={{ color: main }} />
            <Typography color={medium}>{location}</Typography>
          </Box>
          <Box gap="1rem" alignItems="center" display="flex">
            <WorkOutlineOutlined sx={{ color: main }} />
            <Typography color={medium}>{occupation}</Typography>
          </Box>
        </Box>
        <Divider />
        <Box p="1rem 0">
          <FlexBetween mb='0.5rem'>
            <Typography color={medium}>Who's viewed your profile</Typography>
            <Typography fontWeight='500'>{viewedProfile}</Typography>
          </FlexBetween>
          <FlexBetween>
            <Typography color={medium}>Impressions of your post</Typography>
            <Typography fontWeight='500'>{impressions}</Typography>
          </FlexBetween>
        </Box>
        <Divider />
        <Box p="1rem 0">
          <Typography color={dark} variant="h5" mb="0.75rem">
            Social Profiles
          </Typography>
          <SocialWidget
            name="Twitter"
            dark={dark}
            medium={medium}
            main={main}
          ></SocialWidget>
          <SocialWidget
            name="LinkedIn"
            dark={dark}
            medium={medium}
            main={main}
          ></SocialWidget>
        </Box>
        
      </WidgetWrapper>
  );
};

const SocialWidget = ({ name, dark, medium, main }) => {
  return (
    <FlexBetween>
      <FlexBetween gap='1rem' mb={name === 'Twitter' ? '0.5rem' : '0'}>
        {name === "Twitter" 
        ? <Twitter fontSize="large" sx={{color: main}}/> 
        : <LinkedIn fontSize="large" sx={{color: main}}/>}
        <Box>
          <Typography color={dark}>{name}</Typography>
          <Typography color={medium}>Social Network</Typography>
        </Box>
      </FlexBetween>
      <Edit sx={{ color: main }} />
    </FlexBetween>
  );
};

export default UserWidget;
