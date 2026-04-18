import axios from "axios";
import { useEffect, useState } from "react";
function Team() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="team-container">
      <h2>Team Members</h2>

      <div className="team-grid">
        {users.map((user) => (
          <div key={user._id} className="team-card">
            
            <div className="avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <h4>{user.username}</h4>
            <p>{user.email}</p>
            <span className="role">{user.role}</span>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Team