import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Component/Signup";
import React from "react";
import Login from "./Component/Login";

function App() {
  const pageStyle = {
colour : 'red'

    // minHeight: '100vh'
  }
  return (
    <div style={{pageStyle}}>
   <BrowserRouter>
   <Routes>
    <Route path="/" element={ <Login></Login>}></Route>
    <Route path="/Signup" element={ <Signup></Signup>}></Route>
    </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App;
