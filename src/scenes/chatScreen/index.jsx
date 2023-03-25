import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import UserImage from "components/UserImage";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  useMediaQuery,
  IconButton,
  InputBase,
  useTheme,
  Typography,
} from "@mui/material";
import { Search, ArrowBackIos, MoreVert, Forum } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import environment from "env";
import Friend from "components/Friend";

const ChatScreen = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [activeFriend, setActiveFriend] = useState({
    id: "",
    name: "",
    picturePath: "",
  });
  const { _id, friends } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getFriends = async () => {
    const response = await fetch(
      `${environment.backendUrl}/users/${_id}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const userFriends = await response.json();
    // setFriends(userFriends);
    dispatch(setFriends({ friends: userFriends }));
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <Box
      width="100%"
      height="100%"
      p="2rem"
      gap="0.5rem"
      backgroundColor={theme.palette.background.alt}
    >
      <Box
        p="1rem"
        height="100%"
        backgroundColor={theme.palette.background.default}
        borderRadius="0.75rem"
        display={isNonMobileScreens ? "flex" : "block"}
        justifyContent="space-between"
      >
        <Box flexBasis="25%">
          <Button
            startIcon={<ArrowBackIos />}
            onClick={() => {
              navigate("/home");
            }}
          >
            <Typography variant="h5">Back to Home</Typography>
          </Button>
          <FriendsPanelLeft
            friends={friends}
            activeFriend={activeFriend}
            setActiveFriend={setActiveFriend}
          />
        </Box>
        <Box
          flexBasis="72%"
          sx={{
            borderRadius: "0.75rem",
            backgroundColor: theme.palette.background.alt,
            display: "flex",
            flexDirection: "column",
            justifyContent: (activeFriend.id) ? "flex-start" : "center",
          }}
        >
          {(activeFriend.id) ? <ChatHeader friend={activeFriend} /> : <InitialChatScreen />}
        </Box>
      </Box>
    </Box>
  );
};

const FriendsPanelLeft = ({ friends, activeFriend, setActiveFriend }) => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const navigate = useNavigate();

  return (
    <Box>
      <FlexBetween
        backgroundColor={palette.neutral.light}
        borderRadius="5px"
        gap="3rem"
        padding="0.2rem 1.5rem"
        mt="1rem"
      >
        <InputBase placeholder="Search..." />
        <IconButton>
          <Search />
        </IconButton>
      </FlexBetween>
      {friends.map((friend, index) => {
        const name = friend.firstName + " " + friend.lastName;
        return (
          <Box
            key={index}
            mt="1rem"
            p="0.5rem 0.75rem"
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
              backgroundColor:
                activeFriend.id === friend._id ? palette.background.alt : null,
              borderRadius: "0.5rem",
            }}
            onClick={() => {
              setActiveFriend({
                id: friend._id,
                name: name,
                picturePath: friend.picturePath,
              });
            }}
          >
            <FlexBetween>
              <FlexBetween gap="1rem">
                <UserImage image={friend.picturePath} size="40px" />
                <Box>
                  <Typography color={main} variant="h5" fontWeight="500">
                    {name}
                  </Typography>
                  <Typography color={main} fontSize="0.75rem">
                    last text from this user
                  </Typography>
                </Box>
              </FlexBetween>
              <Typography color={main} fontSize="0.75rem">
                22:32
              </Typography>
            </FlexBetween>
          </Box>
        );
      })}
    </Box>
  );
};

const ChatHeader = ({ friend }) => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  return (
    <Box
      p="1rem"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <FlexBetween gap="1rem">
        <UserImage image={friend.picturePath} size="40px" />
        <Box>
          <Typography color={main} variant="h5" fontWeight="500">
            {friend.name}
          </Typography>
          <Typography color={main} fontSize="0.75rem">
            Last seen @ 22:32
          </Typography>
        </Box>
      </FlexBetween>
      <Typography color={main} fontSize="0.75rem">
        <MoreVert />
      </Typography>
    </Box>
  );
};

const InitialChatScreen = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    return <Box alignItems='center' display='flex' flexDirection="column" justifyContent='center'>
      <Forum fontSize='large' color={medium}/>
      <Typography mt='0.5rem' color={medium} fontSize="0.9rem">
        Please tap on a friend to chat with them.
      </Typography>
    </Box>;
};

export default ChatScreen;
