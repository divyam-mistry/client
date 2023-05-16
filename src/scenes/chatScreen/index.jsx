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
  Fade,
  Paper,
  Popper,
  ClickAwayListener,
  Card,
  Chip,
} from "@mui/material";
import {
  Search,
  MoreVert,
  Forum,
  ImageOutlined,
  SendOutlined,
  EmojiEmotionsOutlined,
  ContentCopy,
  Reply,
  Close,
  KeyboardBackspace,
  EmojiEmotions,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import environment from "env";
import EmojiPicker from "emoji-picker-react";
import "./index.css";
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
    {
      text: "Not bad, thanks for asking. How about you?",
      sender: "6404d383c747bf43f925b5bb",
    },
    {
      text: "I'm doing pretty well, thanks. What have you been up to?",
      sender: "John",
    },
    {
      text: "Not much, just working on some projects. How about you?",
      sender: "6404d383c747bf43f925b5bb",
    },
    {
      text: "Same here, trying to finish up a project before the deadline.",
      sender: "John",
    },
    {
      text: "Good luck with that! What's the project about?",
      sender: "6404d383c747bf43f925b5bb",
    },
    {
      text: "It's a chat application, actually. How ironic, right?",
      sender: "John",
    },
    {
      text: "Haha, yeah. Well, let me know if you need any help with it.",
      sender: "6404d383c747bf43f925b5bb",
    },
  ]);

  const handleSendMessage = (message) => {
    setMessages([
      ...messages,
      { text: message, sender: user._id, datetime: Date.now() },
    ]);
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
      p="1rem"
      gap="0.5rem"
      backgroundColor={theme.palette.background.default}
      overflow="clip"
    >
      <Box
        pl="1rem"
        height="100%"
        backgroundColor={theme.palette.background.alt}
        borderRadius="0.75rem"
        display={isNonMobileScreens ? "flex" : "block"}
        justifyContent="space-between"
      >
        <Box flexBasis="26%" p="1rem 0 0 1rem">
          <Box display="flex" gap="1rem" alignItems="center">
            <IconButton
              fontSize="large"
              onClick={() => {
                navigate("/home");
              }}
            >
              <KeyboardBackspace></KeyboardBackspace>
            </IconButton>
            <Typography variant="h3">Chats</Typography>
          </Box>
          <FriendsPanelLeft
            friends={user.friends}
            activeFriend={activeFriend}
            setActiveFriend={setActiveFriend}
          />
        </Box>
        <Box
          flexBasis="72%"
          sx={{
            borderRadius: "0rem 0.75rem 0.75rem 0rem",
            borderLeft: `3px solid ${theme.palette.background.default}`,
            backgroundColor: theme.palette.background.alt,
            display: "flex",
            flexDirection: "column",
            justifyContent: activeFriend.id ? "flex-start" : "center",
          }}
        >
          {activeFriend.id ? (
            <Box>
              <ChatHeader friend={activeFriend} />
              <ChatArea currentUser={user} messages={messages} />
              <ChatFooter user={user} setMessages={handleSendMessage} />
            </Box>
          ) : (
            <InitialChatScreen />
          )}
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
        mt="1.5rem"
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
                {moment().format("hh:mm")}
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
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const [word, setWord] = useState("");
  const [wordDefinition, setWordDefinition] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setWord("");
    setOpen(false);
  };

  const getWordDefinitions = async (word) => {
    if (!word) return;
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    if (data.title) return data;
    console.log(data);
    return data[0];
  };

  const onWordChange = (event) => {
    setWord(event.target.value);
  };

  // style for modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // border: `2px solid #000`,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: "2rem",
    borderRadius: "1rem",
  };

  return (
    <Box
      p="1rem 2rem"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
      <FlexBetween>
        <FlexBetween
          backgroundColor={palette.background.alt}
          borderRadius="0.75rem"
          border="1px solid grey"
          gap="3rem"
          padding="0.2rem 1.5rem"
        >
          <InputBase
            placeholder="Get Word Definitions..."
            value={word}
            onChange={onWordChange}
          />
          <IconButton
            onClick={() =>
              getWordDefinitions(word)
                .then((result) => {
                  setWordDefinition(result);
                  handleOpen();
                })
                .catch((error) => {
                  console.log("error", error);
                  setWordDefinition(error);
                  handleOpen();
                })
            }
            disabled={!word}
          >
            <Search />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
      {/* MODAL FOR WORD DEFINITION */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box onClick={handleClose}>
            <Close
              fontSize="large"
              sx={{
                top: "1rem",
                right: "1rem",
                position: "absolute",
                color: palette.neutral.dark,
              }}
            ></Close>
          </Box>
          {wordDefinition.word ? (
            <Box mt="1rem">
              <Typography
                variant="h4"
                mb="1rem"
                sx={{
                  textDecoration: "underline",
                }}
              >
                {wordDefinition.word}{" "}
              </Typography>
              <Box display="flex">
                {wordDefinition.phonetics.map((pi, index) => {
                  return <Typography key={index}>{pi.text}</Typography>;
                })}
              </Box>
              {wordDefinition.meanings.map((word, index) => {
                return (
                  <Box mb="0.5rem" key={index}>
                    <Typography variant="h5" fontStyle="italic">
                      {word.partOfSpeech}
                    </Typography>
                    <Typography variant="h5" color={medium} ml="1.5rem">
                      {word.definitions[0].definition}
                    </Typography>
                    {word.definitions[0].example && (
                      <Typography variant="h5" color={medium} ml="1.5rem">
                        <i>Example: </i> "{word.definitions[0].example}"
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box mt="1rem">
              <Typography variant="h4">" {wordDefinition.title} "</Typography>
              <Typography variant="h5" color={medium} mt="1rem">
                {wordDefinition.message + " " + wordDefinition.resolution}
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

const ChatArea = ({ currentUser, messages }) => {
  const theme = useTheme();
  const medium = theme.palette.neutral.medium;
  const chatEndRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);

  function handleContextMenu(event, msg) {
    event.preventDefault();
    setMsg(msg);
    setOpen((prev) => !prev);
    setAnchorEl(event.target);
  }

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      className="chatArea"
      sx={{
        height: isMobile ? '100%' : '525px',
        overflowX: "hidden",
        overflowY: "scroll",
        padding: "0.5rem 0",
        backgroundImage: "url('/assets/chatbg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center', 
      }}
    >
      <Divider>
        <Chip label="Today" />
      </Divider>
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent:
              message.sender === currentUser._id ? "flex-end" : "flex-start",
          }}
        >
          <div style={{
              maxWidth: "60%", 
              display: "flex", 
              alignItems: 'center', 
              flexDirection: message.sender === currentUser._id ? "row-reverse" : "row",
            }} onMouseEnter={() => {
              setHoveredMessageIndex(index);
            }}
            onMouseLeave={() => {
              setHoveredMessageIndex(null);
            }}>
              <div
                style={{
                  fullWidth: true,
                  backgroundColor:
                    message.sender === currentUser._id ? "#008080" : "#2196F3",
                  padding: "10px",
                  borderRadius: "10px",
                  margin: "5px 10px",
                  wordWrap: "break-word",
                }}
                onContextMenu={(event) => {
                  handleContextMenu(event, message.text);
                }}
              >
                <Typography>{message.text}</Typography>
                <Typography
                  fontSize="12px"
                  sx={{
                    // alignItems: 'end',
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {moment().format("hh:mm")}
                </Typography>
              </div>
              {hoveredMessageIndex === index && (
                <div>
                  <IconButton onClick={() => {}}>
                    <EmojiEmotionsOutlined fontSize="medium" />
                  </IconButton>
                </div>
              )}
            </div>
          <ClickAwayListener
            onClickAway={() => {
              setOpen(false);
            }}
          >
            <Popper
              open={open}
              anchorEl={anchorEl}
              placement="top-start"
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper>
                    <Box
                      sx={{
                        padding: "0.25rem",
                      }}
                    >
                      <ActionButton
                        icon={<ContentCopy />}
                        label="Copy"
                        func={() => {
                          console.log("msg: ", msg);
                          navigator.clipboard.writeText(msg);
                          setOpen(false);
                        }}
                      ></ActionButton>
                      <ActionButton
                        icon={<Reply />}
                        label="Reply"
                        func={() => {
                          setOpen(false);
                        }}
                      ></ActionButton>
                      <ActionButton
                        icon={<Reply sx={{ transform: "scaleX(-1)" }} />}
                        label="Forward"
                        func={() => {
                          setOpen(false);
                        }}
                      ></ActionButton>
                      <ActionButton
                        icon={<Close />}
                        label="Close"
                        func={() => {
                          setOpen(false);
                        }}
                      ></ActionButton>
                    </Box>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </ClickAwayListener>
        </div>
      ))}
      <div ref={chatEndRef} mt="1rem"></div>
    </Box>
  );
};

const ActionButton = ({ icon, label, func }) => {
  const theme = useTheme();
  return (
    <Box
      onClick={func}
      display="flex"
      gap="1rem"
      p="0.4rem"
      borderRadius="2px"
      sx={{
        "&:hover": {
          backgroundColor: theme.palette.neutral.light,
        },
      }}
    >
      {icon}
      <Typography>{label}</Typography>
    </Box>
  );
};

const ChatFooter = ({ user, setMessages }) => {
  const { palette } = useTheme();
  const [emojiPickerActive, setEmojiPickerActive] = useState(false);
  const [imagePickerActive, setImagePickerActive] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  return (
    <Box
      p="1rem 2rem"
      mb="0.5rem"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <FlexBetween gap="1rem">
        <IconButton
          onClick={() => {
            setEmojiPickerActive(true);
          }}
        >
          <EmojiEmotionsOutlined fontSize="medium" />
        </IconButton>
        <Modal
          disableEnforceFocus={true}
          open={emojiPickerActive}
          onClose={() => setEmojiPickerActive(false)}
        >
          <Box
            sx={{
              width: "auto",
              left: "60px",
              position: "relative",
              top: "220px",
            }}
          >
            <EmojiPicker
              theme="dark"
              autoFocusSearch={true}
              skinTonesDisabled={true}
              onEmojiClick={(emojiData) => {
                setChatMessage(chatMessage + emojiData.emoji);
              }}
            />
          </Box>
        </Modal>
        <IconButton
          onClick={() => {
            setImagePickerActive(true);
          }}
        >
          <ImageOutlined fontSize="medium" />
        </IconButton>
        <Modal
          disableEnforceFocus={true}
          open={imagePickerActive}
          onClose={() => setImagePickerActive(false)}
        >
          <Box
            sx={{
              width: "auto",
              left: "60px",
              position: "relative",
              top: "220px",
            }}
          ></Box>
        </Modal>
        <Box
          sx={{
            backgroundColor: palette.neutral.light,
            borderRadius: "1.5rem",
            height: "50px",
            margin: "0 1rem",
            width: "780px",
            padding: "0.2rem 1.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
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
          if (chatMessage) setMessages(chatMessage);
          setChatMessage("");
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
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Forum
        color={medium}
        sx={{
          fontSize: "5rem",
        }}
      />
      <Typography mt="0.5rem" color={medium} fontSize="0.9rem">
        Please tap on a friend to chat with them.
      </Typography>
    </Box>
  );
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
