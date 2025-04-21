// src/pages/admin/MedicalCentersManagement.tsx
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
  styled,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Interface for medical center data
interface MedicalCenter {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
}

// Sample local medical center data
const localMedicalCenters: MedicalCenter[] = [
  {
    id: 1,
    nombre: 'Clínica Central',
    direccion: 'Av. Principal 123, Ciudad',
    telefono: '555-0123',
  },
  {
    id: 2,
    nombre: 'Hospital Norte',
    direccion: 'Calle Norte 456, Ciudad',
    telefono: '555-0456',
  },
  {
    id: 3,
    nombre: 'Centro Médico Sur',
    direccion: 'Av. Sur 789, Ciudad',
    telefono: '555-0789',
  },
  {
    id: 4,
    nombre: 'Sanatorio Este',
    direccion: 'Calle Este 101, Ciudad',
    telefono: '555-0101',
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

export default function MedicalCentersManagement() {
  const { user } = useAuth();
  const [medicalCenters, setMedicalCenters] = useState<MedicalCenter[]>(localMedicalCenters);
  const [searchId, setSearchId] = useState('');
  const [editMedicalCenter, setEditMedicalCenter] = useState<MedicalCenter | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [medicalCenterToDelete, setMedicalCenterToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
  });

  // Initialize medical centers on component mount
  useEffect(() => {
    setMedicalCenters(localMedicalCenters);
  }, []);

  // Search medical center by ID
  const handleSearch = () => {
    if (!searchId) {
      setMedicalCenters(localMedicalCenters);
      return;
    }
    const filtered = localMedicalCenters.filter((center) =>
      center.id.toString().includes(searchId)
    );
    setMedicalCenters(filtered);
  };

  // Open add dialog
  const handleOpenAdd = () => {
    setFormData({ nombre: '', direccion: '', telefono: '' });
    setOpenAddDialog(true);
  };

  // Add new medical center
  const handleAdd = () => {
    if (!formData.nombre.trim() || !formData.direccion.trim() || !formData.telefono.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }
    const newMedicalCenter: MedicalCenter = {
      id: medicalCenters.length ? Math.max(...medicalCenters.map((c) => c.id)) + 1 : 1,
      nombre: formData.nombre,
      direccion: formData.direccion,
      telefono: formData.telefono,
    };
    setMedicalCenters([...medicalCenters, newMedicalCenter]);
    setOpenAddDialog(false);
    setFormData({ nombre: '', direccion: '', telefono: '' });
  };

  // Open edit dialog
  const handleEdit = (center: MedicalCenter) => {
    setEditMedicalCenter(center);
    setFormData({
      nombre: center.nombre,
      direccion: center.direccion,
      telefono: center.telefono,
    });
    setOpenEditDialog(true);
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save edited medical center
  const handleSave = () => {
    if (!editMedicalCenter) return;
    if (!formData.nombre.trim() || !formData.direccion.trim() || !formData.telefono.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }
    const updatedMedicalCenter = {
      ...editMedicalCenter,
      nombre: formData.nombre,
      direccion: formData.direccion,
      telefono: formData.telefono,
    };
    const updatedMedicalCenters = medicalCenters.map((center) =>
      center.id === editMedicalCenter.id ? updatedMedicalCenter : center
    );
    setMedicalCenters(updatedMedicalCenters);
    setOpenEditDialog(false);
  };

  // Open delete confirmation dialog
  const handleDelete = (id: number) => {
    setMedicalCenterToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (medicalCenterToDelete === null) return;
    const updatedMedicalCenters = medicalCenters.filter(
      (center) => center.id !== medicalCenterToDelete
    );
    setMedicalCenters(updatedMedicalCenters);
    setOpenDeleteDialog(false);
    setMedicalCenterToDelete(null);
  };

  return (
    <Box p={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <StyledTypography variant="h4" gutterBottom>
        Gestión de Centros Médicos
      </StyledTypography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Bienvenido, {user?.name}. Administra los centros médicos del sistema con facilidad.
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
            setMedicalCenters(localMedicalCenters);
          }}
        >
          Limpiar
        </StyledButton>
        <StyledButton variant="contained" color="success" onClick={handleOpenAdd}>
          <Add /> Nuevo Centro
        </StyledButton>
      </Box>

      {/* Medical Centers Table */}
      <Paper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Dirección</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicalCenters.length > 0 ? (
                medicalCenters.map((center) => (
                  <StyledTableRow key={center.id}>
                    <TableCell>{center.id}</TableCell>
                    <TableCell>{center.nombre}</TableCell>
                    <TableCell>{center.direccion}</TableCell>
                    <TableCell>{center.telefono}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(center)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(center.id)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No se encontraron centros médicos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>

      {/* Add Dialog */}
      <StyledDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Nuevo Centro Médico</DialogTitle>
        <DialogContent>
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
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
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
        <DialogTitle>Editar Centro Médico</DialogTitle>
        <DialogContent>
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
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
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
          <Typography>¿Estás seguro de que quieres eliminar este centro médico?</Typography>
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
