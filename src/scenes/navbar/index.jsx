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
  Icon,
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
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = 'Divyam Mistry';
  // const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
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
          Media.Social
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="5px"
            gap="3rem"
            padding="0.2rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
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
