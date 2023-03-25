import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";
import {
  Zoom,
  Fab,
  Box,
  useMediaQuery,
  Modal,
  useTheme,
  Paper,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import { Masonry } from "@mui/lab";
import { styled } from "@mui/system";
import { useEffect, useState, useCallback } from "react";
import { Close, MoreVert, KeyboardArrowUp } from "@mui/icons-material";
import environment from "env.js";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import PostWidget from "scenes/widgets/PostWidget";

const ExplorePage = () => {
  const breakpoint1000 = useMediaQuery("(min-width: 1000px)");
  const breakpoint400 = useMediaQuery("(min-width: 400px)");
  const breakpoint600 = useMediaQuery("(min-width: 600px)");
  const breakpoint375 = useMediaQuery("(min-width: 375px)");
  //   const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  //   const [postImagePathForModal, setPostImagePathForModal] = useState("");
  //   const handleOpen = () => setOpen(true);
  //   const handleClose = () => setOpen(false);
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const navigate = useNavigate();

  // style for modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // border: `2px solid #000`,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "5%",
  };

  const getAllPosts = async () => {
    const response = await fetch(environment.backendUrl + "/posts/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    // filter posts that belong to loggedIn user.
    const filterData = data.filter((post) => {
      return post.userId !== userId;
    });
    console.log(filterData);
    setPosts(filterData);
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <Box>
      <Navbar></Navbar>
      <Box
        width="100%"
        p="1.5rem 6%"
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Masonry
          columns={breakpoint600 ? (breakpoint1000 ? 3 : 2) : 1}
          spacing={3}
        >
          {posts.map((post, index) => (
            <div key={index}>
              {/* <Label theme={theme}>
                <FlexBetween padding="0.5rem">
                  <FlexBetween
                    sx={{ "&:hover": { cursor: "pointer" } }}
                    onClick={() => {
                      console.log("user profile clicked");
                      navigate(`/profile/${post.userId}`);
                    }}
                  >
                    <UserImage
                      image={post.userPicturePath}
                      size="35px"
                    ></UserImage>
                    <Box paddingLeft=".75rem">
                      <Typography
                        variant="h5"
                        color={theme.palette.neutral.dark}
                      >
                        {post.firstName + " " + post.lastName}
                      </Typography>
                    </Box>
                  </FlexBetween>
                  <MoreVert />
                </FlexBetween>
              </Label>
              <img
                src={`${environment.backendUrl}/assets/${post.picturePath}?w=162&auto=format`}
                srcSet={`${environment.backendUrl}/assets/${post.picturePath}?w=162&auto=format&dpr=2 2x`}
                alt={`${environment.backendUrl}/assets/${post.picturePath}`}
                loading="lazy"
                style={{
                  display: "block",
                  width: "100%",
                }}
              />
              <Label theme={theme} islower="true">
                <Box padding="0.75rem">
                  <Typography
                    variant="h6"
                    color={theme.palette.neutral.dark}
                    sx={{
                      textAlign: "start",
                    }}
                  >
                    {post.description}
                  </Typography>
                </Box>
              </Label> */}
              <PostWidget post={post} isExploreFeed={true}></PostWidget>
            </div>
          ))}
        </Masonry>
      </Box>
      <ScrollToTop />
    </Box>
  );
};

const Label = styled(Paper)(({ theme, islower = "false" }) => ({
  backgroundColor: theme.palette.background.alt,
  ...theme.typography.body2,
  textAlign: "center",
  borderRadius: '0.5rem',
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: islower === "true" ? "" : 0,
  borderBottomRightRadius: islower === "true" ? "" : 0,
  borderTopLeftRadius: islower === "true" ? 0 : "",
  borderTopRightRadius: islower === "true" ? 0 : "",
}));

export default ExplorePage;
