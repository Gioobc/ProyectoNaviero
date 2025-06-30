import React, { useState } from 'react';

function App() {
  const [dni, setDni] = useState('');
  const [fullName, setFullName] = useState('');
  const [shift, setShift] = useState('');
  const [includeCar, setIncludeCar] = useState(false);
  const [qrCode1, setQrCode1] = useState('');
  const [qrCode2, setQrCode2] = useState('');
  const [generated, setGenerated] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch('/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, name: fullName, shift, includeCar }),
      });

      if (!response.ok) throw new Error('Error en la generación del PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `boleto_${dni}.pdf`;
      link.click();

      const qr1 = Math.random().toString(36).substring(2, 12);
      const qr2 = includeCar ? Math.random().toString(36).substring(2, 12) : null;
      setQrCode1(qr1);
      if (qr2) setQrCode2(qr2);
      setGenerated(true);
    } catch (error) {
      alert('ERROR\n' + error.message);
      console.error(error);
    }
  };

  return (
    <div style={{
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      textAlign: 'center',
      padding: '40px',
      backgroundColor: '#f4f6f8',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '2.8rem', color: '#2c3e50', marginBottom: '10px' }}>Bienvenido a NavyTransport!</h1>
      <p style={{ fontSize: '1.4rem', color: '#34495e', marginBottom: '40px' }}>
        Realiza la compra de tu boleto <strong>AQUÍ</strong>
      </p>

      <div style={{
        display: 'inline-block',
        backgroundColor: '#fff',
        padding: '30px 40px',
        borderRadius: '12px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label>DNI:</label><br />
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Nombres y Apellidos:</label><br />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Turno:</label><br />
          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          >
            <option value="">Seleccionar turno</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="4:00 PM">4:00 PM</option>
          </select>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label>
            <input
              type="checkbox"
              checked={includeCar}
              onChange={(e) => setIncludeCar(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            ¿Incluir auto?
          </label>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleDownload}
            style={{
              backgroundColor: '#3498db',
              color: '#fff',
              padding: '12px 25px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Descargar boleto
          </button>
        </div>
      </div>

      {generated && (
        <div style={{ marginTop: '40px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>QR del pasajero:</p>
          <div style={{
            fontFamily: 'monospace',
            backgroundColor: '#ecf0f1',
            padding: '10px 15px',
            display: 'inline-block',
            borderRadius: '8px',
            marginBottom: '15px'
          }}>{qrCode1}</div>

          {includeCar && (
            <>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '25px' }}>QR del auto:</p>
              <div style={{
                fontFamily: 'monospace',
                backgroundColor: '#ecf0f1',
                padding: '10px 15px',
                display: 'inline-block',
                borderRadius: '8px'
              }}>{qrCode2}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
