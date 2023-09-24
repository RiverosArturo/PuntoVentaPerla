import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../../interfaces/product';
import { Product } from '../../../../models';
import { disconnect } from '../../../../database/db';
import { db } from '../../../../database';
import { isValidObjectId } from 'mongoose';

type Data = 
    | { message: string, error:boolean }
    | IProduct[]
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'GET': 
            return getProducts( req, res );
        case 'POST':
            return createProducts( req, res );
        case 'PUT':
            return updateProduct( req, res);
        case 'DELETE':
            return deleteProduct( req, res );

        default:
            return res.status(200).json({message:'Bad request', error: true });
    }
}

const createProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const data = req.body as IProduct[];
    let inDb: IProduct[] = [];
    try {
        db.connect();

        for( let i = 0; i<data.length; i++){
            const productInDb = await Product.findOne({clave: data[i].clave});
            if( productInDb ){
                inDb.push(data[i]);
            }
        }

        if( inDb.length > 0 ) {
            await db.disconnect();
            // return res.status(200).json( inDb );
            return res.status(200).json({
                message: inDb.length > 1 
                        ? `Estos ${inDb.length} productos ya se encuentran en la base de datos`
                        :`Este producto/clave ya se encuentra en la base de datos`,
                error: true,
            })
        }

        for( let i = 0; i<data.length; i++){
            const product = new Product( data[i] );
            product.save();
        }

        await db.disconnect();
        res.status(200).json({message: "Productos almacenados correctamente", error: false });
    } catch (error) {
        console.log(error);
            await db.disconnect();
            return res.status(200).json({message: 'Revisar logs del servidor', error: true });
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    db.connect();
    const products = await Product.find().sort({createdAt: 'desc'}).lean();
    db.disconnect();

    res.status(200).json(products);
}

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '' } = req.body as IProduct;

    if( !isValidObjectId(_id)) return res.status(200).json({message:"El id del producto no es valido", error:true});

    try {
        await db.connect();
        const product = await Product.findById(_id);
        if(!product){
            await db.disconnect();
            return res.status(200).json({message:'No existe un producto con ese id', error:true});
        }
        // console.log(req.body);
        await product.updateOne( req.body );
        await db.disconnect();
        return res.status(200).json(product);
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(200).json({message:'Revisar la consola del servidor', error:true});
    }
}
const deleteProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '' } = req.body as IProduct;

    if( !isValidObjectId(_id)) return res.status(200).json({message:"El id del producto no es valido", error:true});

    try {
        await db.connect();
        const product = await Product.findById(_id);
        if(!product){
            await db.disconnect();
            return res.status(200).json({message:'No existe un producto con ese id', error:true});
        }
        await product.deleteOne({_id: _id});
        await db.disconnect;
        return res.status(200).json({message:'Producto eliminado con exito', error:false});
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(200).json({message:'Revisar la consola del servidor', error:true});
    }
}