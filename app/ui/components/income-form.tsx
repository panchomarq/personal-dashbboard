import { useState } from 'react';

interface FormData {
  nombre: string;
  fecha: string;
  categoria: string;
  currency: string;
  ars: string;
  tasa: string;
  usd: string;
}

const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    fecha: '',
    categoria: '',
    currency: '',
    ars: '',
    tasa: '',
    usd: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log('Ingreso agregado exitosamente');
        // Puedes redirigir a otra página aquí si lo deseas
      } else {
        throw new Error('Error al agregar ingreso');
      }
    } catch (error) {
      console.error('Error al agregar ingreso:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nombre">Nombre:</label>
      <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />

      <label htmlFor="fecha">Fecha:</label>
      <input type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} required />

      <label htmlFor="categoria">Categoría:</label>
      <input type="text" id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required />

      <label htmlFor="currency">Currency:</label>
      <input type="text" id="currency" name="currency" value={formData.currency} onChange={handleChange} required />

      <label htmlFor="ars">ARS:</label>
      <input type="text" id="ars" name="ars" value={formData.ars} onChange={handleChange} required />

      <label htmlFor="tasa">Tasa:</label>
      <input type="text" id="tasa" name="tasa" value={formData.tasa} onChange={handleChange} required />

      <label htmlFor="usd">USD:</label>
      <input type="text" id="usd" name="usd" value={formData.usd} onChange={handleChange} required />

      <button type="submit">Agregar Ingreso</button>
    </form>
  );
};

export default FormComponent;
