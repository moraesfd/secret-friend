import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { History } from "../pages/History";
import { Home } from "../pages/Home";
import { Demo } from "../pages/Demo";

export const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
};
