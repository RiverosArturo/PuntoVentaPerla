
import { ICartProduct, IPurchase } from '../../interfaces';
import { CartState } from './';

type CartActionType = 
    | { type: 'Cart - LoadCart from cookies | storage', payload: ICartProduct[] }
    | { type: 'Cart - Update products in cart', payload: ICartProduct[] }
    | { type: 'Cart - Change cart quantity', payload: ICartProduct }
    | { type: 'Percent - Change percent', payload: number }
    | { type: 'Purchase - Change purchase', payload: IPurchase}
    | { type: "Client - Change client", payload: string}
    | { type: "Abono - Change abono", payload: number }
    | { type: 'Cart - Remove product in cart', payload: ICartProduct }
    | { type: 'Cart - Update order summary', 
        payload: {
            numberOfItems: number;
            subTotal: number;
            descuento: number;
            total: number;
            purchase: IPurchase;
        }}
    | { type: 'Cart - Order complete' }

export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

    switch (action.type) {
        case 'Cart - LoadCart from cookies | storage':
            return{
                ...state,
                isLoaded: true,
                cart: [...action.payload],
            }

        case 'Cart - Update products in cart':
            return{
                ...state,
                // cart:[...state.cart, action.payload],
                cart:[...action.payload],
            }

        case 'Cart - Change cart quantity':
            return{
                ...state,
                cart: state.cart.map( product => {
                    if( product._id !== action.payload._id ) return product;
                    if( product.clave !== action.payload.clave ) return product;
                    // product.quantity = action.payload.quantity;
                    return action.payload;
                })
            }

        case 'Percent - Change percent':
            return {
                ...state,
                percent: action.payload,
            }

        case 'Purchase - Change purchase':
            return {
                ...state,
                purchase: action.payload,
            }

        case 'Client - Change client':
            return {
                ...state,
                client: action.payload,
            }

        case 'Abono - Change abono':
            return {
                ...state,
                abono: action.payload,
            }
        
        case 'Cart - Remove product in cart':
            return{
                ...state,
                cart: state.cart.filter( product => !(product._id === action.payload._id && product.clave === action.payload.clave) ),
            }
        
        case 'Cart - Update order summary':
            return {
                ...state,
                ...action.payload,
            }
        
        case 'Cart - Order complete':
            return {
                ...state,
                client: '',
                percent:0,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                descuento: 0,
                total: 0,
                purchase: 'efectivo',
                abono: 0,
                restante: 0,
            }

        default:
            return state;
    }
}