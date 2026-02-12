import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Dumbbell } from 'lucide-react';

const AddWorkout = () => {
    const navigate = useNavigate();
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

    const categories = ['Strength', 'Cardio', 'Flexibility', 'Other'];

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
            await axios.post('http://localhost:5000/api/workouts', formData, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                <Dumbbell className="w-8 h-8 text-red-500" /> Log Workout
            </h1>

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

                <button type="submit" className="w-full btn-primary p-3 rounded font-bold text-lg flex justify-center items-center gap-2 mt-4">
                    <Save size={20} /> Save Workout
                </button>
            </form>
        </div>
    );
};

export default AddWorkout;
