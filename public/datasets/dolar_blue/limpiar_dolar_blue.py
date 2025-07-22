import pandas as pd

# 📥 Cargar el CSV del dólar blue
df_blue = pd.read_csv("Datos históricos USD_ARSB.csv")

# ✅ Paso 1: Quedarse solo con las columnas necesarias
df_blue = df_blue[["Fecha", "Último"]]

# 🧼 Paso 2: Convertir fecha y filtrar desde 2009
df_blue["fecha"] = pd.to_datetime(df_blue["Fecha"], errors="coerce")
df_blue = df_blue[df_blue["fecha"].dt.year >= 2009]

# 🔢 Paso 3: Asegurar que los valores estén en formato float
# 🔧 Reemplazar comas por puntos y eliminar símbolos
df_blue["Último"] = (
    df_blue["Último"]
    .astype(str)
    .str.replace(".", "")      # elimina punto de miles
    .str.replace(",", ".")               # cambia coma por punto
    .str.replace(r"[^\d\.]", "", regex=True)  # elimina todo excepto dígitos y punto
)

# ✅ Convertir a float
df_blue["dolar_blue"] = pd.to_numeric(df_blue["Último"], errors="coerce")

# 📆 Paso 4: Agrupar por mes y calcular promedio
df_blue["mes"] = df_blue["fecha"].dt.to_period("M")
df_blue_mensual = df_blue.groupby("mes")["dolar_blue"].mean().reset_index()

# 🔧 Paso 5: Redondear y formatear fecha
df_blue_mensual["dolar_blue"] = df_blue_mensual["dolar_blue"].round(2)
df_blue_mensual["mes"] = df_blue_mensual["mes"].dt.strftime("%Y-%m")

# 💾 Exportar CSV limpio
df_blue_mensual.to_csv("dolar_blue_avg_mensual.csv", index=False)
