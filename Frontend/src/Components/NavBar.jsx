


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

  return (
    // <Navbar expand="lg"  className="shadow-sm">
    <Navbar expand="lg" className="custom-navbar shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">Collab Desk</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center gap-3">

            {/* Common Links */}
            <Nav.Link as={Link} to="/">Home</Nav.Link>

            {/* Only logged-in users */}
            {user && (
              <Nav.Link as={Link} to="/Team">Team</Nav.Link>
            )}

              {user && (
              <Nav.Link as={Link} to="/chat">task chat </Nav.Link>
            )}

            {/* Admin / Manager only */}
            {user && (user.role === "admin" || user.role === "manager") && (
              <NavDropdown title="Tasks" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/Todo">
                  All Tasks
                </NavDropdown.Item>
                <NavDropdown.Item>
                  Pending Tasks
                </NavDropdown.Item>
                <NavDropdown.Item>
                  Completed Tasks
                </NavDropdown.Item>
              </NavDropdown>
            )}

          </Nav>

          {/* Right side */}
          <Nav className="align-items-center gap-3">

            {!user ? (
              <>
                <Nav.Link as={Link} to="/Login">Login</Nav.Link>
                <Nav.Link as={Link} to="/SignUp">Signup</Nav.Link>
              </>
            ) : (
              <>
                <span className="fw-bold text-capitalize">
                  {user.role}
                </span>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}

          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;