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
  );
};

export default Login;
