import React, {useState, useEffect} from "react";

function ToDo() {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState({
        title: "",
        event: false,
        startDate: "",
        description: "",
        author: "",
        category: "",
        importancy: false,
        urgency: false,
        endDate: "",
        progress: 0
    });
    const [modal, setModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const getData = () => {
        fetch('data.json'
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
            .then(function (response) {
                console.log(response)
                return response.json();
            })
            .then(function (myJson) {
                console.log(myJson);
                setTasks(myJson)
            });
    }
    useEffect(()=>{
        getData()
    },[])

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        const saved = localStorage.getItem('tasks');
        if (saved) setTasks(JSON.parse(saved));
    }, []);

    const openModal = ({index} = {}) => {
        if (typeof index !== 'undefined' && index !== null) {
            setEditingIndex(index);
            const task = tasks[index];
            setTaskInput({
                title: task.title,
                event: task.event,
                startDate: task.startDate,
                description: task.description,
                author: task.author,
                category: task.category,
                importancy: task.importancy,
                urgency: task.urgency,
                endDate: task.endDate,
                progress: task.progress || 0
            });
        } else {
            setEditingIndex(null);
            setTaskInput({
                title: "",
                event: false,
                startDate: "",
                description: "",
                author: "",
                category: "",
                importancy: false,
                urgency: false,
                endDate: "",
                progress: 0
            });
        }
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
        setEditingIndex(null);
    };

    const handleChange = (e) => {
        const {name, type, value, checked} = e.target;
        setTaskInput((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskInput.title.trim() === "") return;

        if (editingIndex !== null) {
            const updated = [...tasks];
            updated[editingIndex] = {...updated[editingIndex], ...taskInput};
            setTasks(updated);
        } else {
            setTasks((prev) => [...prev, taskInput]);
        }
        closeModal();
    };

    const deleteTask = (index) => {
        setTasks((prev) => prev.filter((_, i) => i !== index));
    };

    return (

        <div className="container mt-5 align-items-center d-flex flex-column">
            <h1 className="mb-4">To-Do List</h1>

            <button className="btn btn-primary mb-3" onClick={() => openModal()}>
                <i className="fas fa-plus me-2"></i> Add Task
            </button>

            <div className="list-group w-100">
                {tasks.map((task, index) => (
                    <div key={index}
                         className="list-group-item d-flex justify-content-between align-items-start flex-column position-relative">
                        <div className="position-absolute top-0 end-0 btn-group btn-group-sm mt-2 me-2">
                            <button className="btn btn-outline-warning" onClick={() => openModal({index})}>✏️</button>
                            <button className="btn btn-outline-danger" onClick={() => deleteTask(index)}>🗑️</button>
                        </div>
                        <div className="ms-2 me-auto w-100">
                            <div className="fw-bold">{task.title}</div>

                            <div className="row">
                                {task.description && <div className="col">{task.description}</div>}
                                {task.startDate && <div className="col text-muted small">Start: {task.startDate}</div>}
                            </div>


                            <div className="row">
                                {task.author && <div className="col text-muted small">Author: {task.author}</div>}
                                {task.endDate && (
                                    <div className="col text-muted small">End: {task.endDate}</div>)}
                            </div>

                            <div className="row">
                                {task.category && (
                                    <div className="col text-muted small">Category: {task.category}</div>)}
                                {task.event && (
                                    <div className="col">
                                        <span className="badge bg-info">Event</span>
                                    </div>
                                )}
                            </div>


                            <div className="row">
                                {task.importancy && (
                                    <div className="col">
                                        <span className="badge bg-danger">Important</span>
                                    </div>
                                )}
                                {task.urgency && (
                                    <div className="col">
                                        <span className="badge bg-warning">Urgent</span>
                                    </div>
                                )}
                            </div>


                        </div>


                        <div className="w-100 mt-2">
                            <div className="progress">
                                <div className="progress-bar" role="progressbar" style={{width: `${task.progress}%`}}
                                     aria-valuenow={task.progress}
                                     aria-valuemin="0" aria-valuemax="100">
                                    {task.progress < 0 ? "0%" : task.progress > 100 ? "100%" : task.progress}
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
            </div>
            {modal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog"
                     style={{backgroundColor: "rgba(0,0,0,0.5)"}}>
                    <div className="modal-dialog" role="document">
                        <form onSubmit={handleSubmit} className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add / Edit Task</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Task Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="title"
                                        value={taskInput.title}
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label htmlFor="event" className="form-label">Event</label>
                                    <input
                                        className="form-check-input form-control"
                                        type="checkbox"
                                        name="event"
                                        checked={taskInput.event}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="description"
                                        value={taskInput.description}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="author" className="form-label">Author</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="author"
                                        value={taskInput.author}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <select name="category" id="category" onChange={handleChange}
                                            className="form-select form-control" value={taskInput.category}>
                                        <option value="">Select category</option>
                                        <option value="work">Work</option>
                                        <option value="personal">Personal</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="importancy" className="form-label">Important</label>
                                    <input
                                        className="form-check form-switch"
                                        type="checkbox"
                                        name="importancy"
                                        checked={taskInput.importancy}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="urgency" className="form-label">Urgent</label>
                                    <input
                                        className="form-check form-switch"
                                        type="checkbox"
                                        name="urgency"
                                        checked={taskInput.urgency}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="date" className="form-label">Start Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="startDate"
                                        value={taskInput.startDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="form-label">End Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="endDate"
                                        value={taskInput.endDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="progress" className="form-label">Progress</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="progress"
                                        min="0"
                                        max="100"
                                        value={taskInput.progress}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close
                                </button>
                                <button type="submit"
                                        className="btn btn-primary">Add / Save Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ToDo;