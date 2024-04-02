import pandas as pd

# Leer el archivo Excel
df = pd.read_excel('experiment.xlsx')

# Convertir el DataFrame a un diccionario de Python
data_dict = df.to_dict(orient='records')

# Escribir los datos en un archivo JavaScript
with open('data.js', 'w') as f:
    # Escribir el encabezado del objeto JavaScript
    f.write('const data = ')
    # Convertir el diccionario a formato JSON y escribirlo en el archivo
    f.write(str(data_dict))
    f.write(';')

print("Datos guardados en 'data.js'")
