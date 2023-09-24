import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Input,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  ClearOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  UnarchiveOutlined,
} from "@mui/icons-material";
import { EmployeeLayout } from "../../components/layout";
import { FullScreenLoading } from "../../components/ui";
import { TableInvPage } from "../../components/inventario";
import { ventaApi } from "../../api";
import { IProduct } from "../../interfaces/product";
import { useForm } from "react-hook-form";
import { alerta } from "../../utils";
import { useProducts } from "../../hooks/useProducts";
import { excel } from "../../hooks";

interface FormData {
  _id?: string;
  clave: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

const InventarioPage = () => {
  const { products } = useProducts("/admin/products");
  const { handleFile, handleFileSubmit, excelFile, setExcelFile } = excel();
  const [addProd, setAddProd] = useState<IProduct[]>([]);
  const [alert, setAlert] = useState(false);
  const [fileExcel, setFileExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    obtenerData();
  }, []);

  const obtenerData = async () => {
    setAddProd([]);
    const { data } = await ventaApi.get("/admin/products");
    await setAddProd(data);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>();

  const onSearchTerm = async () => {
    if (searchTerm.trim().length === 0) return;
    setAddProd([]);

    const { data } = await ventaApi.get(`/products/${searchTerm}`);

    if (data.length === 0) {
      return alerta.noti("Producto no encontrado", 1);
    } else {
      await setAddProd(data);
    }
  };

  const actualizarProd = async () => {
    setAddProd([]);
    const { data } = await ventaApi.get("/admin/products");
    if (data.length > products.length) {
      setValue("cantidad", 0);
      setValue("clave", "");
      setValue("descripcion", "");
      setValue("precio", 0);
      await setAddProd(data);
    }
  };

  const onSubmit = async (form: FormData) => {
    String(form.precio).includes("$")
      ? (form.precio = Number(String(form.precio).slice(1)))
      : "";
    try {
      const { data } = await ventaApi({
        url: "/admin/products",
        method: "POST",
        data: [form],
      });
      if (data.error) {
        return alerta.noti(data.message, 1);
      }
      setAlert(false);
      actualizarProd();
      alerta.noti("Producto Agregado", 2);
    } catch (error) {
      alerta.noti(error, 1);
      setAlert(false);
    }
  };

  const excelForm = () => {
    setFileExcel(false);
    setTimeout(() => {
      obtenerData();
    }, 5000);
  };

  return (
    <EmployeeLayout
      title="Inventario"
      pageDescription="Aquí podras ver, editar, borrar, exportar tu inventario"
    >
      <Grid container sx={{ m: 2 }}>
        <Grid item xs={12} sm={3}>
          <Input
            autoFocus
            value={searchTerm}
            type="text"
            placeholder="Buscar Producto..."
            fullWidth
            sx={{ mt: 3, width: "210px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
            endAdornment={
              searchTerm !== "" ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      obtenerData();
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

        <Grid item xs={6} sm={2}>
          {/* Excel */}
          <Button
            color="success"
            onClick={() => setFileExcel(true)}
            sx={{ height: "35px", mt: 2.8 }}
            startIcon={<UnarchiveOutlined />}
          >
            Cargar Archivo Excel
          </Button>
        </Grid>

        <Grid item xs={6} sm={2}>
          <Button
            color="success"
            onClick={() => setAlert(true)}
            sx={{ height: "35px", mt: 2.8 }}
            startIcon={<AddOutlined />}
          >
            Crear Producto
          </Button>
        </Grid>
      </Grid>

      {/* Tabla */}
      {addProd.length > 0 ? (
        <TableInvPage data={addProd} />
      ) : (
        <FullScreenLoading />
      )}

      {/* Alerta */}
      <Dialog open={alert} onClose={() => setAlert(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Agregar Producto</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
            Asegurate de llenar todos los campos correctamente.
          </DialogContentText> */}
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
              onClick={() => setAlert(false)}
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

      <Dialog open={fileExcel} onClose={() => setFileExcel(false)}>
        <Grid container>
          <Grid item xs={12} sm={10}>
            <form
              className="form-group custom-form"
              onSubmit={handleFileSubmit}
            >
              <DialogTitle>Cargar Archivo Excel</DialogTitle>

              <CloudUploadOutlined
                sx={{ height: "10%", width: "30%", ml: 25 }}
                color="action"
              />
              <input
                style={{ display: "none" }}
                type="file"
                className="form-control"
                required
                onChange={handleFile}
                id="file-input"
              />
              <label
                for="file-input"
                // class="custom-file-label"
                style={{
                  textDecoration: "underline",
                  color: "GrayText",
                  cursor: "pointer",
                }}
              >
                Seleccionar archivo
              </label>

              <DialogActions>
                <Button
                  onClick={() => {
                    setFileExcel(false);
                    setExcelFile(false);
                  }}
                  color="error"
                  sx={{ mt: 1, width: "150px" }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  // className="btn btn-success btn-md"
                  disabled={excelFile ? false : true}
                  color="success"
                  sx={{ mt: 1, width: "150px" }}
                  onClick={excelForm}
                >
                  Cargar
                </Button>
              </DialogActions>
            </form>
          </Grid>
        </Grid>
      </Dialog>
    </EmployeeLayout>
  );
};

export default InventarioPage;
