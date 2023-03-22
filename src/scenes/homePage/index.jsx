import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";
import { Box, useMediaQuery, Modal, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import ScrollToTop from "components/ScrollToTop";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import PostWidget from "scenes/widgets/PostWidget";
import environment from "env";
import FriendsList from "scenes/widgets/FriendsList";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  // const isNonMobileScreensBrkPt600 = useMediaQuery("(min-width: 600px)");
  const breakpoint600 = useMediaQuery("(min-width: 600px)");
  const breakpoint375 = useMediaQuery("(min-width: 375px)");  
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getAllPosts = async () => {
    const response = await fetch(environment.backendUrl + "/posts/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const resp = await fetch(`${environment.backendUrl}/users/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await resp.json();
    const filteredPosts = data.filter((post) => {
      return (post.userId === _id) || user.friends.includes(post.userId);
    });
    setPosts(filteredPosts);
  };

  useEffect(() => {
    getAllPosts();
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
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget
            userId={_id}
            picturePath={picturePath}
            modalOpen={handleOpen}
          ></UserWidget>
        </Box>
        <Box flexBasis={isNonMobileScreens ? "42%" : undefined}>
          <MyPostWidget picturePath={picturePath} updatePosts={setPosts}></MyPostWidget>
          {posts.map((post, index) => (
            <div key={index}>
              <PostWidget post={post}></PostWidget>
            </div>
          ))}
        </Box>
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <AdvertWidget />
          <FriendsList />
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
          <UserImage image={picturePath} size={
            breakpoint375 ? (
              breakpoint600 ? '500px' : '300px'
            ) : '200px'
          }></UserImage>
        </Box>
      </Modal>
    </Box>
  );
};

export default HomePage;
