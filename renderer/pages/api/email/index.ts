import type { NextApiRequest, NextApiResponse } from 'next';
import { transporter } from '../../../utils';
import { IOrder } from '../../../interfaces';

type Data = {
    message: string, error: boolean,
}

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ){
        case 'POST':
            return sendEmail(req,res);
        default: 
            return res.status(200).json({ message: 'Bad request', error: true});
    }

    
}

const sendEmail = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const data = req.body as IOrder;
    console.log(data);
    if(data.correo === undefined){
        return res.status(200).json({message: 'Datos no encontrados', error:true});
    }

    const html = data.orderItems.map(prod => {
        return `<tr key=${prod.clave}>
            <td colspan="2" style="text-align: center;">${prod.cantidad}</td>
            <td colspan"2">${prod.descripcion} <strong>${prod.clave}</strong></td>
            <td colspan="2" style="text-align: center;">$${prod.precio}</td>
        </tr>`
    })
    const html2 = html.join();
    const html3 = html2.replace(/,/g, '');
    //Fecha
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const año = fechaActual.getFullYear();
    const fecha = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año}`;
    // Hora
    const hora = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const horaF = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    let apartado;

    if (data.purchase === 'apartado'){
        apartado = `
        <tr>
        <td colspan="2">- - - - - - - - - - - - - - - - - - - - - - - - - - - -</td>
        <td colspan="2">- - - - - - - -</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Información Apartado</strong></td>
        </tr>
        <tr>
            <td colspan="2">Abono</td>
            <td colspan="2">$${data.abono}</td>
        </tr>
        <tr>
        <td colspan="2">Restante</td>
        <td colspan="2">$${data.restante}</td>
    </tr>
        `
    }

    try {
        await transporter.sendMail({
            from: '"Joyería La Perla 💎" <arturoriveroshernandez@gmail.com>', // sender address
            to: `${data.correo}`, // list of receivers
            subject: "Ticket de compra 'Joyeria la Perla' ", // Subject line
            html: `
            <div style="width: 300px; margin: 0 auto; padding: 10px; border: 1px solid #000; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);">
                <div style="text-align: center; font-size: 1.2em; font-weight: bold; color: black;">JOYERÍA "LA PERLA"</div>
                <p>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</p>
                <div style="text-align: center; font-size: 0.9em; font-weight: bold; color: black;">TICKET DE COMPRA</div>
                <div style="text-align: center; font-size: 0.7em; font-weight: bold; color: black;">Centro comercial La Perla, Local 70-A, Teziutlán, Puebla.</div>
                <div>
                    <table>
                        <tr>
                        <td colspan="2">- - - - - - - - - - - - - - - - - - - - - - - - - - - -</td>
                        <td colspan="2">- - - - - - - -</td>
                        </tr>
                        <tr>
                            <td colspan="2"><strong>Productos</strong></td>
                        </tr>
                        <tr>
                            <td colspan="2">No. Productos</td>
                            <td colspan="2">${data.numberOfItems}</td>
                        </tr>
                        <tr>
                            <td>
                                <table>
                                    <tr>
                                        <th colspan="2" style="text-align: center;">Cantidad</th>
                                        <th colspan="2" style="text-align: center;">Articulo</th>
                                        <th colspan="2" style="text-align: center;">P.Unit</th>
                                    </tr>
                                    ${html3}
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">- - - - - - - - - - - - - - - - - - - - - - - - - - - -</td>
                            <td colspan="2">- - - - - - - -</td>
                        </tr>
                        <tr>
                            <td colspan="2">Método de pago</td>
                            <td colspan="2"><strong>${data.purchase}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="2">Fecha</td>
                            <td colspan="2"><strong>${fecha}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="2">Hora</td>
                            <td colspan="2"><strong>${horaF}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="2">- - - - - - - - - - - - - - - - - - - - - - - - - - - -</td>
                            <td colspan="2">- - - - - - - -</td>
                        </tr>
                        <tr>
                            <td colspan="2">Subtotal</td>
                            <td colspan="2">$${data.subTotal}</td>
                        </tr>
                        <tr>
                            <td colspan="2">Descuento</td>
                            <td colspan="2">$${data.descuento}</td>
                        </tr>
                        <tr>
                            <td colspan="2"><strong>Total</strong></td>
                            <td colspan="2"><strong>$${data.total}</strong></td>
                        </tr>
                        ${apartado ?apartado:''}
                        <tr>
                            <td colspan="2">- - - - - - - - - - - - - - - - - - - - - - - - - - - -</td>
                            <td colspan="2">- - - - - - - -</td>
                        </tr>
                    </table>
                </div>
                <div style="text-align: center; font-size: 0.9em; font-weight: bold;">¡GRACIAS POR SU PREFERENCIA!</div>
            </div>`,
          });
        return res.status(200).json({ message: 'Ticket enviado correctamente', error: false })
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: 'Algo salió mal', error: true })
    }
}
