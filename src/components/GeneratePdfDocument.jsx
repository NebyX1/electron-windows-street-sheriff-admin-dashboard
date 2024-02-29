import jsPDF from 'jspdf';

const GeneratePdfDocument = (documentData) => {
  const doc = new jsPDF();
  let y = 20; // vertical position for elements

  const addMultilineText = (text, size, x, y) => {
    doc.setFontSize(size);
    const splitTitle = doc.splitTextToSize(text, 180); // width of text area
    doc.text(splitTitle, x, y);
    return y + splitTitle.length * size * 0.352777778; // returns new y position
  };

  y = addMultilineText(documentData.title, 18, 15, y);
  y += 10; // add some padding

  y = addMultilineText('Descripción dada por el denunciante:', 12, 15, y);
  y += 10; // add some padding

  y = addMultilineText(documentData.description, 10, 15, y);
  y += 10; // add some padding

  y = addMultilineText('Detalle del Reporte:', 12, 15, y);
  y += 10; // add some padding

  const details = 
    `Estado: ${documentData.status}\n` +
    `Fecha Inicial: ${new Date(documentData.dateAdded).toLocaleDateString()}\n` +
    `Fecha de Tomado Conocimiento: ${new Date(documentData.dateModified).toLocaleDateString()}\n` +
    `Tipo de Problema: ${documentData.type}\n` +
    `Observaciones: ${documentData.observations}\n` +
    `Área a la que le compete: ${documentData.area}\n` +
    `Ubicación: Latitud: ${documentData.location.lat}, Longitud: ${documentData.location.lng}\n` +
    `Comentarios: ${documentData.comentarios}`;

  y = addMultilineText(details, 10, 15, y);

  // Check if we need to add a new page
  if (y > 280) { // 280 is an approximate value before reaching the end of the page
    doc.addPage();
    y = 20; // Reset y position to top of new page
  }

  doc.save('reporte.pdf');
};

export default GeneratePdfDocument;