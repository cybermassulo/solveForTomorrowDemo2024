import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import ParticipantesList from "./ParticipantesList"; // Import the ParticipantesList component
import ProjetosList from "./ProjetosList"; // Import the ProjetosList component
import OrientadoresList from "./OrientadoresList"; // Import the OrientadoresList component

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/participantes" element={<ParticipantesList />} />
        <Route path="/projetos" element={<ProjetosList />} />
        <Route path="/orientadores" element={<OrientadoresList />} />
      </Routes>
    </Router>
  );
}

export default App;
