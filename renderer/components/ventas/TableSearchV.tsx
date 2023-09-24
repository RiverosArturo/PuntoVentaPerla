import { useEffect, useState, FC, useContext } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { IProduct } from "../../interfaces/product";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import {
  ChangeCircleOutlined,
  CheckBoxOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { alerta, currency } from "../../utils";
import { useForm } from "react-hook-form";
import { ventaApi } from "../../api";
import { CartContext } from "../../context";

interface FormData {
  _id?: string;
  clave: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

interface Props {
  data: IProduct[];
}

export const TableSearchV: FC<Props> = ({ data }) => {
  const { cart, addProductToCart } = useContext(CartContext);
  const [eliminar, setEliminar] = useState(false);
  const [eliminarProducto, setEliminarProducto] = useState<IProduct>();
  const [updateProduct, setUpdateProduct] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>();

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, []);

  const columns: GridColDef[] = [
    // { field: "_id", headerName: "ID", width: 100 },
    { field: "clave", headerName: "Clave", width: 130 },
    {
      field: "descripcion",
      headerName: "Descripción",
      width: 130,
    },
    {
      field: "precio",
      headerName: "Precio",
      width: 130,
    },
    {
      field: "cantidad",
      headerName: "Existencia",
      width: 130,
    },
    {
      field: "selectProd",
      headerName: "Seleccionar Producto",
      width: 200,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Button
          sx={{ width: "200px", alignItems: "center" }}
          color="success"
          startIcon={<CheckBoxOutlined />}
          onClick={() => addProduct(row)}
        >
          Seleccionar Producto
        </Button>
      ),
    },
  ];

  const rows = products!.map((product) => ({
    id: product._id,
    _id: product._id,
    clave: product.clave,
    descripcion: product.descripcion,
    precio: currency.format(product.precio),
    cantidad: product.cantidad,
  }));

  const addProduct = (product: IProduct) => {
    String(product.precio).includes("$")
      ? (product.precio = Number(String(product.precio).slice(1)))
      : product.precio;
    setValue("_id", product._id);
    setValue("clave", product.clave);
    setValue("descripcion", product.descripcion);
    setValue("precio", product.precio);
    setValue("cantidad", 0);
    setUpdateProduct(true);
  };

  const onSubmit = async (form: FormData) => {
    // String(form.precio).includes("$")
    //   ? (form.precio = Number(String(form.precio).slice(1)))
    //   : "";

    try {
      form.cantidad = Math.floor(form.cantidad);
      const prodCart =
        cart.length > 0
          ? cart.filter((c) => c.clave === form.clave).length > 0
            ? cart.filter((c) => c.clave === form.clave)
            : [{ cantidad: 0 }]
          : [{ cantidad: 0 }];

      const tot = form.cantidad + Math.floor(prodCart[0].cantidad);
      const { data } = await ventaApi.get(`/products/${form.clave}`);

      if (data[0].cantidad < tot)
        return alerta.noti(
          tot > 1
            ? `No puedes agregar ${tot} productos, porque solo tienes ${data[0].cantidad}`
            : `No puedes agregar ${tot} producto, porque solo tienes ${data[0].cantidad}`,
          1
        );

      if (data.error) return alerta.noti(data.message, 1);
      if (form.cantidad < 1)
        return alerta.noti(`No puedes agregar 0 productos`, 1);
      if (data[0].cantidad < form.cantidad)
        return alerta.noti(
          form.cantidad > 1
            ? `No puedes agregar ${form.cantidad} productos, porque solo tienes ${data[0].cantidad}`
            : `No puedes agregar ${form.cantidad} producto, porque solo tienes ${data[0].cantidad}`,
          1
        );

      setUpdateProduct(false);
      addProductToCart(form);
      alerta.noti("Producto agregado correctamente", 2);
    } catch (error) {
      alerta.noti(error, 1);
      setUpdateProduct(false);
    }
  };
  return (
    <>
      {/* Tabla para mostrar */}
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 163, width: "100%" }}>
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

      {/* Alertas para el usuario */}
      <Dialog open={updateProduct} onClose={() => setUpdateProduct(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Agregar Producto</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={5.5} sx={{ mr: 2.5 }}>
                <TextField
                  disabled
                  autoFocus
                  label="Clave del producto"
                  type="text"
                  variant="filled"
                  fullWidth
                  {...register("clave")}
                />
              </Grid>

              <Grid item xs={5.5} sx={{ mr: 2.5 }}>
                <TextField
                  disabled
                  autoFocus
                  label="Descripcion"
                  type="text"
                  variant="filled"
                  fullWidth
                  {...register("descripcion")}
                />
              </Grid>
              <Grid item xs={5.5} sx={{ mt: 1.5, mr: 2.5 }}>
                <TextField
                  disabled
                  autoFocus
                  label="Precio $"
                  type="number"
                  variant="filled"
                  fullWidth
                  {...register("precio")}
                />
              </Grid>

              <Grid item xs={5.5} sx={{ mt: 1.5, mr: 2.5 }}>
                <TextField
                  autoFocus
                  label="Cantidad"
                  type="number"
                  variant="filled"
                  fullWidth
                  {...register("cantidad", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.cantidad}
                  helperText={errors.cantidad?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setUpdateProduct(false)}
              color="error"
              sx={{ m: 3, mt: 0, width: "150px" }}
            >
              Cancelar
            </Button>
            <Button
              disabled={
                errors.cantidad ||
                errors.clave ||
                errors.descripcion ||
                errors.precio
                  ? true
                  : false
              }
              type="submit"
              color="success"
              sx={{ m: 3, mt: 0, width: "150px" }}
            >
              Agregar Producto
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
