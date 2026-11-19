import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase/config";

function App() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim()) {
      setMensaje("Por favor llena nombre y correo.");
      return;
    }

    setEnviando(true);
    setMensaje("");

    try {
      await addDoc(collection(db, "registros_prueba"), {
        nombre: nombre.trim(),
        correo: correo.trim(),
        creadoEn: serverTimestamp(),
      });
      setMensaje("¡Listo! Se guardó en Firebase.");
      setNombre("");
      setCorreo("");
    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje("Hubo un error al enviar. Revisa la consola.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Prueba React + Firebase</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="email"
          placeholder="Tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          style={{ padding: "8px" }}
        />
        <button type="submit" disabled={enviando} style={{ padding: "10px", cursor: "pointer" }}>
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>
      {mensaje && <p style={{ marginTop: "12px" }}>{mensaje}</p>}
    </div>
  );
}

export default App;