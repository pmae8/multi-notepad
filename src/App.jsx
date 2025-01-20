import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import NotePage from "./components/NotePage";
import { NotesProvider } from "./context/NotesContext";
import "./styles.css";

function App() {
  return (
    <NotesProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/note/:id" element={<NotePage />} />
          </Routes>
        </div>
      </Router>
    </NotesProvider>
  );
}

export default App;
