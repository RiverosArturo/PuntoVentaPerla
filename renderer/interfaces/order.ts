export interface IOrder {
    _id?: string;
    client?: string;
    correo?: string;
    orderItems: IOrderItem[];
    
    numberOfItems: number;
    subTotal: number;
    descuento: number;
    total: number;

    purchase: IPurchase
    abono?: number;
    restante?: number;

    createdAt?: string;
    updatedAt?: string;
}

export interface IOrderItem {
    _id?: string;
    clave: string,
    descripcion: string,
    precio: number,
    cantidad: number,
}

export type IPurchase = 'efectivo'|'tarjeta'|'apartado';