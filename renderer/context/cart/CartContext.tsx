import { createContext } from "react";
import { ICartProduct, IPurchase } from "../../interfaces";

interface ContextProps {
  isLoaded: boolean;
  client: string;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  descuento: number;
  total: number;
  purchase: IPurchase;
  percent: number;
  abono: number;
  restante: number;

  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updatePercent: (percent: number) => void;
  updatedPurchase: (purchase: IPurchase) => void;
  updatedClient: (client: string) => void;
  updatedAbono: (abono: number) => void;
  //Orders
  createOrder: () => Promise<{
    hasError: boolean;
    message: string;
  }>;
}

export const CartContext = createContext({} as ContextProps);
