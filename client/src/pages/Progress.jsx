import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Progress = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        weight: '',
        chest: '',
        waist: '',
        hips: '',
        notes: ''
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/progress', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            setLogs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                weight: formData.weight,
                measurements: {
                    chest: formData.chest,
                    waist: formData.waist,
                    hips: formData.hips
                },
                notes: formData.notes
            };

            await axios.post('http://localhost:5000/api/progress', payload, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            setShowAddForm(false);
            setFormData({ weight: '', chest: '', waist: '', hips: '', notes: '' });
            fetchLogs();
        } catch (err) {
            console.error(err);
        }
    };

    // Prepare chart data (reverse to show oldest to newest)
    const chartData = [...logs].reverse().map(log => ({
        date: new Date(log.date).toLocaleDateString(),
        weight: log.weight
    }));

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                <Activity className="w-8 h-8 text-red-500" /> Progress Tracker
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">

                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn-primary px-4 py-2 rounded mb-6 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Log Measurements
                    </button>

                    {showAddForm && (
                        <form onSubmit={handleSubmit} className="bg-theme-dark p-6 rounded-lg mb-8">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm font-medium">Weight</label>
                                    <input type="number" placeholder="kg/lbs" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-full input-field p-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm font-medium">Chest</label>
                                    <input type="number" placeholder="cm/in" value={formData.chest} onChange={(e) => setFormData({ ...formData, chest: e.target.value })} className="w-full input-field p-2 rounded" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm font-medium">Waist</label>
                                    <input type="number" placeholder="cm/in" value={formData.waist} onChange={(e) => setFormData({ ...formData, waist: e.target.value })} className="w-full input-field p-2 rounded" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm font-medium">Hips</label>
                                    <input type="number" placeholder="cm/in" value={formData.hips} onChange={(e) => setFormData({ ...formData, hips: e.target.value })} className="w-full input-field p-2 rounded" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-1 text-sm font-medium">Notes</label>
                                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full input-field p-2 rounded" rows="2"></textarea>
                            </div>
                            <button type="submit" className="w-full btn-primary p-2 rounded font-semibold">Save Progress</button>
                        </form>
                    )}

                    <div className="space-y-4">
                        {loading ? <p className="text-gray-400">Loading...</p> : logs.map(log => (
                            <div key={log._id} className="bg-theme-dark p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <div className="text-gray-400 text-sm mb-1">{new Date(log.date).toLocaleDateString()}</div>
                                    <div className="text-xl text-white font-bold">{log.weight} <span className="text-sm text-gray-400 font-normal">weight</span></div>
                                    <div className="text-sm text-gray-400 mt-1">
                                        {log.measurements?.chest && <span className="mr-3">Chest: {log.measurements.chest}</span>}
                                        {log.measurements?.waist && <span className="mr-3">Waist: {log.measurements.waist}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    {/* Chart Section */}
                    <div className="bg-theme-dark p-4 rounded-lg sticky top-4">
                        <h3 className="text-white font-semibold mb-4">Weight Trend</h3>
                        <div className="h-64">
                            {chartData.length > 1 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                                        <YAxis stroke="#9CA3AF" fontSize={12} domain={['auto', 'auto']} />
                                        <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', color: '#fff' }} />
                                        <Line type="monotone" dataKey="weight" stroke="#DC2626" strokeWidth={2} dot={{ fill: '#DC2626' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                    Log more data to see chart
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progress;
