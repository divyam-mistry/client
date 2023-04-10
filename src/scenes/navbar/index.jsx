import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Popover,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  ExitToApp,
  MovingOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import environment from "env";
import UserImage from "components/UserImage";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [userList, setUserList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user, token} = useSelector((state) => state);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const main = theme.palette.neutral.main;
  const medium = theme.palette.neutral.medium;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const searchUsers = async (event) => {
    const query = event.target.value;
    const resp = await fetch(`${environment.backendUrl}/users/search?query=${query}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const users = await resp.json();
    setUserList(users);
    console.log(users);
    setAnchorEl(event.target);
  }

  // const fullName = 'Divyam Mistry';
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Box display='flex' gap='0.5rem'>
          <img
            src='../assets/logo-rmbg.png'
            alt='ChatPrat'
            style={{
              height: '50px',
              width: "50px",
            }}
          />
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            PixelChat
          </Typography>
        </Box>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="5px"
            gap="3rem"
            padding="0.2rem 1.5rem"
          >
            <InputBase placeholder="Search..." onChange={(e) => {
              searchUsers(e);
            }}/>
            <IconButton>
              <Search />
            </IconButton>
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
              sx={{mt: '1.5rem', ml: '-1.5rem', maxWidth: true}}
            >
              {userList.map((result, index) => (
                <Box onClick={() => {
                  navigate(`/profile/${result._id}`);
                  navigate(0);
                }} key={index} m='0.5rem 0'>
                  <FlexBetween m='0.75rem 0' p='0 1rem' gap='3.5rem'>
                    <FlexBetween gap="1rem" sx={{
                      "&:hover": {
                        color: theme.palette.primary.light,
                      },
                    }}>
                      <UserImage image={result.picturePath} size="40px" />
                      <Box>
                        <Typography
                          color={main}
                          variant="h5"
                          fontWeight="500"
                        >
                          {result.fullName}
                        </Typography>
                        <Typography color={medium} fontSize="0.75rem">
                          {result.location}
                        </Typography>
                      </Box>
                    </FlexBetween>
                    <MovingOutlined />
                  </FlexBetween>
                </Box>
              ))}
          </Popover>

          </FlexBetween>
        )}
      </FlexBetween>
      {/* Desktop NAV */}
      { isNonMobileScreens 
        ? <FlexBetween gap="0.5rem">
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === 'light' 
              ? <LightMode sx={{fontSize: '25px'}}/> 
              : <DarkMode sx={{fontSize: '25px'}}/>}
            </IconButton>
            <IconButton onClick={() => navigate('/chat')}>
              <Message sx={{fontSize: '25px'}}/>
            </IconButton>
            <IconButton>
              <Notifications sx={{fontSize: '25px'}}/>
            </IconButton>
            <IconButton>
              <Help sx={{fontSize: '25px'}}/>
            </IconButton>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.1rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  <Typography>Log Out </Typography>
                  <Box display="flex" justifyContent="flex-end" pl='3rem'>
                    <ExitToApp color={neutralLight}/>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween> 
        : <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
            <Menu />
          </IconButton>
      }

      {/* Mobile NAV */}
      { !isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={primaryLight}
        >
          {/* Close icon */}
          <Box display="flex" justifyContent="flex-end" p='1rem'>
            <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
              <Close />
            </IconButton>
          </Box>

          {/* menu items */}
          <FlexBetween 
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            gap="3rem"
          >
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === 'light' 
              ? <LightMode sx={{fontSize: '25px'}}/> 
              : <DarkMode sx={{fontSize: '25px'}}/>}
            </IconButton>
            <IconButton>
              <Message sx={{fontSize: '25px'}}/>
            </IconButton>
            <IconButton>
              <Notifications sx={{fontSize: '25px'}}/>
            </IconButton>
            <IconButton>
              <Help sx={{fontSize: '25px'}}/>
            </IconButton>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.1rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  <Typography>Log Out </Typography>
                  <Box display="flex" justifyContent="flex-end" pl='3rem'>
                    <ExitToApp color={neutralLight}/>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween> 
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
