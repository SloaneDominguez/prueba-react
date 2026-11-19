import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase/config";

function App() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  const obtenerRegistros = async () => {
    setCargandoLista(true);
    try {
      const snapshot = await getDocs(collection(db, "registros_prueba"));
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRegistros(datos);
    } catch (error) {
      console.error("Error al leer registros:", error);
    } finally {
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    obtenerRegistros();
  }, []);

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
      setMensaje("¡Registro guardado!");
      setNombre("");
      setCorreo("");
      await obtenerRegistros();
    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje("Hubo un error al guardar. Revisa la consola.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: "520px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Prueba React + Firebase</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
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

      <h3 style={{ marginTop: "28px" }}>Registros guardados</h3>

      {cargandoLista ? (
        <p>Cargando registros...</p>
      ) : registros.length === 0 ? (
        <p>Aún no hay registros.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px" }}
        >
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
