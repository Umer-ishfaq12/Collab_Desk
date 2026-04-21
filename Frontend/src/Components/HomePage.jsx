import { Link, useNavigate } from 'react-router-dom';
import SignUp from "../Components/SignUp";

function HomePage() {
  return (
    <div className="home-container">
      <h1 className="title">Collab Desk</h1>
      <p className="subtitle">Collaborate. Communicate. Get Things Done.</p>

      <div className="home-actions">
        <button className="btn primary"><Nav.Link as={Link} to="/SignUp">Get Started</Nav.Link></button>
        <button className="btn secondary"><Nav.Link as={Link} to="/SignUp">View Tasks</Nav.Link></button>
      </div>

      {/* Image Slider */}
      <div className="slider-container">
        <div className="slider-track">
          <div className="slide">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200" alt="Team collaboration" />
            <div className="slide-caption">Work together, anywhere</div>
          </div>
          <div className="slide">
            <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200" alt="Task management" />
            <div className="slide-caption">Stay organized</div>
          </div>
          <div className="slide">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200" alt="Real-time chat" />
            <div className="slide-caption">Instant communication</div>
          </div>
        </div>
      </div>
      {/* Optional dots - you can add JavaScript to sync active dot */}
      <div className="slider-dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}
export default HomePage