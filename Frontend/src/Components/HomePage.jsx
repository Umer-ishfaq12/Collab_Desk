import { Link, useNavigate } from 'react-router-dom';
import SignUp from "../Components/SignUp";
import Footer from './Footer';

function HomePage() {
  return (
    <div className="home-container">
      <h1 className="title">Collab Desk</h1>
      <p className="subtitle">Collaborate. Communicate. Get Things Done.</p>

      <div className="home-actions">
        
<div className="home-actions">
  <Link to="/SignUp" className="btn primary">Get Started</Link>
  <Link to="/SignUp" className="btn secondary">View Tasks</Link>
</div>

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
      {/* FEATURES */}

      <div className="features">
  <div className="feature-card">
    <h3>Task Management</h3>
    <p>Create, assign and track tasks easily</p>
  </div>

  <div className="feature-card">
    <h3>Real-time Chat</h3>
    <p>Communicate instantly with your team</p>
  </div>

  <div className="feature-card">
    <h3>Team Collaboration</h3>
    <p>Work together efficiently</p>
  </div>
</div>

<div className="cta">
  <h2>Start collaborating today</h2>
  <p>Organize tasks, chat with your team, and boost productivity.</p>
  <Link to="/SignUp" className="btn primary">Get Started</Link>
</div>
    </div>
    
    
  );
}
export default HomePage