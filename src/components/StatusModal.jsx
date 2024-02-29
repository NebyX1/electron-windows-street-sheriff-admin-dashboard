import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Spinner,
  Table,
  TableCell,
  Select,
  Input,
} from "@fluentui/react-components";
import { IoSend } from "react-icons/io5";
import {
  query,
  collection,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Container } from "react-bootstrap";

// Importamos el modulo de estilos
import styles from "../styles/status.module.css";

const StatusModal = ({ showModal, setShowModal }) => {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtro, setFiltro] = useState("");

  // Función para obtener los casos de la base de datos
  const fetchCases = async () => {
    if (filtro === "") {
      setCases([]);
      setIsLoading(false);
      return;
    }

    let q = query(
      collection(db, "denuncias"),
      where("status", "==", filtro),
      orderBy("dateAdded", "desc")
    );

    try {
      const querySnapshot = await getDocs(q);
      const fetchedCases = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCases(fetchedCases);
    } catch (error) {
      console.error("Error fetching cases: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showModal) return;
    setIsLoading(true);
    fetchCases();
  }, [showModal, filtro]);

  // Función para actualizar el estado de un caso
  const updateCaseStatus = async (id, newStatus, observations) => {
    await updateDoc(doc(db, "denuncias", id), {
      status: newStatus,
      observations,
      dateModified: new Date().toISOString(),
    });
    // Luego de actualizar, refrescar la lista de casos
    fetchCases();
  };

  const validationSchema = yup.object({
    observations: yup
      .string()
      .required("Requerido")
      .min(20, "Debe tener al menos 20 caracteres"),
  });

  return (
    <Dialog
      open={showModal}
      onOpenChange={(event, data) => setShowModal(data.open)}
    >
      <DialogSurface style={{ minWidth: "85%" }}>
        <DialogBody>
          <DialogTitle>Casos</DialogTitle>
          <DialogContent>
            <Select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="mb-5"
            >
              <option value="">Seleccionar</option>
              <option value="Procesando">Procesando</option>
              <option value="En Conocimiento">En Conocimiento</option>
              <option value="En Obra">En Obra</option>
            </Select>
            {isLoading ? (
              <Spinner />
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th className={styles.columnTitle}>Título</th>
                    <th className={styles.columnDescription}>Descripción</th>
                    <th className={styles.columnDate}>Fecha Inicial</th>
                    <th className={styles.columnActions}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem) => (
                    <tr
                      key={caseItem.id}
                      className={`${styles.rowSeparator} ${styles.rowHoverEffect}`}
                    >
                      <TableCell className={styles.columnTitle}>
                        {caseItem.title}
                      </TableCell>
                      <TableCell className={styles.columnDescription}>
                        {caseItem.description}
                      </TableCell>
                      <TableCell className={styles.columnDate}>
                        {new Date(caseItem.dateAdded).toLocaleDateString()}
                      </TableCell>
                      <TableCell className={styles.columnActions}>
                        <Formik
                          initialValues={{
                            status: caseItem.status,
                            observations: "",
                          }}
                          validationSchema={validationSchema}
                          onSubmit={(values, { setSubmitting }) => {
                            updateCaseStatus(
                              caseItem.id,
                              values.status,
                              values.observations
                            ).then(() => {
                              setSubmitting(false);
                            });
                          }}
                        >
                          {({ handleSubmit, isSubmitting }) => (
                            <form onSubmit={handleSubmit} className="d-flex">
                              <Field
                                as="select"
                                name="status"
                                className="form-select me-2"
                              >
                                <option value="Procesando">Procesando</option>
                                <option value="En Conocimiento">
                                  En Conocimiento
                                </option>
                                <option value="En Obra">En Obra</option>
                                <option value="Resuelto">Resuelto</option>
                                <option value="No Resuelto">No Resuelto</option>
                              </Field>
                              <Container>
                                <Field
                                  className="me-2"
                                  name="observations"
                                  as={Input}
                                />
                                <ErrorMessage
                                  name="observations"
                                  component="div"
                                  className="text-danger"
                                />
                              </Container>

                              <Button
                                appearance="primary"
                                type="submit"
                                disabled={isSubmitting}
                              >
                                <IoSend className="me-2" /> Enviar
                              </Button>
                            </form>
                          )}
                        </Formik>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Cerrar</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default StatusModal;
