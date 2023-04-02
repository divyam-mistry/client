import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";
import { Box, useMediaQuery, Modal, useTheme, Typography, Divider } from "@mui/material";
import { Masonry } from "@mui/lab";
import { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import ScrollToTop from "components/ScrollToTop";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import PostWidget from "scenes/widgets/PostWidget";
import environment from "env";
import FriendsList from "scenes/widgets/FriendsList";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const breakpoint1000 = useMediaQuery("(min-width: 1000px)");
  const breakpoint600 = useMediaQuery("(min-width: 600px)");
  const breakpoint375 = useMediaQuery("(min-width: 375px)");  
  const {userId} = useParams();
  const token = useSelector((state) => state.token);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getUserPosts = async () => {
    const response = await fetch(`${environment.backendUrl}/posts/${userId}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setPosts(data);
    const resp = await fetch(`${environment.backendUrl}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await resp.json();
    setUser(user);
  };

  useEffect(() => {
    console.log(userId);
    getUserPosts();
  }, []);

  const theme = useTheme();

  // style for modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // border: `2px solid #000`,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '5%'
  };

  return (
    <Box>
      <Navbar></Navbar>
      <Box
        width="100%"
        p="2rem 6%"
        display={breakpoint1000 ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={breakpoint1000 ? "26%" : undefined}>
          <UserWidget
            userId={userId}
            picturePath={user.picturePath}
            modalOpen={handleOpen}
          ></UserWidget>
        </Box>
        <Divider orientation="vertical" flexItem/>
        <Box flexBasis={breakpoint1000 ? "70%" : undefined}>
            <Typography 
                variant="h5"
                color={theme.palette.neutral.dark}
            > User Posts ({posts.length} posts)</Typography>
            <Masonry
            columns={2}
            spacing={3}
            >
            {posts.map((post, index) => (
                <div key={index}>
                <PostWidget post={post}></PostWidget>
                </div>
            ))}
            </Masonry>
        </Box>
      </Box>
      <ScrollToTop />
      {/* MODAL FOR PROFILE IMAGE */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box onClick={handleClose}>
            <Close fontSize="large" sx={{
              top: '5%', right: '5%', position: 'absolute', 
              color: theme.palette.neutral.dark
            }}></Close>
          </Box>
          <UserImage image={user.picturePath} size={
            breakpoint375 ? (
              breakpoint600 ? '500px' : '300px'
            ) : '200px'
          }></UserImage>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfilePage;
