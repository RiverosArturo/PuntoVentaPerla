
import type { NextApiRequest, NextApiResponse } from 'next'
import { Product } from '../../models';
import { db } from '../../database';

type Data = {
    message: string
}

const products = [
    {
        clave: "13214323",
        descripcion: "CADENA",
        precio: 350,
        cantidad: 2,
      },
      {
        clave: "13242556",
        descripcion: "DIJE",
        precio: 200,
        cantidad: 8,
      },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    //Condicion para que no se pueda purgar la base de datos en produccion:    
    // if( process.env.NODE_ENV === 'production' ){
    //     return res.status(401).json({ message: 'No tiene acceso a este servicio'});
    // }

    await db.connect();
        await Product.deleteMany();
        await Product.insertMany( products );
    await db.disconnect();

    res.status(200).json({ message: 'Proceso realizado correctamente' });
}

