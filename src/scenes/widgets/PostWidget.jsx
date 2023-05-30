import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({ post, isExploreFeed }) => {
  const likes = post.likes;
  const comments = post.comments;
  const name = post.firstName + " " + post.lastName;
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [isLiked, setIsLiked] = useState(
    Boolean(likes ? likes[loggedInUserId] : false)
  );
  const [likeCount, setLikeCount] = useState(
    likes ? Object.keys(likes).length : 0
  );

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${post._id}/like`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    const updatedLikes = updatedPost.likes;
    const updatedLikeCount = updatedLikes
      ? Object.keys(updatedLikes).length
      : 0;
    setIsLiked(updatedLikes && updatedLikes[loggedInUserId]);
    setLikeCount(updatedLikeCount);
  };

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleShowFullDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  let truncatedDescription = showFullDescription
  ? post.description
  : post.description.slice(0, 100);

  if(post.description.length > 100) {
    truncatedDescription += "...";
  }

  return (
    <WidgetWrapper m={isExploreFeed ? "0" : "1rem 0"}>
      <Friend
        friendId={post.userId}
        name={name}
        subtitle={post.location}
        userPicturePath={post.userPicturePath}
      />
      {post.picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${post.picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments ? comments.length : 0}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      <Typography
        color={main}
        sx={{
          mt: "1rem",
          cursor: "pointer",
          lineHeight: "1.5",
        }}
        onClick={toggleShowFullDescription}
      >
        {truncatedDescription}
        {post.description.length > 100 && (
        <Typography
          variant="body2"
          sx={{ color: primary, cursor: "pointer" }}
          onClick={toggleShowFullDescription}
        >
          {showFullDescription ? "Less" : "More"}
        </Typography>
      )}
      </Typography>

      {isComments && (
        <Box
          sx={{
            mt: "0.5rem",
            backgroundColor: palette.background.default,
            borderRadius: "1rem",
            p: "1rem 1rem 1rem 2rem",
          }}
        >
          COMMENTS
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              {/* <Divider /> */}
              <Typography sx={{ color: main, m: "0.5rem 0" }}>
                {comment}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
