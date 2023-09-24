import mongoose, { Schema, model, Model } from "mongoose";
import { IProduct } from "../interfaces/product";

const productSchema = new Schema({
    clave: { type: String, require: true},
    descripcion: { type: String, require: true },
    precio: { type: Number, require: true},
    cantidad: { type: Number, require: true},
},{
    timestamps: true,
});

productSchema.index({ clave: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);

export default Product;