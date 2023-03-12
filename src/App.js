import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import ExplorePage from "scenes/explorePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {createTheme} from "@mui/material/styles";
import { themeSettings } from "theme";

function App() {
  const mode = useSelector((state) => state.mode);
  // useMemo hook used to memoize theme variable
  const theme = useMemo(() => 
    createTheme(themeSettings(mode)), [mode] 
  );
  // [mode] -> dependency array
  // The function will only run when dependencies have changed.
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />}></Route>
            <Route path="/home" element={
              isAuth ? <HomePage /> : <Navigate to='/' />
            }></Route>
            <Route path="/explore" element={
              isAuth ? <ExplorePage /> : <Navigate to='/' />
            }></Route>
            <Route path="/profile/:userId" element={
              isAuth ? <ProfilePage /> : <Navigate to='/' />
            }></Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
