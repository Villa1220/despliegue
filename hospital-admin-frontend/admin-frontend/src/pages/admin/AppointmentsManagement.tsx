import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  styled,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Interface for appointment data
interface Appointment {
  id: number;
  paciente_nombre: string;
  paciente_apellido: string;
  fecha: string; // ISO date string (e.g., "2025-04-20T10:00:00Z")
  motivo: string;
  medico_id: string;
}

// Sample local appointment data
const localAppointments: Appointment[] = [
  {
    id: 1,
    paciente_nombre: 'Laura',
    paciente_apellido: 'Rodríguez',
    fecha: '2025-04-20T10:00:00Z',
    motivo: 'Consulta general',
    medico_id: 'E001',
  },
  {
    id: 2,
    paciente_nombre: 'Miguel',
    paciente_apellido: 'Sánchez',
    fecha: '2025-04-21T14:30:00Z',
    motivo: 'Dolor torácico',
    medico_id: 'E001',
  },
  {
    id: 3,
    paciente_nombre: 'Sofía',
    paciente_apellido: 'López',
    fecha: '2025-04-22T09:00:00Z',
    motivo: 'Control pediátrico',
    medico_id: 'E002',
  },
  {
    id: 4,
    paciente_nombre: 'Diego',
    paciente_apellido: 'Gómez',
    fecha: '2025-04-23T11:15:00Z',
    motivo: 'Lesión en rodilla',
    medico_id: 'E003',
  },
  {
    id: 5,
    paciente_nombre: 'Elena',
    paciente_apellido: 'Martínez',
    fecha: '2025-04-24T16:00:00Z',
    motivo: 'Problemas dermatológicos',
    medico_id: 'E004',
  },
];

// Styled components for elegant design
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: 'background-color 0.2s ease-in-out',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.dark,
}));

