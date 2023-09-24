// import { NextApiRequest } from "next";

// import { Server } from "socket.io";
// import { NextApiResponseServerIO } from "../../types";
// import { db } from "../../database";
// import { Product } from "../../models";



// export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {

//     if (res.socket.server.io) {
//         console.log('Socket is already running');
//     } else {
//         console.log('Socket is initializing');
//         // const httpServer: NetServer = res.socket.server as any;
//         const io = new Server(res.socket.server as any,{
//             cors:{
//                 origin: '*'
//             }
//         });
//         res.socket.server.io = io;
    
//         io.on('connection', socket => {
//             console.log(`Cliente ${socket.id} conectado`);

//             socket.on('disconnect', ()=>{
//                 console.log(`Cliente ${socket.id} desconectado`);
//             })

//             socket.on('input-change', msg => {
//                 console.log("Soy msg:", msg);
//                 socket.broadcast.emit('update-input', msg, socket.id);
//             })

//             socket.on('view-data',async(data)=>{
//                 console.log('Soy data: ', data);
//                 await db.connect();
//                 const products = await Product.find().sort({createdAt: 'desc'}).lean();
//                 console.log(products.length, data.length);
//                 if( products.length !== data.length ){
//                     console.log('Soy receive-data');
//                     await socket.emit('receive-data',products);
//                     await db.disconnect();
//                     return;
//                 }
//                 await db.disconnect();
//             })

//             socket.on('hola',()=>{
//                 console.log(`Hola ${socket.id}`);
//             })
//         })
//     }
//     res.end();

// };


// // import{ Server } from 'socket.io';

// // import type { NextApiRequest, NextApiResponse } from 'next'

// // type Data = {
// //     message: string
// // }

// // export default function handler(req, res) {
// //     if (res.socket.server.io) {
// //         console.log('Socket is already running');
// //       } else {
// //         console.log('Socket is initializing');
// //         const io = new Server(res.socket.server);
// //         res.socket.server.io = io;

// //         io.on('connection', socket => {
// //             console.log('Cliente conectado!!!')
// //             socket.on('input-change', msg => {
// //               socket.broadcast.emit('update-input', msg)
// //             })
// //           })
// //       }
// //       res.end();
// // }




