import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { createSector } from "../services/api";
import HorarioField from "./HorarioField";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SectorForm = () => {
  const methods = useForm();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");

  const fetchSuggestions = async (query) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await res.json();
    setSuggestions(data);
  };

  const handleSelect = (place) => {
    console.log("Latitud:", place.lat); // Verificar latitud
    console.log("Longitud:", place.lon); // Verificar longitud

    setValue("direccion", place.display_name);
    setValue("coordenadas.lat", parseFloat(place.lat));
    setValue("coordenadas.lng", parseFloat(place.lon));
    setSearch(place.display_name);
    setSuggestions([]);
  };

  const onSubmit = async (data) => {
    console.log("Datos a enviar:", data); // Verificar si los datos de latitud y longitud están presentes

    try {
      await createSector(data);
      toast.success("¡Sector registrado exitosamente!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      reset({
        nombre: "",
        direccion: "",
        "coordenadas.lat": "",
        "coordenadas.lng": "",
        horarios: [],
      });
      setSearch("");
    } catch (error) {
      console.error("Error al registrar el sector:", error);
      toast.error("Hubo un error al registrar el sector.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="bg-gray-100 flex items-start justify-center px-4 pt-2 pb-0">
      <div className="w-full max-w-6xl p-6 bg-white mb-8">
        <div className="flex justify-start mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Registrar Sector
          </h2>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-blue-100 shadow-md border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Datos del Sector
              </h3>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                  Nombre del sector
                </label>
                <input
                  className="w-full max-w-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                  })}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Dirección</label>
                <input
                  className="w-full max-w-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                />
                <div className="bg-white border border-gray-200 rounded mt-1 max-h-32 overflow-y-auto w-full max-w-xs">
                  {suggestions.map((place) => (
                    <div
                      key={place.place_id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSelect(place)}
                    >
                      {place.display_name}
                    </div>
                  ))}
                </div>
              </div>

              <input type="hidden" {...register("direccion")} />
              <input type="hidden" {...register("coordenadas.lat")} />
              <input type="hidden" {...register("coordenadas.lng")} />
            </div>

            <div className="bg-blue-100 shadow-md border border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Horario de Atención
              </h3>
              <HorarioField />
            </div>

            <div className="md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-8 rounded hover:bg-blue-600 transition duration-200"
              >
                Registrar Sector
              </button>
            </div>
          </form>
        </FormProvider>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SectorForm;
