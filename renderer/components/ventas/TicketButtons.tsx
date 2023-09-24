import { LocalPrintshopOutlined, SendOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { alerta } from "../../utils";
import { FC, useCallback, useContext, useState } from "react";
import { CartContext } from "../../context";
import { IOrder } from "../../interfaces";
import { useForm } from "react-hook-form";
import { ventaApi } from "../../api";

interface FormData {
  correo: string;
}

interface Props {
  orden: IOrder;
}

export const TicketButtons: FC<Props> = ({ orden }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [sendTicket, setSendTicket] = useState(false);
  const {
    cart,
    numberOfItems,
    subTotal,
    descuento,
    total,
    purchase,
    createOrder,
  } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>();

  const onCreateOrder = useCallback(async () => {
    //Cambiamos el estado posting en true:
    setIsPosting(true);
    // createOrder();
    // alerta.noti("Ticket impreso con éxito", 2);
    // setSearchTerm("");
    //Tomamos hasError y message de nuestro createOrder
    const { hasError, message } = await createOrder();
    if (hasError) {
      //habilitamos nuevamente el boton
      setIsPosting(false);
      //Mostramos el error en el frontend
      alerta.noti(message, 1);
      return;
    } else {
      alerta.noti("Ticket impreso con éxito", 2);
    }
  }, [createOrder]);

  const onSendEmailTicket = useCallback(async (form: FormData) => {
    console.log(form.correo);
    setIsPosting(true);

    try {
      const ticket: IOrder = {
        correo: form.correo,
        orderItems: orden.orderItems,
        numberOfItems: orden.numberOfItems,
        subTotal: orden.subTotal,
        descuento: orden.descuento,
        total: orden.total,
        purchase: orden.purchase,
      };
      console.log(ticket);
      const { data } = await ventaApi({
        url: "/email",
        method: "POST",
        data: [ticket],
      });
      if (data.error) {
        alerta.noti(data.error, 1);
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
  }, []);

  return (
    <>
      
    </>
  );
};
