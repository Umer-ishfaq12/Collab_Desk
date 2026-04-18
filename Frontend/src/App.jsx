import { useState } from "react";
import "./App.css";
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
      </Router>
    </>
  );
}

export default App;
