import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from "axios"

function Login() {
  const [usernameS , setusernameS] = useState("");
  const [passwordS , setpasswordS] = useState("");
  const navigate = useNavigate();

const submitForm =async  (e) =>{
  e.preventDefault();
try {
  const response = await axios.post("http://localhost:3000/api/login",{
  username : usernameS,
  password : passwordS,
})

if(response.status == 200 || response.status == 201){
  const user = response.data.user;
  //For saving user info
    localStorage.setItem("user", JSON.stringify(user));
    console.log("Saved user in localStorage:", localStorage.getItem("user"));
alert("successfull login")
 // redirect based on role
        if (user.role === "admin" || user.role === "manager") {
          navigate("/Todo");
        } else {
          // navigate("/user/dashboard");
          navigate("/");
        }
}
} catch (error) {
  
}
}

  return (
    <div className="Form">
      <form action="" onSubmit={submitForm}>
      <input type="text" 
      placeholder='Username' 
      name='Username' 
      onChange={(e)=>{setusernameS(e.target.value)}} 
      value={usernameS}/>
      <br /><br />

      <input type="password" 
      placeholder='password' 
      name='password' 
      onChange={(e)=>{setpasswordS(e.target.value)}} 
      value={passwordS}/>
      <br /><br />

      <p>Do not have acoount <Link to="/SignUp">Sign up?</Link></p>
      <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default Login;