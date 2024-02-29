import React from "react";
import { Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Button } from "@fluentui/react-components";
import { Container, Row, Col } from "react-bootstrap";
import style from "../styles/modules/about.module.css";

const AboutModal = ({ showModal, setShowModal }) => {
  return (
    <Dialog open={showModal} onOpenChange={(event, data) => setShowModal(data.open)}>
      <DialogTrigger>
        {/* Este botón no se muestra realmente, ya que controlaremos el modal desde el exterior */}
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Sobre StreetSheriff</DialogTitle>
          <DialogContent>
            <Container>
              <Row>
                <Col>
                <h2>Empoderamiento Ciudadano en Tus Manos</h2>
          <p>
            En un mundo donde la participación ciudadana define el pulso de las
            comunidades, <strong>StreetSheriff</strong> surge como la
            herramienta esencial para transformar el entorno urbano. Esta
            aplicación es el puente que conecta las inquietudes ciudadanas con
            las acciones gubernamentales, poniendo el poder de la iniciativa y
            el cambio directamente en las manos de los ciudadanos.
          </p>
          <p>
            Con <strong>StreetSheriff</strong>, cada usuario se convierte en un
            vigilante cívico, capaz de reportar problemas municipales básicos
            como fallos en la iluminación, deterioro de calles y veredas, y
            gestión de residuos, entre otros. Esta app facilita un diálogo
            constructivo entre la comunidad y el gobierno local, fomentando un
            enfoque participativo y de gobierno digital abierto.
          </p>
          <p>
            Inspirada en los principios de código libre y gobernanza
            colaborativa bottom-up, <strong>StreetSheriff</strong> empodera a
            los ciudadanos para ser agentes activos del cambio. Al democratizar
            el proceso de reporte y seguimiento de incidencias urbanas,
            fortalece el tejido social y promueve una cultura de responsabilidad
            compartida y transparencia.
          </p>
          <p>
            La verdadera belleza de <strong>StreetSheriff</strong> radica en su
            capacidad para transformar la voz ciudadana en acciones concretas.
            Es una demostración poderosa de cómo la tecnología puede servir como
            catalizador para un cambio social positivo, mejorando la calidad de
            vida de las comunidades y fomentando una relación más estrecha y
            productiva entre los ciudadanos y sus gobiernos.
          </p>
          <p>
            Únete a la revolución de StreetSheriff. Juntos, podemos hacer que el
            gobierno cumpla, mejorar nuestro entorno y construir una sociedad
            más conectada y participativa.
          </p>
          <p>Street-Sheriff was developed with love By: <span className={style.author}>Neby_X</span></p>
                </Col>
              </Row>
            </Container>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Cerrar</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default AboutModal;
