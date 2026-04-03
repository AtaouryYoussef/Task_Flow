import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import type { AppDispatch, RootState } from '../store';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function HeaderMUI({ title, onMenuClick }: HeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.auth.user?.name);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1B8C3E' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {userName && <Typography variant="body2">{userName}</Typography>}
          {userName && (
            <Button
              color="inherit"
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => dispatch(logout())}
            >
              Déconnexion
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}