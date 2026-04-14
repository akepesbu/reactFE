import { useState, useEffect } from "react";
import styles from "../components/TodoApp.module.css";
import "./TodoForm/TodoForm"
import TodoForm from "./TodoForm/TodoForm";
import EditNoteForm from "./EditNoteForm/EditNoteForm";
import { SquarePen, CircleX, CirclePlus } from "lucide-react";


function TodoApp(){

    const [notas, setNotas] = useState([]);
    const [notaEditandoId, setNotaEditandoId]  = useState(null);

    useEffect(() => {

        const fetchData = async() => {

            try{

                    const response = await fetch("http://localhost:3000/notas")

                    if(!response.ok){

                        throw new Error(`Error http: ${respose.status}`);

                    }

                    const data = await response.json();
                    setNotas(data);

            }catch (error){

                    console.log(error);
                
            }

        };

        fetchData();

    }, []);

    const agregarNota = (nuevaNota) => {

        setNotas([...notas, nuevaNota])

    }

    const eliminarNota = (id) => {

        setNotas(notas.filter(nota => nota.id != id));
        fetch(`http://localhost:3000/notas/${id}`, {
            method:"DELETE"

        })
        .then(response => {

            if(!response.ok){
                throw new Error(`Error al eliminar la nota: ${response.status}`)
            }
            console.log("Nota eliminada correctamente")
        })
        .catch((error) => console.error(error));

    };
    const actualizarNota = (notaActualizada) => {

        setNotas(notas.map(nota =>  {

            return nota.id === notaActualizada.id ? notaActualizada: nota;

        }))

    };

    const marcarComoCompleta = async (notaId) => {

        try{
            const nota = notas.find(nota => nota.id === notaId)
            const response = await fetch(`http://localhost:3000/notas/${notaId}`, {
                method: "PATCH",
                headers: {

                    "Content-Type": "application/json"

                },
                body: JSON.stringify({ completed: !nota.completed })
            });

            if(!response.ok) {

                throw new Error(
                    `Error al actualizar la nota: ${response.status}`
                );
            }
            const notaActualizada = await response.json()
            setNotas(notas.map(nota => nota.id === notaId ? notaActualizada : nota))

        }catch(error){
            console.error(error)
        }

    }

    return (
        <>

            <h1 className={styles.titulo}>Notas</h1>
            <TodoForm onAgregarNota={agregarNota}/>
            <ul className={styles.noteList}>

               {notas.map((nota) => (
                         
                    <li className={styles.noteItem} key = {nota.id}>
                        <span>
                            {nota.text}{nota.completed ? "✅" : "❎"}
                        </span>
                        <div className={styles.iconsContainer}>
                            <button onClick={() => marcarComoCompleta(nota.id)}>

                                {nota.completed ? "Desmarcar" : "Completar"}

                            </button>

                            <SquarePen onClick={() => setNotaEditandoId(nota.id)} size={16} />
                            <CircleX onClick={() => eliminarNota(nota.id)} size={16} />
                            
                        </div>

                        {

                            notaEditandoId === nota.id && (

                                <EditNoteForm nota={nota} onEditarNota={actualizarNota} onCancelar={() => setNotaEditandoId(null)}/>

                                    

                            )

                        }

                        
                    </li>

                ))}

            </ul>
                       
        
        </>
    
    );

}
export default TodoApp;