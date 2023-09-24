import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import {
  CircleOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";

export const Navbar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    router.push(`/search/${searchTerm}`);
  };

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/home" passHref legacyBehavior>
          <Link display="flex" alignItems="center" sx={{ color: "#0B7CED" }}>
            <Typography variant="h6">
              La <CircleOutlined />
            </Typography>
            <Typography variant="h6" sx={{ marginLeft: 0.5 }}>
              Perla
            </Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box
          sx={{
            display: isSearchVisible ? "none" : { xs: "none", sm: "block" },
          }}
          className="fadeIn"
        >
          <NextLink href="/usuarios" passHref legacyBehavior>
            <Link>
              <Button
                color={router.asPath === "/usuarios" ? "info" : "primary"}
              >
                Usuarios
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/ventas" passHref legacyBehavior>
            <Link>
              <Button color={router.asPath === "/ventas" ? "info" : "primary"}>
                Ventas
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/apartados" passHref legacyBehavior>
            <Link>
              <Button
                color={router.asPath === "/apartados" ? "info" : "primary"}
              >
                Apartados
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/cortes" passHref legacyBehavior>
            <Link>
              <Button color={router.asPath === "/cortes" ? "info" : "primary"}>
                Cortes
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/inventario" passHref legacyBehavior>
            <Link>
              <Button
                color={router.asPath === "/inventario" ? "info" : "primary"}
              >
                Inventario
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/baseDeDatos" passHref legacyBehavior>
            <Link>
              <Button
                color={router.asPath === "/baseDeDatos" ? "info" : "primary"}
              >
                Base de datos
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        {/* Pantallas pequeñas */}
        <IconButton
          sx={{ display: { xs: "flex", sm: "none" } }}
          //   onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref legacyBehavior>
          <Link>
            <IconButton>
              <Badge
                // badgeContent={numberOfItems > 9 ? "+9" : numberOfItems}
                color="secondary"
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        {/* <Button onClick={toggleSideMenu}>Menú</Button> */}
      </Toolbar>
    </AppBar>
  );
};
