import { Routes, Route } from "react-router-dom";
import { History } from "../pages/History";
import { Home } from "../pages/Home";
import { Demo } from "../pages/Demo";
import { DefaultLayout } from "../layouts/DefaultLayout";

export const RouterComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  );
};
