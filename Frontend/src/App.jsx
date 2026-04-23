import { useState } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
// import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Todo from "./Components/TodoList";
import HomePage from "./Components/HomePage";
import NavBar from "./Components/NavBar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import { Navigate } from "react-router-dom";
import TaskChat from "./Components/TaskChat";
import Team from "./Components/Team"
import Footer from "./Components/Footer";
function App() {
  const RequireAuth = ({ children, roles }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return <Navigate to="/Login" />;
    }

    if (roles && !roles.includes(user.role)) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <>
     <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          {/* protected Rotes */}
          <Route
            path="/Todo"
            element={
              <RequireAuth roles={["admin", "manager"]}>
                <Todo />
              </RequireAuth>
            }
          />
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/SignUp" element={<SignUp />}></Route>
          <Route path="/chat" element={<TaskChat />}></Route>
          <Route path="/team" element={<Team />}></Route>
        </Routes>
        <Footer/>
      </Router>
    </>
  );
}

export default App;
