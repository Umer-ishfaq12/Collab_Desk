import { useState } from "react";
import axios1 from "../config/axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "axios";
function SignUp() {
  const navigate = useNavigate();
  const [usernameS, setusername] = useState("");
  const [emailS, setemail] = useState("");
  const [passwordS, setpassword] = useState("");

  const SubmitForm = async (event) => {
    event.preventDefault();
    try {
      const response = await axios1.post("/api/signup", {
        username: usernameS,
        email: emailS,
        password: passwordS,
      });
      if (response.status == 201 || response.status == 200) {
        toast.success("Accounts is created successfully");
        navigate("/login");

      } else {
        toast.error(
          "Registration failed: " + (response.data.message || "Unknown error"),
        );
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    }
  };
  return (
    <div className="Form">
      <form action="" onSubmit={SubmitForm}>
        <input
          type="text"
          placeholder="Username"
          name="Username"
          onChange={(e) => setusername(e.target.value)}
          value={usernameS}
        />
        <br />
        <br />

        <input
          type="text"
          placeholder="Email"
          name="Email"
          onChange={(e) => setemail(e.target.value)}
          value={emailS}
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="password"
          name="password"
          onChange={(e) => setpassword(e.target.value)}
          value={passwordS}
        />
        <br />
        <br />

        <p>
          Already have acoount <Link to="/SignUp">Login?</Link>
        </p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SignUp;
