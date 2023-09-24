import {
  AddOutlined,
  AttachMoneyOutlined,
  CheckBoxOutlined,
  CleaningServicesOutlined,
  ClearOutlined,
  DeleteOutlined,
  LocalPrintshopOutlined,
  SearchOutlined,
  SendOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { EmployeeLayout } from "../../components/layout";
import { CartList, OrderSummary } from "../../components/cart";

const products = [
  {
    clave: "13214323",
    descripcion: "CADENA",
    precio: 350,
    cantidad: 2,
  },
  {
    clave: "13242556",
    descripcion: "DIJE",
    precio: 200,
    cantidad: 8,
  },
];

const apartados = [
  {
    id: 1012321,
    client: "David Juan Riveros",
    date: "22/03/2023",
    hour: "12:34",
    totalF: 240.0,
    paid: 120,
    rest: 120,
  },
];
const ApartadosPage = () => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "client", headerName: "Cliente", width: 200 },
    {
      field: "date",
      headerName: "Fecha",
      width: 100,
    },
    {
      field: "hour",
      headerName: "Hora",
      width: 100,
    },
    {
      field: "totalF",
      headerName: "Total Final",
      width: 100,
    },
    {
      field: "paid",
      headerName: "Pagado",
      width: 100,
    },
    {
      field: "rest",
      headerName: "Restante",
      width: 100,
    },
    {
      field: "abonarProd",
      headerName: "Abonar",
      width: 200,
      renderCell: () => {
        return (
          <Button sx={{ width: "200px", alignItems: "center" }} color="warning">
            <AttachMoneyOutlined /> Abonar
          </Button>
        );
      },
    },
    {
      field: "deleteProd",
      headerName: "Eliminar",
      width: 200,
      renderCell: () => {
        return (
          <Button sx={{ width: "200px", alignItems: "center" }} color="error">
            <DeleteOutlined /> Eliminar
          </Button>
        );
      },
    },
  ];

  const rows = apartados.map((apartado) => ({
    id: apartado.id,
    client: apartado.client,
    date: apartado.date,
    hour: apartado.hour,
    totalF: apartado.totalF,
    paid: apartado.paid,
    rest: apartado.rest,
  }));
  return (
    <EmployeeLayout
      title="Apartados"
      pageDescription="Aquí podrás realizar apartados."
    >
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={3}>
          <TextField type="text" label="Clave" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button color="info" fullWidth sx={{ height: "55px" }}>
            <SearchOutlined /> Buscar
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button color="error" fullWidth sx={{ height: "55px" }}>
            <CleaningServicesOutlined /> Limpiar
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button color="success" fullWidth sx={{ height: "55px" }}>
            <AddOutlined /> Agregar apartado
          </Button>
        </Grid>

        <Grid item xs={12} sx={{ height: 180, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 1 },
              },
            }}
            pageSizeOptions={[1]}
          />
        </Grid>

        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="h1" component="h1">
            Venta
          </Typography>
        </Box>

        <Grid container sx={{ m: 2 }}>
          <Grid item xs={12} sm={7}>
            <CartList editable products={products} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant="h2">Ticket</Typography>
                <Divider sx={{ marginY: 1 }} />
                {/* Order Summary */}
                <OrderSummary />
                <Box sx={{ mt: 3 }}>
                  <Button
                    color="success"
                    className="circular-btn"
                    fullWidth
                    href="/checkout/address"
                  >
                    <LocalPrintshopOutlined /> Imprimir Ticket
                  </Button>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Button
                    color="warning"
                    className="circular-btn"
                    fullWidth
                    href="/checkout/address"
                  >
                    <SendOutlined /> Enviar Ticket Por Correo
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </EmployeeLayout>
  );
};

export default ApartadosPage;
