import { Typography, useTheme, Box } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import environment from "env";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFriends } from "state";

const FriendsList = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
//   const [friends, setFriends] = useState([]);
  const { _id, friends } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const getFriends = async () => {
    const response = await fetch(`${environment.backendUrl}/users/${_id}/friends`,{
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    const userFriends = await response.json();
    // setFriends(userFriends);
    dispatch(setFriends({friends: userFriends}));
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <WidgetWrapper m='1.5rem 0'>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Your Friends
        </Typography>
      </FlexBetween>
      { friends.map((friend, index) => {
        return <Box key={index} m='1rem 0'>
            <Friend 
                friendId={friend._id}
                name={friend.firstName + ' ' + friend.lastName}
                subtitle={friend.location}
                userPicturePath={friend.picturePath}
            >
            </Friend>
        </Box>
      })}
    </WidgetWrapper>
  );
};

export default FriendsList;