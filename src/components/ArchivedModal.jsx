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
  TableRow,
  TableCell,
} from "@fluentui/react-components";
import { query, collection, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
// Importar las dependencias para manejo de Excel
import { utils, writeFile } from "xlsx";
// Configuración de codificación para español
import { set_cptable } from "xlsx";
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';

set_cptable(cptable);

const ArchivedModal = ({ showModal, setShowModal }) => {
  const [archivedProblems, setArchivedProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArchivedProblems();
  }, []);

  const fetchArchivedProblems = async () => {
    setIsLoading(true);
    const q = query(
      collection(db, "denuncias"),
      where("status", "==", "No Resuelto"),
      orderBy("dateAdded", "desc"),
      limit(100)
    );

    try {
      const querySnapshot = await getDocs(q);
      const problems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArchivedProblems(problems);
    } catch (error) {
      console.error("Error fetching archived problems: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(archivedProblems.map(problem => ({
      Título: problem.title,
      Descripción: problem.description,
      'Fecha Inicial': new Date(problem.dateAdded).toLocaleDateString(),
      'Fecha Final': new Date(problem.dateModified).toLocaleDateString(),
      Observaciones: problem.observations,
    })), { skipHeader: false });
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Problemas No Resueltos");
    writeFile(wb, "ProblemasNoResueltos.xlsx");
  };

  return (
    <Dialog
      open={showModal}
      onOpenChange={(event, data) => setShowModal(data.open)}
    >
      <DialogSurface style={{ minWidth: "80%" }}>
        <DialogBody>
          <DialogTitle>Problemas No Resueltos</DialogTitle>
          <DialogContent>
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <Table>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Descripción</th>
                      <th>Fecha Inicial</th>
                      <th>Fecha Final</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedProblems.length > 0 ? (
                      archivedProblems.map((problem) => (
                        <TableRow key={problem.id}>
                          <TableCell>{problem.title}</TableCell>
                          <TableCell>{problem.description}</TableCell>
                          <TableCell>
                            {new Date(problem.dateAdded).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(problem.dateModified).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{problem.observations}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5}>No hay problemas no resueltos recientes.</TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </Table>
                {archivedProblems.length > 0 && (
                  <Button onClick={exportToExcel} style={{ marginTop: "20px" }}>Guardar XLSX</Button>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Cerrar</Button>
            <Button onClick={fetchArchivedProblems}>Actualizar</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default ArchivedModal;
