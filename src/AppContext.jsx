import React, {createContext, useState} from 'react';

export const AppContext= createContext();

export const AppProvider = ({children}) => {
  const [tareas, setTareas] = useState([]);
  const [formDatos, setFormDatos] = useState({titulo: '', descripcion: ''});
  const [editarTarea, setEditarTarea] = useState(null);
  const [titCompleto, setTitCompleto] = useState('');
  const [filtroCompletada, setFiltroCompletada] = useState('');
  const [modalTarea, setModalTarea] = useState(null);

  return (
    <AppContext.Provider value={{tareas, setTareas, formDatos, setFormDatos, editarTarea, setEditarTarea, titCompleto, setTitCompleto, filtroCompletada, setFiltroCompletada, modalTarea, setModalTarea}}>
        {children}
    </AppContext.Provider>
  )
}