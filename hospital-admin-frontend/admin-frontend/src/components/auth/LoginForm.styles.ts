import { SxProps, Theme } from '@mui/material/styles';

export const pageStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f5f5f5',
  p: 2,
};

export const containerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export const headerStyles: SxProps<Theme> = {
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  mb: 4,
  gap: 2
};

export const medicalIconStyles: SxProps<Theme> = (theme) => ({
  fontSize: 42,
  color: theme.palette.primary.dark
});

export const titleStyles: SxProps<Theme> = (theme) => ({
  fontWeight: 700,
  color: theme.palette.primary.dark,
  letterSpacing: '1px'
});

export const paperStyles: SxProps<Theme> = (theme) => ({
  p: { xs: 3, sm: 5 },
  width: '100%',
  maxWidth: 500,
  background: 'white',
  borderRadius: 4,
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.03)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }
});

export const avatarStyles: SxProps<Theme> = (theme) => ({
  m: '0 auto 16px', 
  bgcolor: 'transparent',
  width: 60,
  height: 60,
  border: `2px solid ${theme.palette.primary.light}`,
});

export const formTitleStyles: SxProps<Theme> = (theme) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  mb: 1
});

export const formSubtitleStyles: SxProps<Theme> = (theme) => ({
  color: theme.palette.text.secondary,
  maxWidth: 400,
  mx: 'auto'
});

export const errorStyles: SxProps<Theme> = {
  mb: 3,
  p: 2,
  backgroundColor: 'rgba(220, 53, 69, 0.1)',
  borderRadius: 2,
  borderLeft: '4px solid #dc3545',
};

export const linkStyles: SxProps<Theme> = (theme) => ({
  textDecoration: 'none',
  color: theme.palette.primary.dark,
  '&:hover': {
    textDecoration: 'underline',
  }
});

export const submitButtonStyles: SxProps<Theme> = (theme) => ({
  py: 1.5,
  borderRadius: 12,
  fontSize: '1rem',
  fontWeight: 500,
  letterSpacing: '0.5px',
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: '0 4px 14px rgba(0, 87, 146, 0.2)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 87, 146, 0.3)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&.Mui-disabled': {
    background: '#e0e0e0',
  }
});

export const footerStyles: SxProps<Theme> = (theme) => ({
  color: theme.palette.text.secondary,
  mb: 1
});

export const versionStyles: SxProps<Theme> = (theme) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
});