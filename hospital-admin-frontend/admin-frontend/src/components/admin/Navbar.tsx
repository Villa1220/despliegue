// src/components/admin/Navbar.tsx
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { 
  appBarStyles,
  toolbarStyles,
  menuButtonStyles,
  titleStyles,
  userBoxStyles,
  avatarStyles,
  userInfoStyles,
  userNameStyles,
  userRoleStyles,
  logoutButtonStyles
} from './Navbar.styles';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <AppBar position="fixed" sx={appBarStyles}>
      <Toolbar sx={toolbarStyles}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={menuButtonStyles}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={titleStyles}>
          <MedicalServicesIcon fontSize="medium" />
          MEDICITY
        </Typography>

        {user && (
          <Box sx={userBoxStyles}>
            <Avatar sx={avatarStyles}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={userInfoStyles}>
              <Typography variant="subtitle2" sx={userNameStyles}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={userRoleStyles}>
                {user.role === 'admin' ? 'Administrador' : user.role === 'doctor' ? 'Médico' : 'Usuario'}
              </Typography>
            </Box>

            <IconButton
              color="inherit"
              aria-label="logout"
              onClick={logout}
              sx={logoutButtonStyles}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}