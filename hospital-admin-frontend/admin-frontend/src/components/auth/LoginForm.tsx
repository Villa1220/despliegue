
// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  TextField, 
  Button, 
  Box, 
  Typography,
  Paper,
  CssBaseline,
  Avatar,
  Link,
  Fade
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { ThemeProvider } from '@mui/material/styles';
import { hospitalTheme } from './theme';
import { 
  pageStyles,
  containerStyles,
  headerStyles,
  medicalIconStyles,
  titleStyles,
  paperStyles,
  avatarStyles,
  formTitleStyles,
  formSubtitleStyles,
  errorStyles,
  linkStyles,
  submitButtonStyles,
  footerStyles,
  versionStyles
} from './LoginForm.styles';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Credenciales incorrectas. Use admin@gmail.com o doctor@gmail.com con cualquier contraseña.');
      }
    } catch (err) {
      setError('Ocurrió un error al intentar iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={hospitalTheme}>
      <Box sx={pageStyles}>
        <CssBaseline />
        <Fade in={true} timeout={800}>
          <Box sx={containerStyles}>
            <Box sx={headerStyles}>
              <MedicalServicesIcon sx={medicalIconStyles} />
              <Typography variant="h4" component="h1" sx={titleStyles}>
                MEDICITY
              </Typography>
            </Box>
            
            <Paper elevation={0} sx={paperStyles}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar sx={avatarStyles}>
                  <LockOutlinedIcon fontSize="medium" sx={{ color: 'primary.main' }} />
                </Avatar>
                <Typography variant="h5" component="h2" sx={formTitleStyles}>
                  Acceso al Sistema
                </Typography>
                <Typography variant="body2" sx={formSubtitleStyles}>
                  Ingrese sus credenciales para acceder al portal médico
                </Typography>
              </Box>
              
              {error && (
                <Box sx={errorStyles}>
                  <Typography color="error" align="center" variant="body2" sx={{ fontWeight: 500 }}>
                    {error}
                  </Typography>
                </Box>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    style: { borderRadius: 12 }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 1 }}
                  InputProps={{
                    style: { borderRadius: 12 }
                  }}
                />
                <Box sx={{ textAlign: 'right', mb: 3 }}>
                  <Link href="#" variant="body2" sx={linkStyles}>
                    ¿Olvidó su contraseña?
                  </Link>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={submitButtonStyles}
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar al Sistema'}
                </Button>
              </Box>
            </Paper>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={footerStyles}>
                © {new Date().getFullYear()} MEDICITY
              </Typography>
              <Typography variant="body2" sx={versionStyles}>
                Sistema de Gestión Hospitalaria v2.4.1
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}
