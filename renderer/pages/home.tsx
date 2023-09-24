import React from "react";
import Typography from "@mui/material/Typography";
import { EmployeeLayout } from "../components/layout";

function Home() {
  return (
    <EmployeeLayout
      title="PUNTO DE VENTA - LA PERLA"
      pageDescription="Podras cobrar a los clientes desde aqui"
    >
      <Typography variant="h2" sx={{ mb: 1 }}>
        Ventas realizadas hoy:
      </Typography>
    </EmployeeLayout>
  );
}

export default Home;
