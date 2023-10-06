<<<<<<< HEAD
import { Box } from "@mui/material";
import React, { useState } from "react";
import img from "../Images/appimage.svg";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

const Login = () => {
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const BASE_URL = "http://localhost:3000";

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailPattern.test(formData.email)) {
      return true;
    }
    return false;
  };

  const validatePassword = () => {
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
    if (passwordPattern.test(formData.password)) {
      return true;
    }
    return false;
  };

  const handleClick = async () => {
    if (!validateEmail()) {
      alert("Enter the valid email");
      return;
    } else if (!validatePassword()) {
      alert("Enter valid password");
      return;
    }
    login();
  };
  const login = async () => {
    const response = await fetch(`${BASE_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data);
  };

  // const response = await fetch(`${BASE_URL}/api/user`,)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box
        component={"img"}
        src={img}
        alt="The house from the offer."
        sx={{
          height: "100vh",
          borderRadius: 1,
          width: "50%",
          objectFit: "cover",
        }}
      ></Box>
      <Box sx={{ justifyContent: "center", display: "flex", width: "50%" }}>
        <Box
          className="App"
          sx={{
            justifyContent: "center",
            p: " 6% 3%",
            boxShadow: "2px 3px 4px 5px #dfdfdf",
          }}
        >
          <h1> It's Your Chit-Chat</h1>
          <Box></Box>

          <Box
            sx={{
              mr: "2.5%",
              ml: "2.5%",
            }}
          >
            <TextField
              fullWidth
              size="small"
              name="email"
              sx={{ marginTop: "20px" }}
              label="Username/Email address "
              onChange={handleChange}
            />
          </Box>
          <Box
            sx={{
              mr: "2.5%",
              ml: "2.5%",
            }}
          >
            <TextField
              size="small"
              fullWidth
              label="Password"
              name="password"
              aria-orientation="vertical"
              sx={{ marginTop: "8px", marginBottom: "8px" }}
              type="password"
              onChange={handleChange}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "95%",
              // height: "100%",
              mr: "2.5%",
              ml: "2.5%",
            }}
          >
            <label style={{ fontSize: "14px" }}>
              <Checkbox
                sx={{ m: "%", p: "0%", pb: "1%" }}
                checked={checked}
                size="small"
                onChange={handleCheckboxChange}
                color="primary" // Change the color as needed
                inputProps={{ "aria-label": "Checkbox" }}
              />
              Remember me
            </label>
            <a href="/" style={{ mr: "5%", fontSize: "14px" }}>
              Forgot Password?
            </a>
          </Box>
          <Box sx={{ mt: "6%" }}>
            <Button variant="contained" size=" Large" onClick={handleClick}>
              Login
            </Button>
          </Box>

          <Box className="container" sx={{ mb: "2.5%" }}>
            {/* <a href="/" style={{ marginLeft: "0.5%" }}>
              Forgot Password?
            </a> */}
          </Box>
          <Box className="container">
            Dont have an account?
            <a href="/Signup" style={{ marginLeft: "0.5%" }}>
              Sign Up
            </a>
          </Box>

          <Box className="container">
            <h4>
              -----------------------Or Continue with-----------------------
            </h4>
          </Box>

          <Button
            variant="outlined"
            style={{
              height: "35px",
            }}
            size="small"
            color="primary"
            startIcon={
              <Box>
                <img
                  src="https://pbs.twimg.com/profile_images/1605297940242669568/q8-vPggS_400x400.jpg"
                  alt="my image"
                  className="small-image"
                />
              </Box>
            }
          >
            Sign In with Google
          </Button>
        </Box>
        
      </Box>
    
    </Box>
=======
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "../Reducers/LoginSlice";
import Cookies from "js-cookie";
const Login = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [flag, setFlag] = useState(true); //true for login and false for logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: Cookies.get("token") }),
      });
      if (response.ok) {
        Cookies.remove("token");
        dispatch(logoutUser());
        setFlag(!flag);
      } else {
        // Handle logout error
      }
    } catch (error) {
      // Handle network error
    }
  };
  const handleLogin = async () => {
    try {
      // Make API call to login endpoint on the backend
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const userData = await response.json();
        Cookies.set("token", encodeURIComponent(userData.authToken), {
          expires: 5,
        });
        dispatch(loginUser(userData));
        setFlag(!flag);
      } else {
        // Handle login error
      }
    } catch (error) {
      // Handle network error
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      {flag ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
>>>>>>> master
  );
};

export default Login;
