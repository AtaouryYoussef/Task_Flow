import { Button, Container, Navbar, Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import type { AppDispatch, RootState } from '../store';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function HeaderBS({ title, onMenuClick }: HeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.auth.user?.name);

  return (
    <Navbar bg="success" variant="dark" className="px-3">
      <Container fluid>
        <Button variant="outline-light" size="sm" onClick={onMenuClick}>
          ☰
        </Button>
        <Navbar.Brand className="ms-3 fw-bold">{title}</Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center gap-3">
          {userName && <span className="text-light">{userName}</span>}
          {userName && (
            <Button variant="outline-light" size="sm" onClick={() => dispatch(logout())}>
              Déconnexion
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}