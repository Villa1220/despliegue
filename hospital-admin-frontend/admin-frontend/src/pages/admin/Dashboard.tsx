import { Typography, Box } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {user?.name}
      </Typography>
      <Typography>
        Panel de administración del sistema hospitalario
      </Typography>
    </Box>
  )
}