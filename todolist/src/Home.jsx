import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import './App.css';
import { BsCircleFill, BsTrashFill, Bs1Circle, BsFillCheckCircleFill } from "react-icons/bs";

function Home() {
    const [todos, setToDos] = useState([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [showToastMessage, setShowToastMessage] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/get')
            .then(result => setToDos(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleEdit = (id) => {
        axios.put('http://localhost:3001/update/' + id)
            .then(result => location.reload())
            .catch(err => console.log(err));
    }

    const confirmDelete = (id) => {
        setDeleteItemId(id);
        setShowConfirmationDialog(true);
    }

    const handleDelete = () => {
        axios.delete('http://localhost:3001/delete/' + deleteItemId)
            .then(result => {
                setShowConfirmationDialog(false); // Hide confirmation dialog
                setShowToastMessage(true); // Show toast message
                setTimeout(() => setShowToastMessage(false), 3000); // Hide toast message after 3 seconds
                setToDos(todos.filter(todo => todo._id !== deleteItemId)); // Update state after deletion
            })
            .catch(err => console.log(err))
    }

    return (
        <div className='home'>
            <h2>TODO LIST</h2>
            <Create />
            {todos.length === 0 ?
                <div><h2>No Records</h2></div> :
                todos.map(todo => (
                    <div key={todo._id} className='task'>
                        <div className='checkbox' onClick={() => handleEdit(todo._id)}>
                            {todo.done ?
                                <BsFillCheckCircleFill className='icon'></BsFillCheckCircleFill>
                                : <BsCircleFill className='icon' />
                            }
                            <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
                        </div>
                        <div className='icon'>
                            <span><BsTrashFill className='icon-trash' onClick={() => confirmDelete(todo._id)} /></span>
                        </div>
                    </div>
                ))
            }
            {showConfirmationDialog && (
                <div className="confirmation-dialog toaster">
                    <p>Are you sure you want to delete the item?</p>
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={() => setShowConfirmationDialog(false)}>No</button>
                </div>
            )}
            {showToastMessage && <div className="toaster">To-do item deleted successfully!</div>}
        </div>
    )
}

export default Home;
