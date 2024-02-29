import ReactDOM from "react-dom/client";

//? Importamos el archivo de estilos de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

import { FluentProvider, webLightTheme } from "@fluentui/react-components";

//? Importamos el sistema de rutas
import Router from "./router/Router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <FluentProvider theme={webLightTheme}>
    <Router />
  </FluentProvider>
);
