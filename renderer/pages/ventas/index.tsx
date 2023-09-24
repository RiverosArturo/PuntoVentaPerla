import {
  AddOutlined,
  CheckBoxOutlined,
  CleaningServicesOutlined,
  ClearOutlined,
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
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { EmployeeLayout } from "../../components/layout";
import { CartList, OrderSummary } from "../../components/cart";
import { useCallback, useContext, useEffect, useState } from "react";
import { IOrder, IProduct, IPurchase } from "../../interfaces";
import { ventaApi } from "../../api";
import { alerta } from "../../utils";
import { TableSearchV, TicketButtons } from "../../components/ventas";
import { CartContext } from "../../context";

const products = [
  {
    clave: "123432",
    descripcion: "DIJE",
    precio: 400,
    cantidad: 1,
  },
];

const order = {
  orderItems: products,
  paymentResult: "hola",

  numberOfItems: 1,
  subTotal: 200,
  descuento: 20,
  total: 140,

  isPaid: false,

  purchase: "efectivo",
};

const VentasPage = () => {
  const {
    cart,
    numberOfItems,
    subTotal,
    descuento,
    total,
    purchase,
    abono,
    updatePercent,

    updatedPurchase,
    updatedClient,
    updatedAbono,
  } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [percent, setPercent] = useState(0);
  const [abonoo, setAbonoo] = useState(0);
  const [client, setClient] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [addProd, setAddProd] = useState<IProduct[]>([]);
  let orden: IOrder;

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  useEffect(() => {
    orden = {
      orderItems: cart,
      numberOfItems: numberOfItems,
      subTotal: subTotal,
      descuento: descuento,
      total: total,
      purchase: purchase,
    };
  }, [cart]);

  const onSearchTerm = async () => {
    if (searchTerm.trim().length === 0) return setAddProd([]);
    setAddProd([]);

    const { data } = await ventaApi.get(`/products/${searchTerm}`);

    if (data.length === 0) {
      return alerta.noti("Producto no encontrado", 1);
    } else {
      await setAddProd(data);
    }
  };

  const onPercent = async () => {
    updatePercent(percent / 100);
    alerta.noti("Porcentaje cambiado", 2);
  };

  const onPurchaseUpdated = (newPurchase: IPurchase) => {
    if (purchase === newPurchase) return;
    updatedPurchase(newPurchase);
    alerta.noti("Metodo de pago actualizado", 2);
  };

  const onClient = () => {
    if (client.trim().length === 0) return;

    updatedClient(client);
    alerta.noti("Cliente agregado correctamente", 2);
  };

  const onAbono = () => {
    console.log("hola");
    if (abonoo === 0) return;

    updatedAbono(abono);
    alerta.noti("Abono agregado correctamente", 2);
  };

  return (
    <EmployeeLayout
      title="Ventas"
      pageDescription="Aquí podrás realizar ventas."
    >
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={3}>
          <Input
            autoFocus
            value={searchTerm}
            type="text"
            placeholder="Buscar Producto..."
            fullWidth
            sx={{ height: "55px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
            endAdornment={
              searchTerm !== "" ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setAddProd([]);
                      setSearchTerm("");
                    }}
                  >
                    <ClearOutlined />
                  </IconButton>
                </InputAdornment>
              ) : (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        </Grid>

        {cart.length > 0 ? (
          <>
            <Grid item xs={12} sm={2}>
              <TextField
                type="number"
                label="Descuento %"
                variant="outlined"
                sx={{ mt: 0.6, height: "55px" }}
                fullWidth
                onChange={(e) => setPercent(Number(e.target.value))}
                onKeyDown={(e) => (e.key === "Enter" ? onPercent() : null)}
              />
            </Grid>

            <Grid item xs={6} sm={2.4}>
              <Select
                value={purchase}
                label="Método de pago"
                variant="outlined"
                sx={{ mt: 0.6, color: "GrayText" }}
                fullWidth
                onChange={({ target }) =>
                  onPurchaseUpdated(target.value as IPurchase)
                }
              >
                <MenuItem value="efectivo">Pago en efectivo</MenuItem>
                <MenuItem value="tarjeta">Pago con tarjeta</MenuItem>
                <MenuItem value="apartado">Apartado</MenuItem>
              </Select>
            </Grid>
          </>
        ) : (
          <></>
        )}

        {purchase === "apartado" ? (
          <>
            <Grid item xs={12} sm={2}>
              <TextField
                type="number"
                label="Abono $"
                variant="outlined"
                sx={{ mt: 0.6, height: "55px" }}
                fullWidth
                onChange={(e) => setAbonoo(Number(e.target.value))}
                onKeyDown={(e) => (e.key === "Enter" ? onAbono() : null)}
              />
            </Grid>
            <Grid item xs={12} sm={4.6}>
              <TextField
                type="text"
                label="Nombre del cliente"
                variant="outlined"
                sx={{ mt: 0.6 }}
                fullWidth
                onChange={(e) => setClient(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? onClient() : null)}
              />
            </Grid>
          </>
        ) : (
          <></>
        )}

        {addProd.length !== 0 ? (
          <>
            <Grid item xs={12}>
              <Typography variant="h6">Selección de Producto</Typography>
            </Grid>
            <Grid item xs={12} sx={{ height: 180, width: "100%" }}>
              <TableSearchV data={addProd} />
            </Grid>
          </>
        ) : (
          <></>
        )}

        {cart.length > 0 ? (
          <>
            <Grid container sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h1" component="h1">
                Venta
              </Typography>
            </Grid>

            <Grid container sx={{ m: 2 }}>
              <Grid item xs={12} sm={7}>
                <CartList editable products={cart} />
              </Grid>
              <Grid item xs={12} sm={5}>
                <Card className="summary-card">
                  <CardContent>
                    <Typography variant="h2">Ticket</Typography>
                    <Divider sx={{ marginY: 1 }} />
                    {/* Order Summary */}
                    <OrderSummary />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>
    </EmployeeLayout>
  );
};

export default VentasPage;
