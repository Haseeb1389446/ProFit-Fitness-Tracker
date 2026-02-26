import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Dumbbell } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const AddWorkout = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('log');
    const [msg, setMsg] = useState('');

    // Log Workout State
    const [formData, setFormData] = useState({
        activity: '', // Workout Name e.g., "Leg Day"
        duration: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Strength',
        notes: '',
        exercises: []
    });

    const [currentExercise, setCurrentExercise] = useState({
        name: '',
        sets: 3,
        reps: 10,
        weight: 0,
        notes: ''
    });

    // History & Search State
    const [workouts, setWorkouts] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        startDate: '',
        endDate: ''
    });

    const categories = ['Strength', 'Cardio', 'Flexibility', 'Other'];

    // Fetch Workouts for History
    useEffect(() => {
        if (activeTab === 'history') {
            fetchWorkouts();
        }
    }, [activeTab, filters]);

    const fetchWorkouts = async () => {
        if (!user?.token) return;
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            const res = await axios.get(`http://localhost:5000/api/workouts?${params.toString()}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setWorkouts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddExercise = () => {
        if (!currentExercise.name) return;
        setFormData({
            ...formData,
            exercises: [...formData.exercises, currentExercise]
        });
        setCurrentExercise({ name: '', sets: 3, reps: 10, weight: 0, notes: '' });
    };

    const removeExercise = (index) => {
        const updatedExercises = formData.exercises.filter((_, i) => i !== index);
        setFormData({ ...formData, exercises: updatedExercises });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                duration: Number(formData.duration) || 0,
                exercises: formData.exercises.map(ex => ({
                    ...ex,
                    sets: Number(ex.sets) || 1,
                    reps: Number(ex.reps) || 0,
                    weight: Number(ex.weight) || 0
                }))
            };

            await axios.post('http://localhost:5000/api/workouts', payload, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            setMsg('Workout logged successfully!');
            setTimeout(() => {
                setMsg('');
                navigate('/dashboard');
            }, 1000);
        } catch (err) {
            console.error('Error logging workout:', err.response?.data || err.message);
            setMsg('Error logging workout. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                <Dumbbell className="w-8 h-8" /> Workouts
            </h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-700">
                <button
                    className={`pb-2 px-4 font-semibold ${activeTab === 'log' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setActiveTab('log')}
                >
                    Log Workout
                </button>
                <button
                    className={`pb-2 px-4 font-semibold ${activeTab === 'history' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setActiveTab('history')}
                >
                    History & Search
                </button>
            </div>

            {activeTab === 'log' ? (
                <form onSubmit={handleSubmit} className="bg-theme-dark p-6 rounded-lg space-y-4">
                    {/* Basic Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm font-medium">Workout Name</label>
                            <input
                                type="text"
                                name="activity"
                                placeholder="e.g. Morning Cardio"
                                value={formData.activity}
                                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                                className="w-full input-field p-2 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm font-medium">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full input-field p-2 rounded"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm font-medium">Duration (mins)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full input-field p-2 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm font-medium">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full input-field p-2 rounded"
                            />
                        </div>
                    </div>

                    {/* Exercise List */}
                    <div className="border-t border-gray-800 pt-4 mt-4">
                        <h3 className="text-lg font-semibold text-white mb-3">Exercises</h3>

                        {/* Add Exercise Form */}
                        <div className="bg-gray-800 p-4 rounded mb-4 grid gap-3 border border-gray-700">
                            <input
                                placeholder="Exercise Name (e.g. Bench Press)"
                                value={currentExercise.name}
                                onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                                className="w-full input-field p-2 rounded"
                            />
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Sets</label>
                                    <input type="number" value={currentExercise.sets} onChange={(e) => setCurrentExercise({ ...currentExercise, sets: e.target.value })} className="w-full input-field p-2 rounded" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Reps</label>
                                    <input type="number" value={currentExercise.reps} onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })} className="w-full input-field p-2 rounded" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Weight (kg)</label>
                                    <input type="number" value={currentExercise.weight} onChange={(e) => setCurrentExercise({ ...currentExercise, weight: e.target.value })} className="w-full input-field p-2 rounded" />
                                </div>
                            </div>
                            <button type="button" onClick={handleAddExercise} className="btn-secondary py-2 rounded flex justify-center items-center gap-2">
                                <Plus size={16} /> Add Exercise
                            </button>
                        </div>

                        {/* Added Exercises List */}
                        <div className="space-y-2">
                            {formData.exercises.map((ex, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-900 p-3 rounded border border-gray-800">
                                    <div>
                                        <div className="font-semibold text-white">{ex.name}</div>
                                        <div className="text-sm text-gray-400">{ex.sets} sets x {ex.reps} reps @ {ex.weight}kg</div>
                                    </div>
                                    <button type="button" onClick={() => removeExercise(idx)} className="text-red-500 hover:text-red-400 p-1">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {formData.exercises.length === 0 && <p className="text-gray-500 text-sm text-center">No exercises added yet.</p>}
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-4">
                        <label className="block text-gray-400 mb-1 text-sm font-medium">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full input-field p-2 rounded"
                            rows="3"
                        ></textarea>
                    </div>

                    {msg && <p className="text-red-500 text-center mb-4">{msg}</p>}
                    <button type="submit" className="w-full btn-primary p-3 rounded font-bold text-lg flex justify-center items-center gap-2 mt-4">
                        <Save size={20} /> Save Workout
                    </button>
                </form>
            ) : (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="bg-gray-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search workouts..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="input-field p-2 rounded"
                        />
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="input-field p-2 rounded"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="input-field p-2 rounded"
                        />
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="input-field p-2 rounded"
                        />
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                        {workouts.map(workout => (
                            <div key={workout._id} className="bg-theme-dark p-4 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{workout.activity}</h3>
                                        <p className="text-gray-400 text-sm">{new Date(workout.date).toLocaleDateString()} • {workout.duration} mins • {workout.calories} kcal</p>
                                    </div>
                                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-600">{workout.category}</span>
                                </div>
                                {workout.exercises && workout.exercises.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {workout.exercises.map((ex, i) => (
                                            <div key={i} className="text-sm text-gray-300">
                                                • {ex.name}: {ex.sets}x{ex.reps} @ {ex.weight}kg
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {workouts.length === 0 && <p className="text-center text-gray-500 py-8">No workouts found.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddWorkout;
