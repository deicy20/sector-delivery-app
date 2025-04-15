import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const dias = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

const HorarioField = () => {
  const {
    register,
    setValue,
    control,
    formState: { errors },
    clearErrors,
    setError,
  } = useFormContext();

  const horarios = useWatch({ control });

  useEffect(() => {
    if (!horarios?.horarios) return;

    let validationRequired = false;

    dias.forEach((dia) => {
      const cerrado = horarios?.horarios?.[dia]?.cerrado;
      const desde = horarios?.horarios?.[dia]?.desde;
      const hasta = horarios?.horarios?.[dia]?.hasta;

      // Validación solo si el día no está cerrado
      if (!cerrado) {
        if (!desde || !hasta) {
          if (!errors?.horarios?.[dia]) {
            setError(`horarios.${dia}`, {
              type: "manual",
              message: "Debes completar ambos campos de horario.",
            });
            validationRequired = true;
          }
        } else if (desde >= hasta) {
          if (!errors?.horarios?.[dia]) {
            setError(`horarios.${dia}`, {
              type: "manual",
              message: "La hora de inicio debe ser menor a la de fin.",
            });
            validationRequired = true;
          }
        } else {
          clearErrors(`horarios.${dia}`);
        }
      } else {
        clearErrors(`horarios.${dia}`);
      }
    });

    if (!validationRequired) {
      return;
    }
  }, [horarios, setError, clearErrors, errors]);

  const handleCheck = (dia, checked) => {
    setValue(`horarios.${dia}.cerrado`, checked);
    if (checked) {
      setValue(`horarios.${dia}.desde`, "");
      setValue(`horarios.${dia}.hasta`, "");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {dias.map((dia) => {
          const cerrado = horarios?.horarios?.[dia]?.cerrado;

          return (
            <div key={dia} className="bg-gray-50 p-4 rounded border">
              <div className="flex items-center justify-between mb-2">
                <span className="capitalize">{dia}</span>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cerrado || false}
                    onChange={(e) => handleCheck(dia, e.target.checked)}
                    className="ml-2"
                  />
                </div>
              </div>

              {cerrado && (
                <div className="mt-2 text-sm text-gray-500">Cerrado</div>
              )}

              {!cerrado && (
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700">Desde</span>
                    <input
                      type="time"
                      className="border rounded px-2 py-1"
                      {...register(`horarios.${dia}.desde`)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700">Hasta</span>
                    <input
                      type="time"
                      className="border rounded px-2 py-1"
                      {...register(`horarios.${dia}.hasta`)}
                    />
                  </div>
                </div>
              )}

              {errors?.horarios?.[dia]?.message && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.horarios[dia].message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorarioField;
