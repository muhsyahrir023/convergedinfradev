import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useSoftUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brand from "assets/images/logo-bi.png";
import { mainRoutes, loginRoutes } from "routes"; // Import rute-rute terpisah untuk dashboard dan login
import { IconButton } from "@mui/material";

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { direction, layout, sidenavColor } = controller;
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, true);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  // Memeriksa apakah tampilan saat ini adalah tampilan login
  const isLoginView = pathname === "/login";

  // Menentukan apakah harus menampilkan Sidenav berdasarkan layout dan apakah bukan tampilan login
  const shouldShowSidenav = layout === "dashboard" && !isLoginView;

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {shouldShowSidenav && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={brand}
              brandName="Converged Infra Dev"
              routes={mainRoutes} // Gunakan rute utama untuk dashboard
            />
            <Configurator />
            <SoftBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="3.5rem"
              height="3.5rem"
              bgColor="white"
              shadow="sm"
              borderRadius="50%"
              position="fixed"
              right="2rem"
              bottom="2rem"
              zIndex={99}
              color="dark"
              sx={{ cursor: "pointer" }}
              onClick={handleConfiguratorOpen}
            >
              <IconButton size="medium">
                <i className="material-icons">settings</i>
              </IconButton>
            </SoftBox>
          </>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          {getRoutes(mainRoutes)} {/* Gunakan rute utama untuk dashboard */}
          {getRoutes(loginRoutes)} {/* Gunakan rute login untuk halaman login */}
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {shouldShowSidenav && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={brand}
            brandName="Converged Infra Dev"
            routes={mainRoutes} // Gunakan rute utama untuk dashboard
          />
          <Configurator />
          <SoftBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3.5rem"
            height="3.5rem"
            bgColor="white"
            shadow="sm"
            borderRadius="50%"
            position="fixed"
            right="2rem"
            bottom="2rem"
            zIndex={99}
            color="dark"
            sx={{ cursor: "pointer" }}
            onClick={handleConfiguratorOpen}
          >
            <IconButton size="medium">
              <i className="material-icons">settings</i>
            </IconButton>
          </SoftBox>
        </>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        {getRoutes(mainRoutes)} {/* Gunakan rute utama untuk dashboard */}
        {getRoutes(loginRoutes)} {/* Gunakan rute login untuk halaman login */}
      </Routes>
    </ThemeProvider>
  );
}