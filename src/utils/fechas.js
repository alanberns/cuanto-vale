// Convierte "2022-02" en "Febrero 2022"
export const formatearMes = (fechaStr) => {
    if (!fechaStr) return "";
    const [año, mes] = fechaStr.split("-");
    const fecha = new Date(`${año}-${mes}-01`);
    return fecha.toLocaleString("es-AR", { month: "long" }) + " " + año;
  };
  
  // Rango de fechas válidas según tus datos
  const fechaMinima = "2009-01";
  const fechaMaxima = "2025-06";
  
  // Verifica si una fecha está dentro del rango permitido
  export const esFechaValida = (fecha) => {
    return fecha >= fechaMinima && fecha <= fechaMaxima;
  };
  
  // Exportar también los límites si los querés usar en inputs
  export const limitesFecha = {
    min: fechaMinima,
    max: fechaMaxima,
  };
  