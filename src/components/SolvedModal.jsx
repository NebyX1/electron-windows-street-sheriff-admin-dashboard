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

const SolvedModal = ({ showModal, setShowModal }) => {
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSolvedProblems();
  }, []);

  const fetchSolvedProblems = async () => {
    setIsLoading(true);
    const q = query(
      collection(db, "denuncias"),
      where("status", "==", "Resuelto"),
      orderBy("dateAdded", "desc"),
      limit(100)
    );

    try {
      const querySnapshot = await getDocs(q);
      const problems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSolvedProblems(problems);
    } catch (error) {
      console.error("Error fetching solved problems: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(solvedProblems.map(problem => ({
      Título: problem.title,
      Descripción: problem.description,
      'Fecha Inicial': new Date(problem.dateAdded).toLocaleDateString(),
      'Fecha Final': new Date(problem.dateModified).toLocaleDateString(),
      Observaciones: problem.observations,
    })), { skipHeader: false });
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Problemas Resueltos");
    writeFile(wb, "ProblemasResueltos.xlsx");
  };

  return (
    <Dialog
      open={showModal}
      onOpenChange={(event, data) => setShowModal(data.open)}
    >
      <DialogSurface style={{ minWidth: "80%" }}>
        <DialogBody>
          <DialogTitle>Problemas Resueltos</DialogTitle>
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
                    {solvedProblems.length > 0 ? (
                      solvedProblems.map((problem) => (
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
                        <TableCell colSpan={5}>No hay problemas resueltos recientes.</TableCell>
                      </TableRow>
                    )}
                  </tbody>
                </Table>
                {solvedProblems.length > 0 && (
                  <Button onClick={exportToExcel} style={{ marginTop: "20px" }}>Guardar XLSX</Button>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Cerrar</Button>
            <Button onClick={fetchSolvedProblems}>Actualizar</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default SolvedModal;
