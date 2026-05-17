import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Homepage from "./components/pages/Homepage";
import NotFound from "./components/pages/NotFound";

const MyRoutes = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage/>} />
            <Route path="*" element={<NotFound/>} />

          </Route>
        </Routes>
      </BrowserRouter>

  );
};

export default MyRoutes;
