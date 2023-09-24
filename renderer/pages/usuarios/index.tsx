import useSWR from "swr";
import { Box, Button, Grid, MenuItem, Select, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { EmployeeLayout } from "../../components/layout";
import {
  DeleteOutlineOutlined,
  PersonAddAlt1Outlined,
} from "@mui/icons-material";

const users = [
  {
    name: "Arturo",
    password: "12345",
    role: "admin",
  },
  {
    name: "Carmen",
    password: "12345",
    role: "employee",
  },
];
const UsuariosPage = () => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 100 },
    { field: "name", headerName: "Nombre completo", width: 300 },
    {
      field: "password",
      headerName: "Contraseña",
      width: 250,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <TextField
            type="text"
            value={row.password}
            // label="Contraseña"
            sx={{ width: "250px" }}
          />
        );
      },
    },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            sx={{ width: "300px" }}
            // onChange={({ target }) => onRoleUpdated(ralue)}
          >
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="employee">Empleado</MenuItem>
          </Select>
        );
      },
    },
    {
      field: "delete",
      headerName: "Eliminar usuario",
      width: 120,
      renderCell: () => {
        return (
          <Button sx={{ width: "120px", alignItems: "center" }} color="error">
            Eliminar <DeleteOutlineOutlined />
          </Button>
        );
      },
    },
  ];

  const rows = users.map((user, i) => ({
    id: i + 1,
    name: user.name,
    password: user.password,
    role: user.role,
  }));

  return (
    <EmployeeLayout
      title="ADMINISTRACIÓN DE USUARIOS"
      pageDescription="Mantenimiento de usuarios"
    >
      <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
        <Button
          sx={{ width: "200px", alignItems: "center", alignContent: "end" }}
          color="success"
        >
          Crear nuevo usuario <PersonAddAlt1Outlined />
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          />
        </Grid>
      </Grid>
    </EmployeeLayout>
  );
};

export default UsuariosPage;
