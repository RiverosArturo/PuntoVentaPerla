import Head from "next/head";
import { FC, ReactElement } from "react";
import { Navbar } from "../ui";
import { Typography } from "@mui/material";

interface Props {
  children?: ReactElement | ReactElement[];
  title: string;
  pageDescription: string;
}

export const EmployeeLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <nav>
        <Navbar />
      </nav>

      {/* Sidebar */}
      <main
        style={{
          margin: "80px auto",
          maxWidth: "1440px",
          padding: "0px 30px",
        }}
      >
        <Typography variant="h1" component="h1" className="fadeIn">
          {title}
        </Typography>
        {children}
      </main>
    </>
  );
};
