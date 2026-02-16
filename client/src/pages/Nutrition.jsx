import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Trash2, Utensils } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Nutrition = () => {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        mealType: 'Breakfast',
        foodItems: [{ name: '', quantity: '', calories: '', protein: '', carbs: '', fat: '' }]
    });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/nutrition', {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            setLogs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const items = [...formData.foodItems];
        items[index][name] = value;
        setFormData({ ...formData, foodItems: items });
    };

    const addFoodItem = () => {
        setFormData({
            ...formData,
            foodItems: [...formData.foodItems, { name: '', quantity: '', calories: '', protein: '', carbs: '', fat: '' }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                mealType: formData.mealType,
                date: new Date().toISOString(), // Ensure date is sent
                foodItems: formData.foodItems.map(item => ({
                    ...item,
                    calories: Number(item.calories) || 0,
                    protein: Number(item.protein) || 0,
                    carbs: Number(item.carbs) || 0,
                    fat: Number(item.fat) || 0
                }))
            };

            await axios.post('http://localhost:5000/api/nutrition', payload, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            console.log('Meal logged successfully');
            setShowAddForm(false);
            setFormData({
                mealType: 'Breakfast',
                foodItems: [{ name: '', quantity: '', calories: '', protein: '', carbs: '', fat: '' }]
            });
            fetchLogs();
            setMsg('Meal logged successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || err.message;
            console.error('Error logging meal:', errorMsg);
            setMsg(`Error: ${errorMsg}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/nutrition/${id}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            fetchLogs();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                <Utensils className="w-8 h-8 text-gray-400" /> Nutrition Tracker
            </h1>

            <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary px-4 py-2 rounded mb-6 flex items-center gap-2"
            >
                <Plus className="w-4 h-4" /> Log Meal
            </button>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-theme-dark p-6 rounded-lg mb-8">
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Meal Type</label>
                        <select
                            className="w-full input-field p-2 rounded"
                            value={formData.mealType}
                            onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                        >
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                            <option>Snack</option>
                        </select>
                    </div>

                    <div className="space-y-4 mb-4">
                        <h3 className="text-white font-semibold">Food Items</h3>
                        {formData.foodItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-gray-800 p-3 rounded border border-gray-700">
                                <input placeholder="Food Name" name="name" value={item.name} onChange={(e) => handleInputChange(index, e)} className="input-field p-2 rounded col-span-2 md:col-span-1" required />
                                <input placeholder="Qty" name="quantity" value={item.quantity} onChange={(e) => handleInputChange(index, e)} className="input-field p-2 rounded" required />
                                <input placeholder="Cals" type="number" name="calories" value={item.calories} onChange={(e) => handleInputChange(index, e)} className="input-field p-2 rounded" />
                                <input placeholder="Prot (g)" type="number" name="protein" value={item.protein} onChange={(e) => handleInputChange(index, e)} className="input-field p-2 rounded" />
                                <input placeholder="Carb (g)" type="number" name="carbs" value={item.carbs} onChange={(e) => handleInputChange(index, e)} className="input-field p-2 rounded" />
                                <input placeholder="Fat (g)" type="number" name="fat" value={item.fat} onChange={(e) => handleInputChange(index, e)} className="input-field p-2 rounded" />
                            </div>
                        ))}
                        <button type="button" onClick={addFoodItem} className="text-sm text-red-400 hover:text-red-300">+ Add another item</button>
                    </div>

                    <button type="submit" className="w-full btn-primary p-2 rounded font-semibold">Save Meal</button>
                </form>
            )}

            {msg && <p className={`mb-6 text-center p-3 rounded bg-theme-dark border ${msg.includes('Error') ? 'text-red-500 border-red-500/20' : 'text-green-500 border-green-500/20'}`}>{msg}</p>}

            <div className="grid gap-4">
                {loading ? <p className="text-gray-400">Loading...</p> : logs.map(log => (
                    <div key={log._id} className="bg-theme-dark p-4 rounded-lg flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded-full uppercase font-bold border border-gray-600">{log.mealType}</span>
                                <span className="text-gray-400 text-sm">{new Date(log.date).toLocaleDateString()}</span>
                            </div>
                            <div className="space-y-1">
                                {log.foodItems.map((item, idx) => (
                                    <div key={idx} className="text-gray-300 text-sm">
                                        {item.name} ({item.quantity}) - <span className="text-red-400">{item.calories} kcal</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 text-sm text-gray-400">
                                Total: <span className="text-white font-bold">{log.totalCalories} kcal</span>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(log._id)} className="text-gray-500 hover:text-red-500 p-1 transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                {!loading && logs.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">No meals logged yet. Start tracking your nutrition!</div>
                )}
            </div>
        </div>
    );
};

export default Nutrition;
