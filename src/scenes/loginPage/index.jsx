import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import environment from "env";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Box
        width="100%"
        textAlign="center"
        p="1rem 6%"
        backgroundColor={theme.palette.background.alt}
        display='flex'
        justifyContent='center'
        gap='0.5rem'
      >
        <img
          src='../assets/logo-rmbg.png'
          alt='PixelChat'
          style={{
            height: '50px',
            width: "50px",
          }}
        />
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          PixelChat
        </Typography>
      </Box>
      <Box
        width={ isNonMobileScreens ? '70%' : '90%'}
        backgroundColor={theme.palette.background.alt}
        p='2rem'
        m='2rem auto'
        borderRadius='1.5rem'
      >
        {/* <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem'}}>
        </Typography> */}
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
