import {
  Grid,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { alerta, currency } from "../../utils";
import { CartContext } from "../../context";
import { useForm } from "react-hook-form";
import { IOrder, IPurchase } from "../../interfaces";
import { ventaApi } from "../../api";
import { LocalPrintshopOutlined, SendOutlined } from "@mui/icons-material";

interface Props {
  orderValues?: {
    numberOfItems: number;
    subTotal: number;
    total: number;
    descuento: number;
    purchase: IPurchase;
    abono: number;
    restante: number;
  };
}

interface FormData {
  correo: string;
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [sendTicket, setSendTicket] = useState(false);
  const {
    total,
    descuento,
    subTotal,
    numberOfItems,
    percent,
    createOrder,
    cart,
    purchase,
    abono,
    restante,
  } = useContext(CartContext);

  const summaryValues = orderValues
    ? orderValues
    : { numberOfItems, subTotal, total, descuento, purchase, abono, restante };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>();

  const onSendEmailTicket = async (form: FormData) => {
    setIsPosting(true);
    console.log(summaryValues);
    const ticket = {
      correo: form.correo,
      orderItems: cart,
      numberOfItems: summaryValues.numberOfItems,
      subTotal: summaryValues.subTotal,
      descuento: summaryValues.descuento,
      total: summaryValues.total,
      purchase: summaryValues.purchase,
    };
    console.log(ticket);
    try {
      const { data } = await ventaApi({
        url: "/email",
        method: "POST",
        data: ticket,
      });
      if (data.error) {
        alerta.noti(data.message, 1);
      } else {
        alerta.noti(data.message, 2);
      }
      const { hasError, message } = await createOrder();
      if (hasError) {
        setIsPosting(false);
        alerta.noti(message, 1);
        setSendTicket(false);
      }
      setSendTicket(false);
    } catch (error) {
      console.log(error);
      alerta.noti(error, 1);
      setSendTicket(false);
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end">
          <Typography>
            {summaryValues.numberOfItems}{" "}
            {summaryValues.numberOfItems > 1 ||
            summaryValues.numberOfItems === 0
              ? "productos"
              : "producto"}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>Subtotal</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end">
          <Typography>{currency.format(summaryValues.subTotal)}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>Descuento {`(${percent * 100}%)`}</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end">
          <Typography>{currency.format(summaryValues.descuento)}</Typography>
        </Grid>

        <Grid item xs={6} sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Total:</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end" sx={{ mt: 2 }}>
          <Typography variant="subtitle1">
            {currency.format(summaryValues.total)}
          </Typography>
        </Grid>
        {purchase === "apartado" ? (
          <>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Abono:</Typography>
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="end"
              sx={{ mt: 2 }}
            >
              <Typography variant="subtitle1">
                {currency.format(summaryValues.abono)}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Restante:</Typography>
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="end"
              sx={{ mt: 2 }}
            >
              <Typography variant="subtitle1">
                {currency.format(summaryValues.restante)}
              </Typography>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Button
          disabled={isPosting}
          color="success"
          className="circular-btn"
          fullWidth
          startIcon={<LocalPrintshopOutlined />}
          // onClick={onCreateOrder}
        >
          Imprimir Ticket
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button
          disabled={isPosting}
          color="warning"
          className="circular-btn"
          fullWidth
          startIcon={<SendOutlined />}
          onClick={() => setSendTicket(true)}
        >
          Enviar Ticket Por Correo
        </Button>
      </Box>

      <Dialog open={sendTicket} onClose={() => setSendTicket(false)}>
        <form onSubmit={handleSubmit(onSendEmailTicket)}>
          <DialogTitle>Enviar Ticket por correo</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={12} sx={{ mr: 2.5 }}>
                <TextField
                  autoFocus
                  label="Correo electronico"
                  type="text"
                  variant="filled"
                  fullWidth
                  {...register("correo", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.correo}
                  helperText={errors.correo?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={errors.correo ? true : false}
              onClick={() => {
                setSendTicket(false);
                setValue("correo", "");
              }}
              color="error"
              sx={{ m: 3, mt: 0, width: "150px" }}
            >
              Cancelar
            </Button>
            <Button
              disabled={errors.correo ? true : false}
              type="submit"
              color="success"
              sx={{ m: 3, mt: 0, width: "150px" }}
            >
              Enviar Ticket
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
