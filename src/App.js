import React from "react";
import SectorForm from "./components/SectorForm";
import SectorList from "./components/SectorList";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-blue-100 text-gray-800 p-6 rounded-md shadow-md mb-6">
          <h1 className="text-3xl font-semibold text-center">
            Sectores de Domicilio
          </h1>
        </header>

        <div className="mb-8">
          <div className="shadow-md rounded-lg border border-gray-200 mb-6">
            <SectorForm />
          </div>

          <div className="bg-white p-8 shadow-md rounded-lg border border-gray-200">
            <SectorList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
