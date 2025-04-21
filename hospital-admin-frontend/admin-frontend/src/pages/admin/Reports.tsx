// src/pages/admin/Reports.tsx
import { Typography, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function Reports() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reportes del Sistema
      </Typography>
      <Typography>
        Bienvenido, {user?.name}. Aquí puedes generar y visualizar reportes del sistema.
      </Typography>
    </Box>
  );
}