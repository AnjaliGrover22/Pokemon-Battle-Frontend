import { useState } from "react";
import "./App.css";
import MainLayout from "./components/MainLayout";
import Battle from "./components/Battle";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Board from "./components/Board";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={""} />
        <Route path="battlefield" element={<Battle />} />
        <Route path="battlefield/board" element={<Board />} />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
