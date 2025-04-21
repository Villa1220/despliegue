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

// Interface for specialty data
interface Specialty {
  id: number;
  nombre: string;
  descripcion: string;
}

// Sample local specialty data
const localSpecialties: Specialty[] = [
  {
    id: 1,
    nombre: 'Cardiología',
    descripcion: 'Diagnóstico y tratamiento de enfermedades del corazón',
  },
  {
    id: 2,
    nombre: 'Neurología',
    descripcion: 'Tratamiento de trastornos del sistema nervioso',
  },
  {
    id: 3,
    nombre: 'Pediatría',
    descripcion: 'Cuidado médico de infantes, niños y adolescentes',
  },
  {
    id: 4,
    nombre: 'Ortopedia',
    descripcion: 'Tratamiento de trastornos musculoesqueléticos',
  },
  {
    id: 5,
    nombre: 'Dermatología',
    descripcion: 'Diagnóstico y tratamiento de enfermedades de la piel',
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

export default function SpecialtiesManagement() {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState<Specialty[]>(localSpecialties);
  const [searchId, setSearchId] = useState('');
  const [editSpecialty, setEditSpecialty] = useState<Specialty | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Initialize specialties on component mount
  useEffect(() => {
    setSpecialties(localSpecialties);
  }, []);

  // Search specialty by ID
  const handleSearch = () => {
    if (!searchId) {
      setSpecialties(localSpecialties);
      setPage(0); // Reset to first page on search
      return;
    }
    const filtered = localSpecialties.filter((specialty) =>
      specialty.id.toString().includes(searchId)
    );
    setSpecialties(filtered);
    setPage(0); // Reset to first page on search
  };

  // Open add dialog
  const handleOpenAdd = () => {
    setFormData({ nombre: '', descripcion: '' });
    setOpenAddDialog(true);
  };

  // Add new specialty
  const handleAdd = () => {
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }
    const newSpecialty: Specialty = {
      id: specialties.length ? Math.max(...specialties.map((s) => s.id)) + 1 : 1,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
    };
    setSpecialties([...specialties, newSpecialty]);
    setOpenAddDialog(false);
    setFormData({ nombre: '', descripcion: '' });
    setPage(0); // Reset to first page on add
  };

  // Open edit dialog
  const handleEdit = (specialty: Specialty) => {
    setEditSpecialty(specialty);
    setFormData({
      nombre: specialty.nombre,
      descripcion: specialty.descripcion,
    });
    setOpenEditDialog(true);
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save edited specialty
  const handleSave = () => {
    if (!editSpecialty) return;
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }
    const updatedSpecialty = {
      ...editSpecialty,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
    };
    const updatedSpecialties = specialties.map((spec) =>
      spec.id === editSpecialty.id ? updatedSpecialty : spec
    );
    setSpecialties(updatedSpecialties);
    setOpenEditDialog(false);
    setPage(0); // Reset to first page on edit
  };

  // Open delete confirmation dialog
  const handleDelete = (id: number) => {
    setSpecialtyToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (specialtyToDelete === null) return;
    const updatedSpecialties = specialties.filter(
      (spec) => spec.id !== specialtyToDelete
    );
    setSpecialties(updatedSpecialties);
    setOpenDeleteDialog(false);
    setSpecialtyToDelete(null);
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
  const paginatedSpecialties = specialties.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <StyledTypography variant="h4" gutterBottom>
        Gestión de Especialidades
      </StyledTypography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Bienvenido, {user?.name}. Administra las especialidades médicas del sistema con facilidad.
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
            setSpecialties(localSpecialties);
            setPage(0); // Reset pagination on clear
          }}
        >
          Limpiar
        </StyledButton>
        <StyledButton variant="contained" color="success" onClick={handleOpenAdd}>
          <Add /> Nueva Especialidad
        </StyledButton>
      </Box>

      {/* Specialties Table */}
      <Paper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  Descripción
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSpecialties.length > 0 ? (
                paginatedSpecialties.map((specialty) => (
                  <StyledTableRow key={specialty.id}>
                    <TableCell>{specialty.id}</TableCell>
                    <TableCell>{specialty.nombre}</TableCell>
                    <TableCell>{specialty.descripcion}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(specialty)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(specialty.id)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No se encontraron especialidades
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
        count={specialties.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => handleChangePage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />

      {/* Add Dialog */}
      <StyledDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Nueva Especialidad</DialogTitle>
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
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
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

 
      <StyledDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Especialidad</DialogTitle>
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
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
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

 
      <StyledDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar esta especialidad?</Typography>
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
