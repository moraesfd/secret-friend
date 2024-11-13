import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FirstVersion } from "../pages/FirstVersion";
import { Home } from "../pages/Home";

export const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstVersion />} />
        <Route path="/email" element={<Home />} />
      </Routes>
    </Router>
  );
};
