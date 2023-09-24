import { EmployeeLayout } from "../../components/layout";
import { Typography } from "@mui/material";

const DBPage = () => {
  return (
    <EmployeeLayout
      title="Base de datos"
      pageDescription="Aquí podrás respaldar o importar tu base de datos"
    >
      <Typography>Base de datos</Typography>
    </EmployeeLayout>
  );
};

export default DBPage;
