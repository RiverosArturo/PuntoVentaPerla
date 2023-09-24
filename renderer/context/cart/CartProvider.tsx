import { FC, PropsWithChildren, useEffect, useReducer } from "react";
import { CartContext, cartReducer } from "./";
import axios from "axios";
import { ICartProduct, IOrder, IPurchase } from "../../interfaces";
import { ventaApi } from "../../api";

export interface CartState {
  client: string;
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  descuento: number;
  total: number;
  purchase: IPurchase;
  percent: number;
  abono: number;
  restante: number;
}

const CART_INITIAL_STATE: CartState = {
  client: "",
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  descuento: 0,
  total: 0,
  purchase: "efectivo",
  percent: 0,
  abono: 0,
  restante: 0,
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  //useEffect para conseguir los valores de nuestro pedido
  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.cantidad + prev,
      0
    );

    const subTotal = state.cart.reduce(
      (prev, current) => current.cantidad * current.precio + prev,
      0
    );

    // const percent = 0.2;
    const descuento = subTotal * state.percent;

    const purchase = state.purchase;
    const client = purchase === "apartado" ? state.client : "";
    const abono = purchase === "apartado" ? state.abono : 0;

    const orderSummary = {
      client,
      numberOfItems,
      subTotal,
      descuento,
      total: subTotal - descuento,
      purchase,
      abono,
      restante: subTotal - descuento - abono,
    };

    // console.log({ orderSummary });
    dispatch({ type: "Cart - Update order summary", payload: orderSummary });
  }, [state.cart, state.percent, state.purchase, state.client]);

  const addProductToCart = (product: ICartProduct) => {
    // dispatch({ type: "Cart - Add Product", payload: product });
    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart)
      return dispatch({
        type: "Cart - Update products in cart",
        payload: [...state.cart, product],
      });

    const productInCartVutDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.clave === product.clave
    );
    if (!productInCartVutDifferentSize)
      return dispatch({
        type: "Cart - Update products in cart",
        payload: [...state.cart, product],
      });

    //Acumular
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.clave !== product.clave) return p;

      //actualizar cantidad
      p.cantidad = Math.floor(p.cantidad);
      p.cantidad += Math.floor(product.cantidad);
      return p;
    });

    dispatch({
      type: "Cart - Update products in cart",
      payload: updatedProducts,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "Cart - Change cart quantity", payload: product });
  };

  const updatePercent = (percent: number) => {
    dispatch({ type: "Percent - Change percent", payload: percent });
  };

  const updatedPurchase = (purchase: IPurchase) => {
    dispatch({ type: "Purchase - Change purchase", payload: purchase });
  };

  const updatedClient = (client: string) => {
    dispatch({ type: "Client - Change client", payload: client });
  };

  const updatedAbono = (abono: number) => {
    dispatch({ type: "Abono - Change abono", payload: abono });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: "Cart - Remove product in cart", payload: product });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    const body: IOrder = {
      //En order items haremos el spreed de p y ponemos que size: siempre tendra el valor de p.size,
      //Para asegurarnos de que orderItems no sea undefined
      client: state.client,
      orderItems: state.cart,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      descuento: state.descuento,
      total: state.total,
      purchase: state.purchase,
      abono: state.abono,
      restante: state.restante,
    };
    // console.log(body);
    // dispatch({ type: "Cart - Order complete" });

    try {
      // const { data } = await ventaApi.post<IOrder>("/orders", body);
      // console.log(data);
      //Dispatch para vaciar el carrito y limpiar el state:
      dispatch({ type: "Cart - Order complete" });
      return {
        hasError: false,
        message: "Cool",
        // message: data._id!,
      };
    } catch (error) {
      // console.log(error);
      //si es un error de axios
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      //Si es un error pero no de axios
      return {
        hasError: true,
        message: "Error no encontrado hable con el administrador",
      };
    }
  };
  return (
    <CartContext.Provider
      value={{
        ...state,

        //Methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updatePercent,
        updatedPurchase,
        updatedClient,
        updatedAbono,
        //Orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
