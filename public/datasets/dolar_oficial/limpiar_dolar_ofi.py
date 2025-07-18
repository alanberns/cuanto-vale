import pandas as pd

# 📥 Cargá el CSV (subido a Colab o desde URL)
df = pd.read_csv("tipos-de-cambio-historicos.csv")

# ✅ Paso 1: Nos quedamos solo con las columnas deseadas
df = df[["indice_tiempo", "dolar_estadounidense"]]

# 🧼 Subpaso: Corregir valores mal formateados en "dolar_estadounidense"
# Hay valores con punto y sin punto
def normalizar_valor(valor):
    try:
        valor = str(valor).strip()
        if "." in valor:
            return float(valor)
        if valor.isdigit() and len(valor) > 3:
            # Inserta el punto 3 dígitos antes del final
            return float(valor[:-3] + "." + valor[-3:])
        return float(valor)
    except:
        return None  # en caso de error

df["dolar"] = df["dolar_estadounidense"].apply(normalizar_valor)

# 🧼 Paso 2: Filtrar desde 2009 en adelante
df["fecha"] = pd.to_datetime(df["indice_tiempo"], errors="coerce")
df = df[df["fecha"].dt.year >= 2009]

# 📆 Paso 3: Agrupar por mes y calcular promedio
df["mes"] = df["fecha"].dt.to_period("M")  # Ej: 2010-04
df_mensual = df.groupby("mes")["dolar"].mean().reset_index()

# 🔄 Convertir a fecha estándar
df_mensual["mes"] = df_mensual["mes"].dt.to_timestamp()

# 🔧 Redondear el valor del dólar a 2 decimales
df_mensual["dolar"] = df_mensual["dolar"].round(2)

# 📅 Eliminar el día: dejar sólo año y mes
df_mensual["mes"] = df_mensual["mes"].dt.strftime("%Y-%m")

# 💾 Exportar si querés
df_mensual.to_csv("dolar_oficial_promedio_mensual.csv", index=False)

