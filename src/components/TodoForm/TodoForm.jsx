
import styles from "../TodoForm/todoform.module.css"
import { useState } from "react";
import { SquarePen, CircleX, CirclePlus } from "lucide-react";

const TodoForm = ({ onAgregarNota }) => {

    const [textNote, setTextNote] = useState("");

    const handleSubmit = (event) => {

        event.preventDefault()

        if(textNote === ""){

            console.log("No se puede agregar notas vacias")
            return

        }

        const newNote = {

            text: textNote,
            completed: false

        }

        fetch("http://localhost:3000/notas", {
            method: "POST",
            headers: {

                "Content-Type": "application/json"

            },
            body: JSON.stringify(newNote)
            

        }).then(response => response.json())
        .then(data => {
            onAgregarNota(data)
            setTextNote("")
        })


    };

    const handleChange = (e) => {

        setTextNote(e.target.value);

    };

    return(

        <div className={styles.formContainer}>

            <h2>Todo Form</h2>
            <form onSubmit={handleSubmit}>

                <input type="text" id="nota" name="nota" value={textNote} onChange={handleChange}/>
                <button type="submit"><CirclePlus size={16} />Crear Nota</button>
            </form>


        </div>

    )

}

export default TodoForm;