import { Box, Typography, Modal, InputBase,  useTheme, Divider, IconButton, Tooltip, Button } from "@mui/material";
import {
  ManageAccountsOutlined,
  WorkOutlineOutlined,
  LocationOnOutlined,
  Edit,
  Twitter,
  LinkedIn,
  Explore,
  Close,
  Search,
  Speaker,
} from "@mui/icons-material";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";
// import useSound from "use-sound";

const UserWidget = ({ userId, picturePath, modalOpen }) => {
  const [user, setUser] = useState(null);
  const [word, setWord] = useState('');
  const [wordDefinition, setWordDefinition] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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

  const getWordDefinitions = async (word) => {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,{
      method: 'GET',
    });
    const data = await response.json();
    if(data.title) return data;
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
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: '2rem',
    borderRadius: '1rem'
  };

  return (
    <Box>
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
      <Button fullWidth={true} startIcon={<Explore />} sx={{
        m: '1.5rem 0',
        padding: '0.75rem',
        backgroundColor: theme.palette.background.alt,
        borderRadius: '0.75rem',
        gap: '1rem'
      }} onClick={() => {
        console.log("explore feed clicked");
        navigate(`/explore`);
      }}>
        <Typography> Explore Feed </Typography>
      </Button>
      <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="0.75rem"
            gap="3rem"
            padding="0.2rem 1.5rem"
          >
            <InputBase placeholder="Search..." onChange={onWordChange} />
            <IconButton onClick={() => getWordDefinitions(word).then((result) => {
              setWordDefinition(result);
              handleOpen();
            }).catch((error) => {
              console.log('error', error);
              setWordDefinition(error);
              handleOpen();
            })}>
              <Search />
            </IconButton>
      </FlexBetween>
      {/* MODAL FOR WORD DEFINITION */}
      <Modal open={open} onClose={handleClose} >
        <Box sx={style}>
          <Box onClick={handleClose}>
            <Close fontSize="large" sx={{
              top: '1rem', right: '1rem', position: 'absolute', 
              color: theme.palette.neutral.dark
            }}></Close>
          </Box>
          { wordDefinition.word ? <Box mt='1rem'>
          <Typography variant='h4' mb='1rem' sx={{
            textDecoration: 'underline'
          }}>{wordDefinition.word} </Typography> 
          <Box display='flex'>
          {
            wordDefinition.phonetics.map((pi, index) => {
              return <Typography key={index}>
                {pi.text}
              </Typography>;
            })
          }
          </Box>
          {
            wordDefinition.meanings.map((word, index) => {
              return <Box mb='0.5rem' key={index}>
                <Typography variant='h5' fontStyle='italic'>{word.partOfSpeech}</Typography>
                <Typography variant='h5' color={medium} ml='1.5rem'>
                  {word.definitions[0].definition}
                </Typography>
                { word.definitions[0].example && <Typography variant='h5' color={medium} ml='1.5rem'>
                  <i>Example: </i> "{word.definitions[0].example}"
                </Typography>
                }
              </Box>;
            })
          }
          </Box> : <Box mt='1rem'>
          <Typography variant='h4'>" {wordDefinition.title} "</Typography>
          <Typography variant='h5' color={medium} mt='1rem'>
            {wordDefinition.message + ' ' + wordDefinition.resolution}
          </Typography>
          </Box>}
        </Box>
      </Modal>
    </Box>
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
