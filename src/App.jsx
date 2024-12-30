import { useContext, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { AppContext } from './AppContext';
const BASE_DE_DATOS = 'https://taskmanager-backend-zh0d.onrender.com'

function App() {
  const {tareas, setTareas, formDatos, setFormDatos, editarTarea, setEditarTarea, titCompleto, setTitCompleto, filtroCompletada, setFiltroCompletada, modalTarea, setModalTarea} = useContext(AppContext)

  const cargarTareas = async (filtro) => {
    try{
      const url = filtro === "" ? `${BASE_DE_DATOS}/tareas` : `${BASE_DE_DATOS}/tareas?completada=${filtro}`
      const todasTareas = await axios.get(url);
      setTareas(todasTareas.data);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }

  const crearTarea = async () => {
    try{
      await axios.post(`${BASE_DE_DATOS}/tareas`, formDatos);
      cargarTareas(filtroCompletada);
      setTitCompleto('');
    } catch (error) {
      console.error('Error al subir la tarea:', error);
      setTitCompleto('El título es obligatorio');
    }
  }

  const actualizarTarea = async (id) => {
    try{
      await axios.put(`${BASE_DE_DATOS}/tareas/${id}`, formDatos);
      cargarTareas(filtroCompletada);
      setEditarTarea(null);
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  }

  const marcarCompleta = async (id, completada) =>{
    try{
      await axios.put(`${BASE_DE_DATOS}/tareas/${id}`, {completada: !completada});
      cargarTareas(filtroCompletada);
    } catch {
      console.error('Error al marcar la tarea como completada:', error);
    }
  }

  const eliminarTarea = async (id) => {
    try {
      await axios.delete(`${BASE_DE_DATOS}/tareas/${id}`);
      cargarTareas(filtroCompletada);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  }
  
  const cambiar = (e) => {
    const {name, value} = e.target;
    setFormDatos({...formDatos, [name]: value});
  }

  const subir = (e) => {
    e.preventDefault();
    if (editarTarea) {
      actualizarTarea(editarTarea);
    } else {
      crearTarea();
    }
    setFormDatos({titulo: '', descripcion:''});
  }

  const tareaEditada = (tarea) => {
    setFormDatos({titulo: tarea.titulo, descripcion: tarea.descripcion});
    setEditarTarea(tarea._id);
  }

  useEffect(() => {
    cargarTareas(filtroCompletada);
  }, [filtroCompletada])

  const detallesTarea = async (id) => {
    try{
      const respuesta = await axios.get(`${BASE_DE_DATOS}/tareas/${id}`)
      setModalTarea(respuesta.data)
    } catch (error) {
      console.error('Error al obtener detalles de la tarea:', error)
    }
  }

  const abrirModal = (id) => {
    detallesTarea(id);
  }

  const cerrarModal = () => {
    setModalTarea(null);
  }

  return (
  <>
<div className='flex items-center flex-col place-content-around text-white bg-gradient-to-b from-lilac-300 to-lilac-500 min-h-screen p-5'>
  <div className='bg-lilac-400 p-5 rounded-lg shadow-lg w-full max-w-md'>
    <h1 className="text-2xl font-semibold mb-4">Agrega una nueva tarea a tu lista</h1>
    <form className='formTarea' onSubmit={subir}>
      <h3 className="text-lg">Título</h3>
      <input type="text" name='titulo' value={formDatos.titulo} onChange={cambiar} className='p-2 text-black rounded-lg border border-lilac-200 mb-2 w-full' />
      <p className="text-red-400">{titCompleto}</p>
      <h3 className="text-lg">Descripción</h3>
      <input type="text" name='descripcion' value={formDatos.descripcion} onChange={cambiar} className='p-2 text-black rounded-lg border border-lilac-200 mb-4 w-full' />
      <button type="submit" className='bg-lilac-500 hover:bg-lilac-600 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300'>Subir</button>
    </form>
  </div>

  <div className='mt-5 w-full'>
    <div className='bg-lilac-400 p-4 rounded-lg shadow-lg max-w-md mx-auto'>
      <label htmlFor="filtro" className="text-lg">Filtrar por:</label>
      <select className='p-2 rounded-lg border border-lilac-200 w-full mt-2' value={filtroCompletada} onChange={(e) => {
        const nuevoFiltro = e.target.value;
        setFiltroCompletada(nuevoFiltro);
        cargarTareas(nuevoFiltro === "" ? "" : nuevoFiltro);
      }}>
        <option value="">Todas</option>
        <option value="true">Completadas</option>
        <option value="false">Pendientes</option>
      </select>
    </div>

    <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
      {Array.isArray(tareas) && tareas.length > 0 ? (
        tareas.reverse().map(tarea => (
          <li key={tarea._id} className='flex bg-lilac-300 p-3 rounded-lg shadow-md min-h-[60px]'>
            <input 
              type="checkbox" 
              checked={tarea.completada} 
              onChange={() => { marcarCompleta(tarea._id, tarea.completada) }} 
              className='mr-4 accent-lilac-500 w-4 h-4'
            />
            <div className='flex-1'>
              <p className='font-semibold'>{tarea.titulo}</p>
              <p>Descripción: {tarea.descripcion}</p>
              <p className='text-sm text-white'>Creada el: {new Date(tarea.creada).toLocaleDateString()}</p>
            </div>
            <div className='flex flex-col space-y-1 ml-4'>
              <button onClick={() => tareaEditada(tarea)} className='bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded-full text-sm'>Editar</button>
              <button onClick={() => eliminarTarea(tarea._id)} className='bg-red-400 hover:bg-red-500 text-white font-bold py-1 px-2 rounded-full text-sm'>Eliminar</button>
              <button onClick={() => abrirModal(tarea._id)} className='bg-green-400 hover:bg-green-500 text-white font-bold py-1 px-2 rounded-full text-sm'>Ver detalles</button>
            </div>
          </li>
        ))
      ) : (
        <li className='text-center text-gray-300'>No hay tareas disponibles.</li>
      )}
    </ul>
  </div>

  {modalTarea && (
    <div className='fixed inset-0 flex items-center justify-center bg-lilac-500 bg-opacity-70 z-50 pointer-events-auto'>
      <div className='bg-lilac-400 rounded-lg p-5 w-11/12 max-w-md'>
        <h3 className='font-bold text-white'>Id: {modalTarea._id}</h3>
        <h2 className='text-lg font-semibold text-white'>Título: {modalTarea.titulo}</h2>
        <h3 className='text-white'>Descripción: {modalTarea.descripcion}</h3>
        <p className='text-white'>Estado: {modalTarea.completada ? 'Completada' : 'Pendiente'}</p>
        <p className='text-white'>Creada el: {new Date(modalTarea.creada).toLocaleDateString()}</p>
        <button onClick={cerrarModal} className='bg-lilac-500 hover:bg-lilac-600 text-white font-bold py-2 px-4 rounded-full transition duration-300'>Cerrar</button>
      </div>
    </div>
  )}
</div>

    </>
  )
}

export default App
