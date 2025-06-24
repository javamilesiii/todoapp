import React, { useState, useEffect } from "react";

// Hauptfunktion für die ToDo-Liste
function ToDo() {
    // State für Aufgaben, initialisiert aus localStorage (wenn vorhanden)
    const [tasks, setTasks] = useState(() => {
        try {
            const savedTasks = localStorage.getItem('tasks');
            return savedTasks ? JSON.parse(savedTasks) : [];
        } catch (error) {
            console.error('Fehler beim Laden der Tasks:', error);
            return [];
        }
    });

    // State für Suchbegriff
    const [searchTerm, setSearchTerm] = useState("");
    // State für das aktuelle Aufgabenformular
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
    // State für das Anzeigen des Modals
    const [modal, setModal] = useState(false);
    // State für den Index der zu bearbeitenden Aufgabe
    const [editingIndex, setEditingIndex] = useState(null);
    // State für Validierungsfehler
    const [errors, setErrors] = useState({});

    // Speichert Aufgaben im localStorage, wenn sich tasks ändert
    useEffect(() => {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error('Fehler beim Speichern der Tasks:', error);
        }
    }, [tasks]);

    // Berechnet die Priorität anhand Wichtigkeit und Dringlichkeit
    const calculatePriority = (important, urgent) => {
        if (important && urgent) {
            return { text: "Sofort erledigen", color: "bg-red-500", level: 1 };
        } else if (important && !urgent) {
            return { text: "Einplanen und Wohlfühlen", color: "bg-yellow-500", level: 2 };
        } else if (!important && urgent) {
            return { text: "Gib es ab", color: "bg-orange-500", level: 3 };
        } else {
            return { text: "Weg damit", color: "bg-gray-500", level: 4 };
        }
    };

    // Validiert die Eingaben im Aufgabenformular
    const validateTask = (task) => {
        const newErrors = {};

        if (!task.title.trim()) {
            newErrors.title = "Titel ist erforderlich";
        } else if (task.title.length > 255) {
            newErrors.title = "Titel darf maximal 255 Zeichen haben";
        }

        if (task.author && task.author.length > 20) {
            newErrors.author = "Autor darf maximal 20 Zeichen haben";
        }

        if (!task.category) {
            newErrors.category = "Kategorie ist erforderlich";
        }

        if (task.startDate && task.endDate && new Date(task.startDate) > new Date(task.endDate)) {
            newErrors.endDate = "Enddatum muss nach dem Startdatum liegen";
        }

        if (task.progress < 0 || task.progress > 100) {
            newErrors.progress = "Fortschritt muss zwischen 0 und 100% liegen";
        }

        return newErrors;
    };

    // Öffnet das Modal zum Hinzufügen oder Bearbeiten einer Aufgabe
    const openModal = ({ index } = {}) => {
        setErrors({});

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

    // Schließt das Modal und setzt Fehler zurück
    const closeModal = () => {
        setModal(false);
        setEditingIndex(null);
        setErrors({});
    };

    // Behandelt Änderungen in den Formularfeldern
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setTaskInput((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) || 0 : value
        }));

        // Entfernt Fehler, wenn das Feld korrigiert wird
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // Behandelt das Absenden des Formulars (Hinzufügen oder Bearbeiten)
    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateTask(taskInput);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (editingIndex !== null) {
            // Bearbeiten einer bestehenden Aufgabe
            const updated = [...tasks];
            updated[editingIndex] = { ...updated[editingIndex], ...taskInput };
            setTasks(updated);
        } else {
            // Hinzufügen einer neuen Aufgabe
            setTasks((prev) => [...prev, taskInput]);
        }
        closeModal();
    };

    // Löscht eine Aufgabe nach Bestätigung
    const deleteTask = (index) => {
        if (confirm("Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?")) {
            setTasks((prev) => prev.filter((_, i) => i !== index));
        }
    };

    // Filtert Aufgaben nach Suchbegriff
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // JSX-Return: Aufbau der Benutzeroberfläche
    return (
        <div className="container mx-auto mt-8 px-4 max-w-6xl">
            {/* Überschrift */}
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">To-Do Liste</h1>
            {/* Suchfeld und Button zum Hinzufügen */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="TODO's suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={() => openModal()}
                >
                    <span className="text-lg">+</span> Aufgabe hinzufügen
                </button>
            </div>
            {/* Aufgabenliste */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    // Keine Aufgaben gefunden
                    <div className="text-center py-12 text-gray-500">
                        {searchTerm ? "Keine Aufgaben gefunden." : "Noch keine Aufgaben vorhanden."}
                    </div>
                ) : (
                    // Aufgaben werden aufgelistet
                    filteredTasks.map((task, index) => {
                        const priority = calculatePriority(task.importancy, task.urgency);
                        // Originalindex für Bearbeiten/Löschen
                        const originalIndex = tasks.findIndex(t => t === task);

                        return (
                            <div key={originalIndex} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            {/* Titel der Aufgabe */}
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                                            {/* Tags für Event, Priorität, Wichtigkeit, Dringlichkeit */}
                                            <div className="flex flex-wrap gap-2">
                                                {task.event && (
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                        Event
                                                    </span>
                                                )}
                                                <span className={`${priority.color} text-white px-2 py-1 rounded-full text-sm`}>
                                                    {priority.text}
                                                </span>
                                                {task.importancy && (
                                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                                                        Wichtig
                                                    </span>
                                                )}
                                                {task.urgency && (
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                                                        Dringend
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Buttons für Bearbeiten und Löschen */}
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-colors duration-200"
                                                onClick={() => openModal({ index: originalIndex })}
                                                title="Bearbeiten"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200"
                                                onClick={() => deleteTask(originalIndex)}
                                                title="Löschen"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    {/* Weitere Details zur Aufgabe */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        {task.description && (
                                            <div className="md:col-span-2">
                                                <p className="text-gray-600">{task.description}</p>
                                            </div>
                                        )}
                                        {task.author && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Autor:</span>
                                                <span className="ml-2 text-gray-700">{task.author}</span>
                                            </div>
                                        )}
                                        {task.category && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Kategorie:</span>
                                                <span className="ml-2 text-gray-700 capitalize">{task.category}</span>
                                            </div>
                                        )}
                                        {task.startDate && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Startdatum:</span>
                                                <span className="ml-2 text-gray-700">{task.startDate}</span>
                                            </div>
                                        )}
                                        {task.endDate && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Enddatum:</span>
                                                <span className="ml-2 text-gray-700">{task.endDate}</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Fortschrittsbalken */}
                                    <div className="mb-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-500">Fortschritt</span>
                                            <span className="text-sm text-gray-700">{task.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(Math.max(task.progress, 0), 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {/* Modal für Aufgabenformular */}
            {modal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Formular für Aufgabe */}
                        <div onSubmit={handleSubmit}>
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {editingIndex !== null ? "Aufgabe bearbeiten" : "Neue Aufgabe"}
                                </h2>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                    onClick={closeModal}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Titel */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Titel * (max. 255 Zeichen)
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={taskInput.title}
                                        onChange={handleChange}
                                        maxLength="255"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.title ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        autoFocus
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>
                                {/* Event Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="event"
                                        checked={taskInput.event}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">
                                        Als Event markieren
                                    </label>
                                </div>
                                {/* Beschreibung */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Beschreibung
                                    </label>
                                    <textarea
                                        name="description"
                                        value={taskInput.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                {/* Autor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Autor (max. 20 Zeichen)
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={taskInput.author}
                                        onChange={handleChange}
                                        maxLength="20"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.author ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                                </div>
                                {/* Kategorie */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kategorie *
                                    </label>
                                    <select
                                        name="category"
                                        value={taskInput.category}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.category ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Kategorie auswählen</option>
                                        <option value="arbeit">Arbeit</option>
                                        <option value="persoenlich">Persönlich</option>
                                        <option value="sport">Sport</option>
                                        <option value="reisen">Reisen</option>
                                        <option value="sonstiges">Sonstiges</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                </div>
                                {/* Wichtig/Dringend Checkboxen */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="importancy"
                                            checked={taskInput.importancy}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-700">
                                            Wichtig
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="urgency"
                                            checked={taskInput.urgency}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-700">
                                            Dringend
                                        </label>
                                    </div>
                                </div>
                                {/* Start- und Enddatum */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Startdatum
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={taskInput.startDate}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Enddatum
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={taskInput.endDate}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.endDate ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                                    </div>
                                </div>
                                {/* Fortschritt */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fortschritt (0-100%)
                                    </label>
                                    <input
                                        type="number"
                                        name="progress"
                                        value={taskInput.progress}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.progress ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.progress && <p className="text-red-500 text-sm mt-1">{errors.progress}</p>}
                                </div>
                                {/* Anzeige der berechneten Priorität */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Berechnete Priorität:
                                    </label>
                                    <span className={`${calculatePriority(taskInput.importancy, taskInput.urgency).color} text-white px-3 py-1 rounded-full text-sm`}>
                                        {calculatePriority(taskInput.importancy, taskInput.urgency).text}
                                    </span>
                                </div>
                            </div>
                            {/* Buttons für Abbrechen und Speichern/Hinzufügen */}
                            <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200"
                                    onClick={closeModal}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                                    onClick={handleSubmit}
                                >
                                    {editingIndex !== null ? "Speichern" : "Hinzufügen"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Exportiert die ToDo-Komponente
export default ToDo;