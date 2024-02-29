import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  Textarea,
} from "@fluentui/react-components";
import { Container, Row, Col, Form } from "react-bootstrap";
import { db } from "../firebase/firebase-config";
import { query, collection, where, getDocs } from "firebase/firestore";
import GeneratePdfDocument from "./GeneratePdfDocument";

const ReportModal = ({ showModal, setShowModal }) => {
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [complaints, setComplaints] = useState([]);

  // Definir fetchComplaints fuera de useEffect para que esté en el ámbito del componente.
  const fetchComplaints = async () => {
    const q = query(
      collection(db, "denuncias"),
      where("status", "==", "En Conocimiento")
    );
    const querySnapshot = await getDocs(q);
    const fetchedComplaints = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setComplaints(fetchedComplaints);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const formik = useFormik({
    initialValues: {
      areaCompetente: "",
      comentarios: "",
    },
    validationSchema: yup.object({
      areaCompetente: yup.string().required("Requerido"),
      comentarios: yup.string().required("Requerido"),
    }),
    onSubmit: (values) => {
      const selectedComplaintData = complaints.find(
        (complaint) => complaint.id === selectedComplaint
      );
      if (selectedComplaintData) {
        const dataForPdf = {
          ...selectedComplaintData,
          area: values.areaCompetente,
          comentarios: values.comentarios,
        };
        // Ahora puedes llamar a GeneratePdfDocument aquí si es necesario
        GeneratePdfDocument(dataForPdf);
      }
    },
  });

  return (
    <Dialog
      open={showModal}
      onOpenChange={(event, data) => setShowModal(data.open)}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Generar Reporte</DialogTitle>
          <DialogContent>
            <Container>
              <Row>
                <Col>
                  <Form onSubmit={formik.handleSubmit}>
                    <Select
                      label="Seleccione la denuncia"
                      name="selectedComplaint"
                      value={selectedComplaint}
                      onChange={(event) =>
                        setSelectedComplaint(event.target.value)
                      }
                    >
                      <option value="">Seleccione una denuncia</option>
                      {complaints.map((complaint) => (
                        <option key={complaint.id} value={complaint.id}>
                          {complaint.title}
                        </option>
                      ))}
                    </Select>
                    <Form.Group controlId="areaCompetente">
                      <Form.Label>Área Competente</Form.Label>
                      <Form.Control
                        type="text"
                        name="areaCompetente"
                        onChange={formik.handleChange}
                        value={formik.values.areaCompetente}
                      />
                    </Form.Group>
                    <Form.Group controlId="comentarios">
                      <Form.Label>Comentarios</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="comentarios"
                        onChange={formik.handleChange}
                        value={formik.values.comentarios}
                      />
                    </Form.Group>
                    <Button type="submit">Generar Reporte</Button>
                  </Form>
                </Col>
              </Row>
            </Container>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Cerrar</Button>
            <Button onClick={fetchComplaints}>Actualizar</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default ReportModal;
