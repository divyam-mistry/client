import FlexBetween from "components/FlexBetween";
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
  Modal,
  Divider,
  Popover
} from "@mui/material";
import { Search, ArrowBackIos, MoreVert, Forum, ImageOutlined, SendOutlined, EmojiEmotionsOutlined, ContentCopy, Reply} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import environment from "env";
import EmojiPicker from "emoji-picker-react";
import './index.css';
import { useRef } from "react";
import moment from "moment/moment";

const ChatScreen = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [activeFriend, setActiveFriend] = useState({
    id: "",
    name: "",
    picturePath: "",
  });
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([
    { text: "Hey, how's it going?", sender: "John" },
    { text: "Not bad, thanks for asking. How about you?", sender: "6404d383c747bf43f925b5bb" },
    { text: "I'm doing pretty well, thanks. What have you been up to?", sender: "John" },
    { text: "Not much, just working on some projects. How about you?", sender: "6404d383c747bf43f925b5bb" },
    { text: "Same here, trying to finish up a project before the deadline.", sender: "John" },
    { text: "Good luck with that! What's the project about?", sender: "6404d383c747bf43f925b5bb" },
    { text: "It's a chat application, actually. How ironic, right?", sender: "John" },
    { text: "Haha, yeah. Well, let me know if you need any help with it.", sender: "6404d383c747bf43f925b5bb" }
  ]);

  const handleSendMessage = (message) => {
    setMessages([...messages, { text: message, sender: user._id, datetime: Date.now() }]);
  };

  const getFriends = async () => {
    const response = await fetch(
      `${environment.backendUrl}/users/${user._id}/friends`,
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
      overflow='clip'
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
            friends={user.friends}
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
          {(activeFriend.id) 
          ? <Box>
            <ChatHeader friend={activeFriend} />
            <ChatArea currentUser={user} messages={messages}/>
            <ChatFooter user={user} setMessages={handleSendMessage} />
          </Box> 
          : <InitialChatScreen />}
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
                  <Typography color={medium} fontSize="0.75rem">
                    last text from this user
                  </Typography>
                </Box>
              </FlexBetween>
              <Typography color={medium} fontSize="0.75rem">
                {moment().format('hh:mm')}
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
      p="1rem 2rem"
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

const ChatArea = ({ currentUser, messages }) => {
  const theme = useTheme();
  const medium = theme.palette.neutral.medium;
  const chatEndRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [msg, setMsg] = useState('');
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleContextMenu(event, msg) {
    event.preventDefault();
    setMsg(msg);
    setAnchorEl(event.target);
  }

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return <Box className='chatArea' sx={{
    height:'470px',
    overflowX: 'hidden',
    overflowY: 'scroll',
    padding: '0.5rem 0',
    backgroundColor: theme.palette.neutral.light,
    }}>
      <Divider>Today</Divider>
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent:
              message.sender === currentUser._id ? 'flex-end' : 'flex-start',
          }}
        >
          <div
            style={{
              backgroundColor:
                message.sender === currentUser._id ? '#008080' : '#2196F3',
              padding: '10px',
              borderRadius: '10px',
              margin: '5px 10px',
              maxWidth: '60%',
              wordWrap: 'break-word'
            }}
            onContextMenu={(event) => {
              handleContextMenu(event, message.text);
            }}
          >
            <Typography>
              {message.text}
            </Typography>
            <Typography fontSize='12px' sx={{
              // alignItems: 'end',
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              {moment().format('hh:mm')}
            </Typography>
          </div>
          <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              sx={{mt: '1.5rem', ml: '-1.5rem', maxWidth: true, boxShadow: 'none'}}>
              <Box sx={{
                padding: '0.25rem'}}>
                <ActionButton 
                  icon={<ContentCopy />}
                  label='Copy'
                  func={() => {
                    console.log('msg: ', msg);
                    navigator.clipboard.writeText(msg);
                    handleClose();
                  }}
                ></ActionButton>
                <ActionButton 
                  icon={<Reply />}
                  label='Reply'
                  func={() => {
                    handleClose();
                  }}
                ></ActionButton>
                <ActionButton 
                  icon={<Reply sx={{transform: 'scaleX(-1)'}} />}
                  label='Forward'
                  func={() => {
                    handleClose();
                  }}
                ></ActionButton>
              </Box>
          </Popover>
        </div>
      ))}  
    <div ref={chatEndRef} mt='1rem'></div>
  </Box>;
}

const ActionButton = ({icon, label, func}) => {
  return <Box onClick={func} display='flex' gap='1rem' p='0.4rem'>
    {icon}
    <Typography >{label}</Typography>
  </Box>;
}

const ChatFooter = ({ user, setMessages }) => {
  const { palette } = useTheme();
  const [ emojiPickerActive, setEmojiPickerActive] = useState(false);
  const [ imagePickerActive, setImagePickerActive] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  return (
    <Box
      p="1rem 2rem"
      mb='0.5rem'
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <FlexBetween gap="1rem">
        <IconButton onClick={() => {setEmojiPickerActive(true)}}>
          <EmojiEmotionsOutlined fontSize="medium" />
        </IconButton>
        <Modal disableEnforceFocus={true} open={emojiPickerActive} onClose={() => setEmojiPickerActive(false)}>
          <Box sx={{
            width: 'auto',
            left: '60px',
            position: "relative",
            top: "220px"}}
          >
            <EmojiPicker 
              theme='dark'
              autoFocusSearch={true} 
              skinTonesDisabled={true} onEmojiClick={(emojiData) => {
              setChatMessage(chatMessage + emojiData.emoji);
            }}/>
          </Box>
        </Modal>
        <IconButton onClick={() => {setImagePickerActive(true)}}>
          <ImageOutlined fontSize="medium" />
        </IconButton>
        <Modal disableEnforceFocus={true} open={imagePickerActive} onClose={() => setImagePickerActive(false)}>
          <Box sx={{
            width: 'auto',
            left: '60px',
            position: "relative",
            top: "220px"}}
          >
            
          </Box>
        </Modal>
        <Box sx={{
            backgroundColor: palette.neutral.light,
            borderRadius: "1.5rem",
            height: '50px',
            margin: '0 1rem',
            width: '780px',
            padding: "0.2rem 1.5rem",
            display: 'flex',
            alignItems: 'center'
        }}>
            <InputBase 
              placeholder="Type a message..." 
              value={chatMessage}
              fullWidth={true}
              multiline={true}
              maxRows={2}
              minRows={1}
              onChange={(e) => setChatMessage(e.target.value)}
            />
        </Box>
      </FlexBetween>
      <Button
        endIcon={<SendOutlined />}
        onClick={() => {
          if(chatMessage) setMessages(chatMessage);
          setChatMessage('');
        }}
      >
        <Typography variant="h5">Send</Typography>
      </Button>
    </Box>
  );
};

const InitialChatScreen = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    return <Box alignItems='center' display='flex' flexDirection="column" justifyContent='center'>
      <Forum color={medium} sx={{
        fontSize: '5rem'
      }}/>
      <Typography mt='0.5rem' color={medium} fontSize="0.9rem">
        Please tap on a friend to chat with them.
      </Typography>
    </Box>;
};

export default ChatScreen;


// {emojiPickerActive && <Box sx={{
//   "& .MuiBox-root css-1pfiqnk" : {
//     left: '-250px',
//     position: "relative",
//     bottom: '480px',
//   }
// }}>
//     <EmojiPicker />
//   </Box>}