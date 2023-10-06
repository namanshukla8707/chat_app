import "./App.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Reducers/LoginSlice";
import Login from "./Component/Login";
const store = configureStore({
  reducer: {
    loggedInUser: authReducer,
  },
});
function App() {
  return (
    <Provider store={store}>
      <>
        <Login />
      </>
    </Provider>
  );
}

export default App;
