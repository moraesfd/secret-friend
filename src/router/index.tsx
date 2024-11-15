import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Historico } from "../pages/Historico";

export const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </Router>
  );
};
