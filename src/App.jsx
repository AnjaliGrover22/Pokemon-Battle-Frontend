// src/App.jsx
import "./App.css";
import MainLayout from "./components/MainLayout";
import Pokemons from "./components/Pokemons2";
import PokemonDetails from "./components/PokemonDetails2";
import Battle from "./components/Battle";
import UsernameForm from "./components/UsernameForm";
import Board from "./components/Board";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Pokemons />} />

        <Route path="/pokemons/:id" element={<PokemonDetails />} />

        <Route index element={<div>Put all pokemon element route here</div>} />
        <Route path="battlefield/id/:id" element={<Battle />} />
        <Route path="battlefield/board" element={<Board />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
