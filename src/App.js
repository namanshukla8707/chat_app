import "./App.css";
<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Component/Signup";
import React from "react";
import Login from "./Component/Login";

=======
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Reducers/LoginSlice";
import Login from "./Component/Login";
const store = configureStore({
  reducer: {
    loggedInUser: authReducer,
  },
});
>>>>>>> master
function App() {
  const pageStyle = {
colour : 'red'

    // minHeight: '100vh'
  }
  return (
<<<<<<< HEAD
    <div style={{pageStyle}}>
   <BrowserRouter>
   <Routes>
    <Route path="/" element={ <Login></Login>}></Route>
    <Route path="/Signup" element={ <Signup></Signup>}></Route>
    </Routes>
    </BrowserRouter>
    </div>
  )
=======
    <Provider store={store}>
      <>
        <Login />
      </>
    </Provider>
  );
>>>>>>> master
}

export default App;
