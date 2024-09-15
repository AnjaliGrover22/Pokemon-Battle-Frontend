import { useState } from "react";
import "./App.css";
import MainLayout from "./components/MainLayout";
/*import Pokemons from "./components/Pokemons";
import PokemonDetails from "./components/PokemonDetails";*/
import Pokemons from "./components/Pokemons2";
import PokemonDetails from "./components/PokemonDetails2";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Pokemons />} />
        {/*<Route path="/pokemons" element={<Pokemons />} /> */}
        <Route path="/pokemons/:id" element={<PokemonDetails />} />
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
