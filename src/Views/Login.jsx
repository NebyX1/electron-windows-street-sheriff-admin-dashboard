import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import {
  Button,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Text,
  Input,
  Label,
  LargeTitle,
  Subtitle1,
} from "@fluentui/react-components";
import { useId } from "@fluentui/react-utilities";
import { Container, Row, Col } from "react-bootstrap";
import useAuth from "../auth/useAuth";
import AppLogo from "../assets/Logo.png";
import { IoLogInOutline } from "react-icons/io5";

// Importamos el modulo de estilos
import styles from "../styles/login.module.css";

// Esquema de validación
const validationSchema = yup.object({
  email: yup
    .string()
    .email("Ingrese un correo válido")
    .required("El correo es obligatorio"),
  password: yup.string().required("La contraseña es obligatoria"),
});

const Login = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const emailId = useId("email");
  const passwordId = useId("password");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        login(userCredential.user); // Actualiza el estado de autenticación
        setError(""); // Limpia errores anteriores si la autenticación es exitosa
      } catch (error) {
        // Asegurándonos de que accedemos correctamente al código de error.
        const errorCode = error.code;
        switch (errorCode) {
          case "auth/invalid-credential":
            setError("Usuario o Contraseña incorrectos.");
            break;
          case "auth/network-request-failed":
            setError("Problema de conexión a Internet. Por favor, verifica tu conexión.");
            break;
          default:
            console.error(error); // Agregar esta línea puede ayudar a depurar errores inesperados
            setError("Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.");
        }
      }
    },
  });

  return (
    <>
      {/* Header de nuestro componente de login */}
      <Container className="text-center mt-4">
        <img
          src={AppLogo}
          alt="StreetSheriff"
          className={`mb-5 ${styles.imgFormat}`}
        />
        <Row className="text-center">
          <LargeTitle align="center" className="mb-2">
            Bienvenido a StreetSheriff
          </LargeTitle>
          <Subtitle1 align="center" className="mb-2">
            El sistema de gestión de reclamos ciudadanos más eficiente del mundo
          </Subtitle1>
        </Row>
      </Container>

      {/* Form de inicio de sesión de nuestro componente de login */}
      <Container>
        <Col xs={12} md={6} className="m-auto p-5">
          <form onSubmit={formik.handleSubmit}>
            <Row className="mb-3">
              <Label htmlFor={emailId}>Correo</Label>
              <Input
                id={emailId}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                aria-describedby={
                  formik.touched.email && formik.errors.email
                    ? "emailError"
                    : undefined
                }
              />
              {formik.touched.email && formik.errors.email && (
                <Text className="text-danger" id="emailError">
                  {formik.errors.email}
                </Text>
              )}
            </Row>

            <Row className="mb-3">
              <Label htmlFor={passwordId}>Contraseña</Label>
              <Input
                type="password"
                id={passwordId}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                aria-describedby={
                  formik.touched.password && formik.errors.password
                    ? "passwordError"
                    : undefined
                }
              />
              {formik.touched.password && formik.errors.password && (
                <Text className="text-danger" id="passwordError">
                  {formik.errors.password}
                </Text>
              )}
            </Row>

            <Row>
              <Button className="mb-3" appearance="primary" type="submit">
              <IoLogInOutline className="me-2"/> Iniciar Sesión
              </Button>
              <Text className="mb-3" weight="medium" align="center" size={400}>
                Por favor, introduce tu mail y contraseña para acceder al panel
                de gestión de reclamos ciudadanos.
              </Text>
            </Row>
          </form>
          {error && (
            <MessageBar>
              <MessageBarBody>
                <MessageBarTitle>Error</MessageBarTitle>
                {error}
              </MessageBarBody>
            </MessageBar>
          )}
        </Col>
      </Container>
    </>
  );
};

export default Login;
