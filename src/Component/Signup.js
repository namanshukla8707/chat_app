import { Box } from "@mui/material";
import React, { useState } from "react";
import img from "../Images/appimage.svg";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: "",
    emailAddress: "",
    password: "",
  });

  const BASE_URL = "localhost:5000/";

  //   const [name,setName] = useState('');
  //   const [email,setEmail] = useState('');
  //   const [password,setPassword] = useState('');

  const [checked, setChecked] = React.useState(false);
  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailPattern.test(formData.emailAddress)) {
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
    if (!formData.userName) {
      alert("Enter the username");
      return;
    } else if (!validateEmail()) {
      alert("Enter the valid email");
      return;
    } else if (!validatePassword()) {
      alert("Enter valid password");
      return;
    }

    const response = await fetch(`${BASE_URL}/api/user`);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //   const handleChangeemail = ()=>{
  //     setEmail(e.target.value);
  //   }

  //   const handleChangename = ()=>{
  //     setName(e.target.value)
  //   }

  //   const handleChangepassword = ()=>{
  //     setPassword(e.target.value);
  //   }
  return (
    <div className="Container">
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
            // width: '65vw',
            borderRadius: 1,
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            mr: "2.5%",
            display: "flex",
            justifyContent: "center",
            width: "50%",
          }}
        >
          <div className="App" style={{ justifyContent: "center" }}>
            {/* <h1> It's Your Chit-Chat</h1> */}
            <div></div>
            <div>
              <TextField
                fullWidth
                size="small"
                sx={{ marginTop: "20px" }}
                label="Username "
                name="userName"
                onChange={handleChange}
              />
            </div>
            <div>
              <TextField
                fullWidth
                size="small"
                sx={{ marginTop: "8px" }}
                label="Email address "
                name="emailAddress"
                onChange={handleChange}
              />
            </div>
            <div>
              <TextField
                size="small"
                fullWidth
                label="Password"
                sx={{ marginTop: "8px", marginBottom: "10px" }}
                aria-orientation="vertical"
                type="password"
                name="password"
                onChange={handleChange}
              />
            </div>
            <div sx={{ marginTop: "10%" }}>
              <Button variant="contained" size=" Large" onClick={handleClick}>
                Submit
              </Button>
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
                height: "100%",
              }}
            >
              <label>
                <Checkbox
                  checked={checked}
                  onChange={handleCheckboxChange}
                  color="primary" // Change the color as needed
                  inputProps={{ "aria-label": "Checkbox" }}
                />
                Remember me
              </label>
            </Box>

            <div>
              Already a User
              <a href="/" style={{ marginLeft: "1%" }}>
                Sign in
              </a>
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default Signup;