export default function AppointmentsManagement() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(localAppointments);
  const [searchId, setSearchId] = useState('');
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    paciente_nombre: '',
    paciente_apellido: '',
    fecha: '',
    motivo: '',
    medico_id: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Initialize appointments on component mount
  useEffect(() => {
    setAppointments(localAppointments);
  }, []);

  // Search appointment by ID
  const handleSearch = () => {
    if (!searchId) {
      setAppointments(localAppointments);
      setPage(0); // Reset to first page on search
      return;
    }
    const filtered = localAppointments.filter((appointment) =>
      appointment.id.toString() === searchId
    );
    setAppointments(filtered);
    setPage(0); // Reset to first page on search
  };

  // Open add dialog
  const handleOpenAdd = () => {
    setFormData({
      paciente_nombre: '',
      paciente_apellido: '',
      fecha: '',
      motivo: '',
      medico_id: '',
    });
    setOpenAddDialog(true);
  };

  // Add new appointment
  const handleAdd = () => {
    if (
      !formData.paciente_nombre.trim() ||
      !formData.paciente_apellido.trim() ||
      !formData.fecha.trim() ||
      !formData.motivo.trim() ||
      !formData.medico_id.trim()
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }
    // Basic date format validation
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(formData.fecha)) {
      alert('La fecha debe estar en formato ISO (ej. 2025-04-20T10:00:00Z)');
      return;
    }
    const newAppointment: Appointment = {
      id: appointments.length ? Math.max(...appointments.map((a) => a.id)) + 1 : 1,
      paciente_nombre: formData.paciente_nombre,
      paciente_apellido: formData.paciente_apellido,
      fecha: formData.fecha,
      motivo: formData.motivo,
      medico_id: formData.medico_id,
    };
    setAppointments([...appointments, newAppointment]);
    setOpenAddDialog(false);
    setFormData({
      paciente_nombre: '',
      paciente_apellido: '',
      fecha: '',
      motivo: '',
      medico_id: '',
    });
    setPage(0); // Reset to first page on add
  };

  // Open edit dialog
  const handleEdit = (appointment: Appointment) => {
    setEditAppointment(appointment);
    setFormData({
      paciente_nombre: appointment.paciente_nombre,
      paciente_apellido: appointment.paciente_apellido,
      fecha: appointment.fecha,
      motivo: appointment.motivo,
      medico_id: appointment.medico_id,
    });
    setOpenEditDialog(true);
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save edited appointment
  const handleSave = () => {
    if (!editAppointment) return;
    if (
      !formData.paciente_nombre.trim() ||
      !formData.paciente_apellido.trim() ||
      !formData.fecha.trim() ||
      !formData.motivo.trim() ||
      !formData.medico_id.trim()
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }
    // Basic date format validation
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(formData.fecha)) {
      alert('La fecha debe estar en formato ISO (ej. 2025-04-20T10:00:00Z)');
      return;
    }
    const updatedAppointment = {
      ...editAppointment,
      paciente_nombre: formData.paciente_nombre,
      paciente_apellido: formData.paciente_apellido,
      fecha: formData.fecha,
      motivo: formData.motivo,
      medico_id: formData.medico_id,
    };
    const updatedAppointments = appointments.map((appt) =>
      appt.id === editAppointment.id ? updatedAppointment : appt
    );
    setAppointments(updatedAppointments);
    setOpenEditDialog(false);
    setPage(0); // Reset to first page on edit
  };

  // Open delete confirmation dialog
  const handleDelete = (id: number) => {
    setAppointmentToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (appointmentToDelete === null) return;
    const updatedAppointments = appointments.filter(
      (appt) => appt.id !== appointmentToDelete
    );
    setAppointments(updatedAppointments);
    setOpenDeleteDialog(false);
    setAppointmentToDelete(null);
    setPage(0); // Reset to first page on delete
  };

  // Handle pagination
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  // Calculate paginated data
  const paginatedAppointments = appointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <StyledTypography variant="h4" gutterBottom>
        Gestión de Consultas
      </StyledTypography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Bienvenido, {user?.name}. Administra las consultas médicas del sistema con facilidad.
      </Typography>

      {/* Search Bar */}
      <Box display="flex" gap={2} mb={4} alignItems="center">
        <TextField
          label="Buscar por ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flex: 1, maxWidth: '400px' }}
        />
        <StyledButton variant="contained" color="primary" onClick={handleSearch}>
          Buscar
        </StyledButton>
        <StyledButton
          variant="outlined"
          color="secondary"
          onClick={() => {
            setSearchId('');
            setAppointments(localAppointments);
            setPage(0); // Reset pagination on clear
          }}
        >
          Limpiar
        </StyledButton>
        <StyledButton variant="contained" color="success" onClick={handleOpenAdd}>
          <Add /> Nueva Consulta
        </StyledButton>
      </Box>

      {/* Appointments Table */}
      <Paper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  Nombre Paciente
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  Apellido Paciente
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Motivo</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  ID Médico
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAppointments.length > 0 ? (
                paginatedAppointments.map((appointment) => (
                  <StyledTableRow key={appointment.id}>
                    <TableCell>{appointment.id}</TableCell>
                    <TableCell>{appointment.paciente_nombre}</TableCell>
                    <TableCell>{appointment.paciente_apellido}</TableCell>
                    <TableCell>{new Date(appointment.fecha).toLocaleString()}</TableCell>
                    <TableCell>{appointment.motivo}</TableCell>
                    <TableCell>{appointment.medico_id}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(appointment)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(appointment.id)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No se encontraron consultas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={appointments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => handleChangePage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />

      {/* Add Dialog */}
      <StyledDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Nueva Consulta</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre Paciente"
            name="paciente_nombre"
            value={formData.paciente_nombre}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Apellido Paciente"
            name="paciente_apellido"
            value={formData.paciente_apellido}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Fecha (ISO: YYYY-MM-DDThh:mm:ssZ)"
            name="fecha"
            value={formData.fecha}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            placeholder="2025-04-20T10:00:00Z"
          />
          <TextField
            margin="dense"
            label="Motivo"
            name="motivo"
            value={formData.motivo}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="ID Médico"
            name="medico_id"
            value={formData.medico_id}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setOpenAddDialog(false)} color="secondary">
            Cancelar
          </StyledButton>
          <StyledButton onClick={handleAdd} variant="contained" color="primary">
            Guardar
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Edit Dialog */}
      <StyledDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Consulta</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre Paciente"
            name="paciente_nombre"
            value={formData.paciente_nombre}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Apellido Paciente"
            name="paciente_apellido"
            value={formData.paciente_apellido}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Fecha (ISO: YYYY-MM-DDThh:mm:ssZ)"
            name="fecha"
            value={formData.fecha}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            placeholder="2025-04-20T10:00:00Z"
          />
          <TextField
            margin="dense"
            label="Motivo"
            name="motivo"
            value={formData.motivo}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="ID Médico"
            name="medico_id"
            value={formData.medico_id}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancelar
          </StyledButton>
          <StyledButton onClick={handleSave} variant="contained" color="primary">
            Guardar
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Delete Confirmation Dialog */}
      <StyledDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar esta consulta?</Typography>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancelar
          </StyledButton>
          <StyledButton onClick={confirmDelete} variant="contained" color="error">
            Eliminar
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
}
