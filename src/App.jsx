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
  console.log("1. Iniciando envío", {
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  });
    
  try {
    console.log("2. Antes de addDoc");
    await addDoc(collection(db, "registros_prueba"), {
      nombre: nombre.trim(),
      correo: correo.trim(),
      creadoEn: serverTimestamp(),
    });
    console.log("3. Guardado con éxito");
    ...
  } catch (error) {
    console.error("4. Error en addDoc:", error);
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
