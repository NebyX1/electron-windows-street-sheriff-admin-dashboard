import React from "react";
import { Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Button } from "@fluentui/react-components";
import { Container, Row, Col, Image } from "react-bootstrap";

const IssueModal = ({ showModal, setShowModal, selectedProblema }) => {
  return (
    <Dialog open={showModal} onOpenChange={(event, data) => setShowModal(data.open)}>
      <DialogTrigger>
        {/* Este botón no se muestra realmente, ya que controlaremos el modal desde el exterior */}
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Detalles del Problema</DialogTitle>
          <DialogContent>
            {selectedProblema && (
              <Container>
                <Row className="mb-3">
                  <Col><strong>Título:</strong> {selectedProblema.title}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Descripción:</strong> {selectedProblema.description}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Fecha:</strong> {new Date(selectedProblema.dateAdded).toLocaleDateString('es')}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Estado:</strong> {selectedProblema.status}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Tipo:</strong> {selectedProblema.type}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Observaciones:</strong> {selectedProblema.observations}</Col>
                </Row>
                <Row className="mb-3">
                  <Col><strong>Imagen del Problema:</strong></Col>
                </Row>
                <Row>
                  <Col>
                    <Image src={selectedProblema.imageUrl} style={{maxHeight: "300px"}} alt="Imagen del problema" fluid />
                  </Col>
                </Row>
              </Container>
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

export default IssueModal;
