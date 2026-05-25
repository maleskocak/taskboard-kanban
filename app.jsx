const { useState, useEffect, useRef } = React;

const STORAGE_KEY = 'taskboard-kanban-data';

const COLUMNS = [
    { id: 'todo', title: 'To Do', className: 'column-todo' },
    { id: 'inprogress', title: 'In Progress', className: 'column-inprogress' },
    { id: 'done', title: 'Done', className: 'column-done' },
];

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
        todo: [
            { id: generateId(), title: 'Design mockups', description: 'Create wireframes for the new landing page', createdAt: new Date().toISOString() },
            { id: generateId(), title: 'Write unit tests', description: 'Cover the authentication module with tests', createdAt: new Date().toISOString() },
        ],
        inprogress: [
            { id: generateId(), title: 'Build API endpoints', description: 'Implement REST endpoints for user management', createdAt: new Date().toISOString() },
        ],
        done: [
            { id: generateId(), title: 'Project setup', description: 'Initialize repository and configure CI/CD pipeline', createdAt: new Date().toISOString() },
        ],
    };
}

function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
}

// Card Component
function Card({ card, columnId, onDelete, onView, onDragStart }) {
    return (
        <div
            className="card"
            draggable
            onDragStart={(e) => onDragStart(e, card.id, columnId)}
        >
            <div className="card-actions">
                <button className="card-btn" onClick={() => onView(card, columnId)} title="View details">🔍</button>
                <button className="card-btn delete" onClick={() => onDelete(card.id, columnId)} title="Delete card">✕</button>
            </div>
            <div className="card-title">{card.title}</div>
            {card.description && <div className="card-desc">{card.description}</div>}
        </div>
    );
}

// Add Card Form
function AddCardForm({ columnId, onAdd, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd(columnId, { id: generateId(), title: title.trim(), description: description.trim(), createdAt: new Date().toISOString() });
        setTitle('');
        setDescription('');
    };

    return (
        <form className="add-card-form" onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                type="text"
                placeholder="Card title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Description (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="form-buttons">
                <button type="submit" className="btn-primary">Add Card</button>
                <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}

// Modal Component
function CardModal({ card, columnId, onClose }) {
    if (!card) return null;

    const columnName = COLUMNS.find(c => c.id === columnId)?.title || columnId;
    const badgeClass = `badge-${columnId}`;
    const created = new Date(card.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{card.title}</h2>
                <span className={`modal-column-badge ${badgeClass}`}>{columnName}</span>
                {card.description ? (
                    <p className="modal-desc">{card.description}</p>
                ) : (
                    <p className="modal-desc" style={{ fontStyle: 'italic' }}>No description provided.</p>
                )}
                <p className="modal-meta">Created: {created}</p>
                <button className="modal-close" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

// Column Component
function Column({ column, cards, onAdd, onDelete, onView, onDragStart, onDragOver, onDrop, dragOverColumn }) {
    const [showForm, setShowForm] = useState(false);

    const handleAdd = (colId, card) => {
        onAdd(colId, card);
        setShowForm(false);
    };

    return (
        <div
            className={`column ${column.className} ${dragOverColumn === column.id ? 'drag-over' : ''}`}
            onDragOver={(e) => onDragOver(e, column.id)}
            onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    onDragOver(e, null);
                }
            }}
            onDrop={(e) => onDrop(e, column.id)}
        >
            <div className="column-header">
                <span>{column.title}</span>
                <span className="count">{cards.length}</span>
            </div>
            <div className="column-body">
                {cards.length === 0 && !showForm && (
                    <div className="empty-state">No cards yet. Add one below!</div>
                )}
                {cards.map(card => (
                    <Card
                        key={card.id}
                        card={card}
                        columnId={column.id}
                        onDelete={onDelete}
                        onView={onView}
                        onDragStart={onDragStart}
                    />
                ))}
                {showForm ? (
                    <AddCardForm columnId={column.id} onAdd={handleAdd} onCancel={() => setShowForm(false)} />
                ) : (
                    <button className="add-card-btn" onClick={() => setShowForm(true)}>+ Add a card</button>
                )}
            </div>
        </div>
    );
}

// App Component
function App() {
    const [data, setData] = useState(loadData);
    const [modalCard, setModalCard] = useState(null);
    const [modalColumn, setModalColumn] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const dragRef = useRef({ cardId: null, sourceColumn: null });

    useEffect(() => {
        saveData(data);
    }, [data]);

    const handleAdd = (columnId, card) => {
        setData(prev => ({
            ...prev,
            [columnId]: [...prev[columnId], card],
        }));
    };

    const handleDelete = (cardId, columnId) => {
        setData(prev => ({
            ...prev,
            [columnId]: prev[columnId].filter(c => c.id !== cardId),
        }));
    };

    const handleView = (card, columnId) => {
        setModalCard(card);
        setModalColumn(columnId);
    };

    const handleDragStart = (e, cardId, columnId) => {
        dragRef.current = { cardId, sourceColumn: columnId };
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add('dragging');
        setTimeout(() => {
            if (e.target) e.target.classList.remove('dragging');
        }, 0);
    };

    const handleDragOver = (e, columnId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(columnId);
    };

    const handleDrop = (e, targetColumn) => {
        e.preventDefault();
        setDragOverColumn(null);
        const { cardId, sourceColumn } = dragRef.current;
        if (!cardId || sourceColumn === targetColumn) return;

        setData(prev => {
            const card = prev[sourceColumn].find(c => c.id === cardId);
            if (!card) return prev;
            return {
                ...prev,
                [sourceColumn]: prev[sourceColumn].filter(c => c.id !== cardId),
                [targetColumn]: [...prev[targetColumn], card],
            };
        });

        dragRef.current = { cardId: null, sourceColumn: null };
    };

    return (
        <div>
            <header className="app-header">
                <h1>TaskBoard Kanban</h1>
                <p>Drag and drop cards between columns to manage your workflow</p>
            </header>
            <div className="board">
                {COLUMNS.map(column => (
                    <Column
                        key={column.id}
                        column={column}
                        cards={data[column.id] || []}
                        onAdd={handleAdd}
                        onDelete={handleDelete}
                        onView={handleView}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        dragOverColumn={dragOverColumn}
                    />
                ))}
            </div>
            {modalCard && (
                <CardModal
                    card={modalCard}
                    columnId={modalColumn}
                    onClose={() => { setModalCard(null); setModalColumn(null); }}
                />
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
