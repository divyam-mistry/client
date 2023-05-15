import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const registerSchema = yup.object().shape({
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    password: yup.string().min(6, "Password should be greater than 6 characters").required("Required"),
    location: yup.string().required("Required"),
    occupation: yup.string().required("Required"),
    picture: yup.string().required("Required"),
});

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Required"),
    password: yup.string().min(6, "Password should be greater than 6 characters").required("Required"),
});

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
};
const initialValuesLogin = {
    email: "",
    password: "",
};

const Form = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = (pageType === "login");
    const isRegister = (pageType === "register");
  
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackbar(false);
    };

    const login = async (values, onSubmitProps) => {
        const loggedInUser = await fetch('http://localhost:3001/auth/login', {
            body: JSON.stringify(values),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resp = await loggedInUser.json();
        console.log(resp);
        onSubmitProps.resetForm();
        if(resp){
            if(resp.error) {
              setSnackbarMessage(resp.error);
              setOpenSnackbar(true);
              // alert(resp.error);
            }
            else { // success
                dispatch(setLogin({
                    user: resp.user,
                    token: resp.token,
                }));
                navigate('/home');
            }
            
        }
    };
    const register = async (values, onSubmitProps) => {
        const formData = new FormData();
        for(let value in values){
            formData.append(value, values[value]);
        }
        formData.append('picturePath', values.picture.name);

        const savedUser = await fetch('http://localhost:3001/auth/register', {
            body: formData,
            method: 'POST'
        });
        console.log(savedUser);
        const resp = await savedUser.json();
        console.log(resp);
        onSubmitProps.resetForm();
        if(resp){
            if(resp.error){ // error
              setSnackbarMessage(resp.error);
              setOpenSnackbar(true);
            }
            else setPageType('login');
        }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
    };

    return <Box display={isNonMobile ? 'flex' : 'block'} alignItems='center'>
      {isLogin && <img
          width={isNonMobile ? '40%' : '100%'}
          height={isNonMobile ? '40%' : '100%'}
          src='/assets/login.png'
      ></img>}
      <Box width={isLogin ? (isNonMobile ? '60%' : '100%') : '100%'} p='0 1rem'>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
          validationSchema={isLogin ? loginSchema : registerSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                {isRegister && (
                  <>
                    <TextField
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      error={
                        Boolean(touched.firstName) && Boolean(errors.firstName)
                      }
                      helperText={touched.firstName && errors.firstName}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Location"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.location}
                      name="location"
                      error={Boolean(touched.location) && Boolean(errors.location)}
                      helperText={touched.location && errors.location}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                      label="Occupation"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.occupation}
                      name="occupation"
                      error={
                        Boolean(touched.occupation) && Boolean(errors.occupation)
                      }
                      helperText={touched.occupation && errors.occupation}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <Box
                      gridColumn="span 4"
                      border={`1px solid ${palette.neutral.medium}`}
                      borderRadius="5px"
                      p="1rem"
                    >
                      <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) =>
                          setFieldValue("picture", acceptedFiles[0])
                        }
                      >
                        {({ getRootProps, getInputProps }) => (
                          <Box
                            {...getRootProps()}
                            border={`2px dashed ${palette.primary.main}`}
                            p="1rem"
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          >
                            <input {...getInputProps()} />
                            {!values.picture ? (
                              <p>Add Picture Here</p>
                            ) : (
                              <FlexBetween>
                                <Typography>{values.picture.name}</Typography>
                                <EditOutlinedIcon />
                              </FlexBetween>
                            )}
                          </Box>
                        )}
                      </Dropzone>
                    </Box>
                  </>
                )}
    
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end" mr='0.5rem'
                        >
                          {showPassword ? <VisibilityOff sx={{
                            color: 'grey'
                          }}/> : <Visibility sx={{
                            color: 'grey'
                          }}/>}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
    
              {/* BUTTONS */}
              <Box>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  {isLogin ? "LOGIN" : "REGISTER"}
                </Button>
                <Typography
                  onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                    resetForm();
                  }}
                  sx={{
                    width: '300px',
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up here."
                    : "Already have an account? Login here."}
                </Typography>
              </Box>

              <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ 
                    width: '100%', fontSize:'16px'
                  }}>
                  {snackbarMessage}
                </Alert>
              </Snackbar>

            </form>
          )}
        </Formik>
      </Box>
    </Box>;
}

export default Form;