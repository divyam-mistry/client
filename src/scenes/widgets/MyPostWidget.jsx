import {
  EditOutlined,
  DeleteOutlined,
  AutoFixHigh,
  ImageOutlined,
  Close,
  Add,
  ContentCopy
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  Modal,
  IconButton,
  useMediaQuery,
  Chip,
  Paper,
  Skeleton
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { styled } from '@mui/system';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import environment from "env";

const MyPostWidget = ({ picturePath, updatePosts }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [postDescription, setPostDescription] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const ListItem = styled('li')({
    margin: '0.5rem'
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setGenerate(false);
    setChipData([]);
    setCaptionData([]);
  }
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // border: `2px solid #000`,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '1rem'
  };
  const [chipData, setChipData] = useState([]);
  const [generate, setGenerate] = useState(false);
  const [captionData, setCaptionData] = useState([]);
  const [keyword, setKeyword] = useState('');

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };
  const addKeyword = () => {
    // setChipData([...chipData, newObj]);
    chipData.push({
      key: chipData.length,
      label: keyword
    });
    setKeyword('');
  }

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", postDescription);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    updatePosts(posts);
    setImage(null);
    setPostDescription("");
  };

  const generateCaptions = async () => {
    console.log(chipData);
    const response = await fetch(`${environment.backendUrl}/helpers/captions/generate`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(chipData),
    });
    const resp = await response.json();
    console.log(resp);
    setCaptionData(resp.captions);
  };

  return (
    <Box mb='1rem'>
      <WidgetWrapper>
        <FlexBetween gap='1.5rem'>
            <UserImage image={picturePath} size="50px"></UserImage>
            <Box sx={{
                backgroundColor: palette.neutral.light,
                borderRadius: "1.5rem",
                height: '50px',
                width: '100%',
                padding: "0.2rem 1.2rem",
                display: 'flex',
                alignItems: 'center'
            }}>
                <InputBase 
                  fullWidth={true}
                  multiline={true}
                  maxRows={2}
                  minRows={1}
                  placeholder="What's on your mind?" 
                  value={postDescription} 
                  onChange={(e) => setPostDescription(e.target.value)}
                />
            </Box>
        </FlexBetween>

        {isImage && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!image ? (
                      <p>Add Image Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                  {image && (
                    <IconButton
                      onClick={() => setImage(null)}
                      sx={{ ml: "0.5rem" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}

        <Divider sx={{m: '1rem 0'}}/>
        <FlexBetween>
          <FlexBetween gap='1rem'>
            <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
              <ImageOutlined sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              >
                Image
              </Typography>
            </FlexBetween>
            
            <FlexBetween gap="0.25rem" onClick={handleOpen}>
              <AutoFixHigh sx={{ color: mediumMain }} />
              <Typography color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
              >
                Caption
              </Typography>
            </FlexBetween>
          </FlexBetween>

          <Button 
            disabled={!(postDescription && image)}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: (postDescription && image) ? palette.primary.main : null,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>

        </FlexBetween>
      </WidgetWrapper>
      
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box onClick={handleClose}>
              <Close fontSize="large" sx={{
                top: '5%', right: '5%', position: 'absolute', 
                color: palette.neutral.dark
              }}></Close>
          </Box>
          <Typography mt='1rem' variant='h3' color={mediumMain}>PixelChat Caption Generator</Typography>
          <Box>
            <FlexBetween
              backgroundColor={palette.neutral.light}
              borderRadius="5px"
              padding="0.2rem 0 0.2rem 0.5rem"
              mt="1rem"
            >
              <InputBase 
                placeholder="Enter keywords..." 
                onChange={(event) => setKeyword(event.target.value)}
                value={keyword}
              />
              <Button disabled={(!keyword || chipData.length >= 3 )} onClick={addKeyword}>Add</Button>
            </FlexBetween>
          </Box>
          {(chipData.length > 0) && <Paper
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              listStyle: 'none',
              p: 0.5,
              mt: '0.5rem',
            }}
            component="ul"
          >
            {chipData.map((data) => {
              return (
                <ListItem key={data.key}>
                  <Chip
                    label={data.label}
                    onDelete={handleDelete(data)}
                  />
                </ListItem>
              );
            })}
          </Paper>}
          {(chipData.length > 0) && <Button fullWidth={true} sx={{
            padding: '0.75rem',
            backgroundColor: palette.primary.light,
            borderRadius: '0.75rem',
            gap: '1rem'
          }} onClick={() => {
            setGenerate(true);
            generateCaptions();
          }}>
            <Typography>Generate</Typography>
          </Button>}
          {generate && <Box>
            {(captionData.length > 0)
            ? <Box mt='1rem'>
              {captionData.map((c, index) => {
                return <Box gap='0.25rem' display='flex' justifyContent='start' alignItems='center'>
                  <IconButton onClick={() => {
                    navigator.clipboard.writeText(c);
                  }}>
                    <ContentCopy color={mediumMain} id={`icon${index}`} ></ContentCopy>
                  </IconButton>
                  <Typography color={mediumMain} id={`typo${index}`} variant='h6'>{c}</Typography>
                </Box>
              })}
            </Box> 
            : <Box mt='1rem'>
              <Skeleton />
              <Skeleton /> 
              <Skeleton /> 
              <Skeleton /> 
              <Skeleton />
            </Box>}
          </Box>} 
        </Box>
      </Modal>

    </Box>
  );
};


export default MyPostWidget;
