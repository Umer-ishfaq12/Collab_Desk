import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left - Branding */}
        <div className="footer-brand">
          <h2>Collab Desk</h2>
          <p>Collaborate. Communicate. Get Things Done.</p>
        </div>

        {/* Middle - Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/SignUp">Sign Up</Link>
          <Link to="/Login">Login</Link>
          <Link to="/tasks">Tasks</Link>
        </div>

        {/* Right - Contact / Info */}
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: support@collabdesk.com</p>
          <p>Location: Remote Team</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Collab Desk. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;