import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Product } from '../../../models';
import { IProduct } from '../../../interfaces/product';

type Data = 
    | { message: string }
    | IProduct[] 
    | IProduct

export default function handle(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method){
        case 'GET':
            return searchProduct(req,res);
        default:
            return res.status(200).json({message: 'Bad request'});
    }
}

const searchProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    let { q = '' } = req.query;

    if(q.length === 0 ){
        return res.status(200).json({message:"Debe mandar el query de busqueda"})
    }

    q = q.toString();

    db.connect();
    const products = await Product.find({ "clave": q  }).lean();
    db.disconnect();

    // console.log(products.length)
    return res.status(200).json(products);
}
