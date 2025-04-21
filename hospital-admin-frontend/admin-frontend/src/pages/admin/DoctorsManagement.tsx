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

// Interface for doctor data
interface Doctor {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: { id: number; nombre: string };
  centroMedico: { id: number; nombre: string };
}

// Sample local doctor data
const localDoctors: Doctor[] = [
  {
    id: 'M001',
    nombre: 'Juan',
    apellido: 'Pérez',
    especialidad: { id: 1, nombre: 'Cardiología' },
    centroMedico: { id: 1, nombre: 'Clínica Central' },
  },
  {
    id: 'M002',
    nombre: 'María',
    apellido: 'Gómez',
    especialidad: { id: 2, nombre: 'Neurología' },
    centroMedico: { id: 2, nombre: 'Hospital Norte' },
  },
  {
    id: 'M003',
    nombre: 'Carlos',
    apellido: 'López',
    especialidad: { id: 3, nombre: 'Pediatría' },
    centroMedico: { id: 1, nombre: 'Clínica Central' },
  },
  {
    id: 'M004',
    nombre: 'Ana',
    apellido: 'Martínez',
    especialidad: { id: 4, nombre: 'Ortopedia' },
    centroMedico: { id: 3, nombre: 'Centro Médico Sur' },
  },
  {
    id: 'M005',
    nombre: 'Elena',
    apellido: 'Sánchez',
    especialidad: { id: 5, nombre: 'Dermatología' },
    centroMedico: { id: 4, nombre: 'Sanatorio Este' },
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

export default function DoctorsManagement() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>(localDoctors);
  const [searchId, setSearchId] = useState('');
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    especialidad_id: '',
    centro_medico_id: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Initialize doctors on component mount
  useEffect(() => {
    setDoctors(localDoctors);
  }, []);

  // Search doctor by ID
  const handleSearch = () => {
    if (!searchId) {
      setDoctors(localDoctors);
      setPage(0); // Reset to first page on search
      return;
    }
    const filtered = localDoctors.filter((doctor) => doctor.id === searchId);
    setDoctors(filtered);
    setPage(0); // Reset to first page on search
  };

  // Open add dialog
  const handleOpenAdd = () => {
    setFormData({
      id: '',
      nombre: '',
      apellido: '',
      especialidad_id: '',
      centro_medico_id: '',
    });
    setOpenAddDialog(true);
  };

  // Add new doctor
  const handleAdd = () => {
    if (
      !formData.id.trim() ||
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.especialidad_id ||
      !formData.centro_medico_id
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }
    const especialidadId = parseInt(formData.especialidad_id);
    const centroMedicoId = parseInt(formData.centro_medico_id);
    const newDoctor: Doctor = {
      id: formData.id,
      nombre: formData.nombre,
      apellido: formData.apellido,
      especialidad: { id: especialidadId, nombre: 'Unknown' }, // Placeholder
      centroMedico: { id: centroMedicoId, nombre: 'Unknown' }, // Placeholder
    };
    setDoctors([...doctors, newDoctor]);
    setOpenAddDialog(false);
    setFormData({
      id: '',
      nombre: '',
      apellido: '',
      especialidad_id: '',
      centro_medico_id: '',
    });
    setPage(0); // Reset to first page on add
  };

  // Open edit dialog
  const handleEdit = (doctor: Doctor) => {
    setEditDoctor(doctor);
    setFormData({
      id: doctor.id,
      nombre: doctor.nombre,
      apellido: doctor.apellido,
      especialidad_id: doctor.especialidad.id.toString(),
      centro_medico_id: doctor.centroMedico.id.toString(),
    });
    setOpenEditDialog(true);
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save edited doctor
  const handleSave = () => {
    if (!editDoctor) return;
    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.especialidad_id ||
      !formData.centro_medico_id
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }
    const especialidadId = parseInt(formData.especialidad_id);
    const centroMedicoId = parseInt(formData.centro_medico_id);
    const updatedDoctor = {
      ...editDoctor,
      nombre: formData.nombre,
      apellido: formData.apellido,
      especialidad: { ...editDoctor.especialidad, id: especialidadId },
      centroMedico: { ...editDoctor.centroMedico, id: centroMedicoId },
    };
    const updatedDoctors = doctors.map((doc) =>
      doc.id === editDoctor.id ? updatedDoctor : doc
    );
    setDoctors(updatedDoctors);
    setOpenEditDialog(false);
    setPage(0); // Reset to first page on edit
  };

  // Open delete confirmation dialog
  const handleDelete = (id: string) => {
    setDoctorToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (doctorToDelete === null) return;
    const updatedDoctors = doctors.filter((doc) => doc.id !== doctorToDelete);
    setDoctors(updatedDoctors);
    setOpenDeleteDialog(false);
    setDoctorToDelete(null);
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
  const paginatedDoctors = doctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <StyledTypography variant="h4" gutterBottom>
        Gestión de Médicos
      </StyledTypography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Bienvenido, {user?.name}. Administra los médicos del sistema con facilidad.
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
            setDoctors(localDoctors);
            setPage(0); // Reset pagination on clear
          }}
        >
          Limpiar
        </StyledButton>
        <StyledButton variant="contained" color="success" onClick={handleOpenAdd}>
          <Add /> Nuevo Médico
        </StyledButton>
      </Box>

      {/* Doctors Table */}
      <Paper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Apellido</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  Especialidad
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  Centro Médico
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDoctors.length > 0 ? (
                paginatedDoctors.map((doctor) => (
                  <StyledTableRow key={doctor.id}>
                    <TableCell>{doctor.id}</TableCell>
                    <TableCell>{doctor.nombre}</TableCell>
                    <TableCell>{doctor.apellido}</TableCell>
                    <TableCell>{doctor.especialidad.nombre}</TableCell>
                    <TableCell>{doctor.centroMedico.nombre}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(doctor)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(doctor.id)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron médicos
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
        count={doctors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => handleChangePage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />

      {/* Add Dialog */}
      <StyledDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Nuevo Médico</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID"
            name="id"
            value={formData.id}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="ID Especialidad"
            name="especialidad_id"
            value={formData.especialidad_id}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            type="number"
          />
          <TextField
            margin="dense"
            label="ID Centro Médico"
            name="centro_medico_id"
            value={formData.centro_medico_id}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            type="number"
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
        <DialogTitle>Editar Médico</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID"
            name="id"
            value={formData.id}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            disabled
          />
          <TextField
            margin="dense"
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="ID Especialidad"
            name="especialidad_id"
            value={formData.especialidad_id}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            type="number"
          />
          <TextField
            margin="dense"
            label="ID Centro Médico"
            name="centro_medico_id"
            value={formData.centro_medico_id}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            type="number"
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
          <Typography>¿Estás seguro de que quieres eliminar este médico?</Typography>
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
