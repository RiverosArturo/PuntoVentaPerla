import { useState } from "react";
import * as XLSX from "xlsx/xlsx";
import { alerta } from "../utils";
import { ventaApi } from "../api";
import { IProduct } from "../interfaces";

export const excel = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [formatExcel, setformatExcel] = useState({
    fila: [],
  });

  // onchange event
  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        alerta.noti("Por favor selecciona un archivo excel", 1);
        setExcelFile(null);
      }
    } else {
      alerta.noti("Por favor selecciona un archivo", 1);
    }
  };

  // submit event
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    console.log("Soy excel file en submit: " + excelFile);
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const excel = XLSX.utils.sheet_to_json(worksheet);
      if (excel !== null) {
        excel.map((dat, i) => {
          if (
            dat.clave === undefined ||
            dat.descripcion === undefined ||
            dat.precio === undefined ||
            dat.cantidad === undefined
          ) {
            formatExcel.fila.push(i + 1);
            setformatExcel({
              fila: [...formatExcel.fila],
            });
          }
        });

        if (formatExcel.fila.length > 0) {
          alerta.noti(
            `Verifica que tu archivo Excel este bien estructurado, error en ${formatExcel.fila.length} filas`,
            1
          );
          // console.log("Soy excelFile:" + excelFile);
          setExcelFile(null);
          setformatExcel({ fila: [] });
        } else {
          // console.log("Ejecucion final");
          setExcelFile(null);
          setformatExcel({ fila: [] });

          // console.log(excel as IProduct[]);
          const { data } = await ventaApi({
            url: "/admin/products",
            method: "POST",
            data: excel as IProduct[],
          });
          if (!data.error) {
            alerta.noti(data.message, 2);
          } else {
            alerta.noti(data.message, 1);
          }
          console.log({ data });
        }
      }
    }
  };

  return{
    handleFile,
    handleFileSubmit,
    excelFile,
    setExcelFile,
  }
}