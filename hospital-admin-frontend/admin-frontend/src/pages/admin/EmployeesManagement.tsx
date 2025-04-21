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

interface Employee {
  id: string;
  nombre: string;
  apellido: string;
  rol: string;
  centroMedico: { id: number; nombre: string };
}

// Sample local employee data
const localEmployees: Employee[] = [
  {
    id: 'E001',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'Médico',
    centroMedico: { id: 1, nombre: 'Clínica Central' },
  },
  {
    id: 'E002',
    nombre: 'María',
    apellido: 'Gómez',
    rol: 'Enfermera',
    centroMedico: { id: 2, nombre: 'Hospital Norte' },
  },
  {
    id: 'E003',
    nombre: 'Carlos',
    apellido: 'López',
    rol: 'Administrador',
    centroMedico: { id: 1, nombre: 'Clínica Central' },
  },
  {
    id: 'E004',
    nombre: 'Ana',
    apellido: 'Martínez',
    rol: 'Técnico',
    centroMedico: { id: 3, nombre: 'Centro Médico Sur' },
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

export default function EmployeesManagement() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(localEmployees);
  const [searchId, setSearchId] = useState('');
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    rol: '',
    centro_medico_id: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Initialize employees on component mount
  useEffect(() => {
    setEmployees(localEmployees);
  }, []);

  // Search employee by ID
  const handleSearch = () => {
    if (!searchId) {
      setEmployees(localEmployees);
      setPage(0); // Reset to first page on search
      return;
    }
    const filtered = localEmployees.filter((employee) =>
      employee.id.toLowerCase().includes(searchId.toLowerCase())
    );
    setEmployees(filtered);
    setPage(0); // Reset to first page on search
  };

  // Open add dialog
  const handleOpenAdd = () => {
    setFormData({ id: '', nombre: '', apellido: '', rol: '', centro_medico_id: '' });
    setOpenAddDialog(true);
  };

  // Add new employee
  const handleAdd = () => {
    if (
      !formData.id.trim() ||
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.rol.trim() ||
      !formData.centro_medico_id
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }
    const newEmployee: Employee = {
      id: formData.id,
      nombre: formData.nombre,
      apellido: formData.apellido,
      rol: formData.rol,
      centroMedico: {
        id: parseInt(formData.centro_medico_id),
        nombre: 'Unknown', // Placeholder; update with actual centro medico name if available
      },
    };
    setEmployees([...employees, newEmployee]);
    setOpenAddDialog(false);
    setFormData({ id: '', nombre: '', apellido: '', rol: '', centro_medico_id: '' });
    setPage(0); // Reset to first page on add
  };

  // Open edit dialog
  const handleEdit = (employee: Employee) => {
    setEditEmployee(employee);
    setFormData({
      id: employee.id,
      nombre: employee.nombre,
      apellido: employee.apellido,
      rol: employee.rol,
      centro_medico_id: employee.centroMedico.id.toString(),
    });
    setOpenEditDialog(true);
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save edited employee
  const handleSave = () => {
    if (!editEmployee) return;
    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.rol.trim() ||
      !formData.centro_medico_id
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }
    const updatedEmployee = {
      ...editEmployee,
      nombre: formData.nombre,
      apellido: formData.apellido,
      rol: formData.rol,
      centroMedico: {
        ...editEmployee.centroMedico,
        id: parseInt(formData.centro_medico_id),
      },
    };
    const updatedEmployees = employees.map((emp) =>
      emp.id === editEmployee.id ? updatedEmployee : emp
    );
    setEmployees(updatedEmployees);
    setOpenEditDialog(false);
    setPage(0); // Reset to first page on edit
  };

  // Open delete confirmation dialog
  const handleDelete = (id: string) => {
    setEmployeeToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (employeeToDelete === null) return;
    const updatedEmployees = employees.filter((emp) => emp.id !== employeeToDelete);
    setEmployees(updatedEmployees);
    setOpenDeleteDialog(false);
    setEmployeeToDelete(null);
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
  const paginatedEmployees = employees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <StyledTypography variant="h4" gutterBottom>
        Gestión de Empleados
      </StyledTypography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Bienvenido, {user?.name}. Administra los empleados del sistema con facilidad.
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
            setEmployees(localEmployees);
            setPage(0); // Reset pagination on clear
          }}
        >
          Limpiar
        </StyledButton>
        <StyledButton variant="contained" color="success" onClick={handleOpenAdd}>
          <Add /> Nuevo Empleado
        </StyledButton>
      </Box>

      {/* Employees Table */}
      <Paper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Apellido</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                  Centro Médico
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.dark' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((employee) => (
                  <StyledTableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.nombre}</TableCell>
                    <TableCell>{employee.apellido}</TableCell>
                    <TableCell>{employee.rol}</TableCell>
                    <TableCell>{employee.centroMedico.nombre}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(employee)}
                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(employee.id)}
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
                    No se encontraron empleados
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
        count={employees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => handleChangePage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />

      {/* Add Dialog */}
      <StyledDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Nuevo Empleado</DialogTitle>
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
            label="Rol"
            name="rol"
            value={formData.rol}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
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
        <DialogTitle>Editar Empleado</DialogTitle>
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
            label="Rol"
            name="rol"
            value={formData.rol}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
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
          <Typography>¿Estás seguro de que quieres eliminar este empleado?</Typography>
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
