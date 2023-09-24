import { useEffect, useState, FC } from "react";
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
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { alerta, currency } from "../../utils";
import { useForm } from "react-hook-form";
import { ventaApi } from "../../api";

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

export const TableInvPage: FC<Props> = ({ data }) => {
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
      field: "deletedProd",
      headerName: "Eliminar Producto",
      width: 150,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Button
          sx={{ width: "150px", alignItems: "center" }}
          color="error"
          onClick={() => {
            setEliminar(true);
            setEliminarProducto(row);
          }}
          startIcon={<DeleteOutlineOutlined />}
        >
          Eliminar
        </Button>
      ),
    },
    {
      field: "actualizarProd",
      headerName: "Actualizar Producto",
      width: 150,
      renderCell: ({ row }: GridRenderCellParams) => (
        <Button
          sx={{ width: "150px", alignItems: "center" }}
          color="secondary"
          onClick={() => onUpdatedProduct(row)}
          startIcon={<ChangeCircleOutlined />}
        >
          Actualizar
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

  const onUpdatedProduct = (product: IProduct) => {
    setValue("_id", product._id);
    setValue("clave", product.clave);
    setValue("descripcion", product.descripcion);
    setValue("precio", product.precio);
    setValue("cantidad", product.cantidad);
    setUpdateProduct(true);
  };

  const actualizarProd = async () => {
    const { data } = await ventaApi({
      url: "/admin/products",
      method: "GET",
    });
    await setProducts(data);
  };

  const onSubmit = async (form: FormData) => {
    String(form.precio).includes("$")
      ? (form.precio = Number(String(form.precio).slice(1)))
      : "";
    try {
      const { data } = await ventaApi({
        url: "/admin/products",
        method: "PUT",
        data: form,
      });
      if (data.error) {
        return alerta.noti(data.message, 1);
      }
      setUpdateProduct(false);
      actualizarProd();
      alerta.noti("Producto actualizado", 2);
    } catch (error) {
      alerta.noti(error, 1);
      setUpdateProduct(false);
    }
  };

  const onDeleteProduct = async (product: IProduct) => {
    String(product.precio).includes("$")
      ? (product.precio = Number(String(product.precio).slice(1)))
      : "";
    try {
      const { data } = await ventaApi({
        url: "/admin/products",
        method: "DELETE",
        data: product,
      });
      if (data.error) {
        return alerta.noti(data.message, 1);
      }
      setEliminar(false);
      actualizarProd();
      alerta.noti(data.message, 2);
    } catch (error) {
      alerta.noti(error, 1);
      setEliminar(false);
    }
  };
  return (
    <>
      {/* Tabla para mostrar */}
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

      {/* Alertas para el usuario */}
      <Dialog open={eliminar} onClose={() => setEliminar(false)}>
        <DialogTitle>Eliminar Producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta seguro que desea eliminar el producto:
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEliminar(false)}
            color="error"
            sx={{ mr: 2, width: "150px" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => onDeleteProduct(eliminarProducto)}
            color="success"
            sx={{ mr: 2, width: "150px" }}
          >
            Eliminar Producto
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateProduct} onClose={() => setUpdateProduct(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Actualizar Producto</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={5.5} sx={{ mr: 2.5 }}>
                <TextField
                  autoFocus
                  label="Clave del producto"
                  type="text"
                  variant="filled"
                  fullWidth
                  {...register("clave", {
                    required: "Este campo es requerido",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  })}
                  error={!!errors.clave}
                  helperText={errors.clave?.message}
                />
              </Grid>

              <Grid item xs={5.5} sx={{ mr: 2.5 }}>
                <TextField
                  autoFocus
                  label="Descripcion"
                  type="text"
                  variant="filled"
                  fullWidth
                  {...register("descripcion", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion?.message}
                />
              </Grid>
              <Grid item xs={5.5} sx={{ mt: 1.5, mr: 2.5 }}>
                <TextField
                  autoFocus
                  label="Precio $"
                  type="text"
                  variant="filled"
                  fullWidth
                  {...register("precio", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.precio}
                  helperText={errors.precio?.message}
                />
              </Grid>

              <Grid item xs={5.5} sx={{ mt: 1.5, mr: 2.5 }}>
                <TextField
                  autoFocus
                  label="Cantidad"
                  type="text"
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
              Actualizar Producto
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
