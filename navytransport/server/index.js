const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-pdf', async (req, res) => {
  const { dni, name, shift, includeCar } = req.body;
  const qrData1 = Math.random().toString(36).substring(2, 12);
  const qrData2 = includeCar ? Math.random().toString(36).substring(2, 12) : null;

  const doc = new PDFDocument();
  const filename = `boleto_${dni}.pdf`;

  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(18).text('Boleto Ferry - NavyTransport', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`DNI: ${dni}`);
  doc.text(`Nombre: ${name}`);
  doc.text(`Turno: ${shift}`);
  doc.text(`Incluye Auto: ${includeCar ? 'Sí' : 'No'}`);
  doc.moveDown();

  // QR principal
  const qr1 = await QRCode.toDataURL(qrData1);
  doc.text('QR del pasajero:');
  doc.image(Buffer.from(qr1.split(',')[1], 'base64'), { width: 100 });

  if (includeCar) {
    const qr2 = await QRCode.toDataURL(qrData2);
    doc.moveDown().text('QR del boleto:');
    doc.image(Buffer.from(qr2.split(',')[1], 'base64'), { width: 100 });
  }

  doc.end();
});

app.listen(4000, () => console.log('Servidor corriendo en http://localhost:4000'));
