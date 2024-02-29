//? Importamos los componentes de React Router para generar el sistema de rutas de la app
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";

//? Importamos todas las views para poder usarlas en las rutas
import App from "../App.jsx";
import Home from "../Views/Home.jsx";
import Login from "../Views/Login.jsx";

import useAuth from "../auth/useAuth.js"; // Asegúrate de que la ruta sea correcta

const Router = () => {
  const { user } = useAuth(); // Accedemos al estado de autenticación

  //? Crear el sistema de rutas
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to={user ? "/home" : "/login"} replace />} />
          <Route
            path="/home"
            element={
              user ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/home" replace /> : <Login />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default Router;