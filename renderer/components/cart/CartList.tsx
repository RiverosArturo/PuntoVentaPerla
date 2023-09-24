import { FC, useCallback, useContext } from "react";
import { ICartProduct, IOrderItem } from "../../interfaces";
import { Box, Button, Grid, Typography } from "@mui/material";
import { ItemCounter } from "../ui";
import { CartContext } from "../../context";
import { ventaApi } from "../../api";
import { alerta } from "../../utils";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable, products }) => {
  const { updateCartQuantity, removeCartProduct } = useContext(CartContext);

  const onNewCartQuantityValue = useCallback(
    async (product: ICartProduct, newQuantityValue: number) => {
      try {
        const { data } = await ventaApi.get(`/products/${product.clave}`);
        if (data[0].cantidad < newQuantityValue)
          return alerta.noti(
            newQuantityValue > 1
              ? `No puedes agregar ${newQuantityValue} productos, porque solo tienes ${data[0].cantidad}`
              : `No puedes agregar ${newQuantityValue} producto, porque solo tienes ${data[0].cantidad}`,
            1
          );

        product.cantidad = newQuantityValue;
        updateCartQuantity(product);
      } catch (error) {
        alerta.noti(error, 1);
      }
    },
    [updateCartQuantity]
  );
  return (
    <>
      {products.map((product) => (
        //sumamos el product.size en key por si se elije el mismo producto pero en dif talla siga siendo clave unica
        <Grid
          container
          spacing={2}
          key={product.clave + product.descripcion}
          sx={{ mb: 1 }}
        >
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">
                <strong>{product.descripcion}</strong>
              </Typography>
              <Typography variant="body1">
                Clave: <strong>{product.clave}</strong>
              </Typography>
              {editable ? (
                <ItemCounter
                  currentValue={product.cantidad}
                  updatedQuantity={(onNewValue) =>
                    onNewCartQuantityValue(product as ICartProduct, onNewValue)
                  }
                />
              ) : (
                <Typography variant="h5">
                  {product.cantidad}{" "}
                  {product.cantidad > 1 ? "productos" : "producto"}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid
            item
            xs={2}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="subtitle1">{`$${product.precio}`}</Typography>
            {/* Editable */}
            {editable && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => removeCartProduct(product as ICartProduct)}
              >
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
