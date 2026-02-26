import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Activity, Dumbbell, Utensils, TrendingUp, Calendar, PieChart as PieIcon, BarChart as BarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [workouts, setWorkouts] = useState([]);
    const [nutrition, setNutrition] = useState([]);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                const [workoutsRes, nutritionRes, progressRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/workouts', config),
                    axios.get('http://localhost:5000/api/nutrition', config),
                    axios.get('http://localhost:5000/api/progress', config)
                ]);

                // Sort data by date
                setWorkouts(workoutsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                setNutrition(nutritionRes.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                setProgress(progressRes.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // Calculate today's stats
    const today = new Date().toISOString().split('T')[0];
    const todaysWorkouts = workouts.filter(w => new Date(w.date).toISOString().split('T')[0] === today);
    const todaysNutrition = nutrition.filter(n => new Date(n.date).toISOString().split('T')[0] === today);

    // Aggregates
    const todaysCaloriesBurned = todaysWorkouts.reduce((acc, curr) => acc + (curr.calories || 0), 0);
    const todaysCaloriesConsumed = todaysNutrition.reduce((acc, curr) => acc + (curr.totalCalories || 0), 0);
    const latestWeight = progress.length > 0 ? progress[0].weight : '--';

    // Chart Data Processing
    // 1. Weight Progress (Line Chart) - Last 7 entries
    const weightData = [...progress]
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ascending for chart
        .slice(-7)
        .map(p => ({
            date: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            weight: p.weight
        }));

    // 2. Calories Burned vs Consumed (Area/Bar Chart) - Last 7 days
    const getLast7Days = () => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    };

    const last7Days = getLast7Days();
    const caloriesData = last7Days.map(date => {
        const burned = workouts
            .filter(w => new Date(w.date).toISOString().split('T')[0] === date)
            .reduce((acc, curr) => acc + (curr.calories || 0), 0);
        const consumed = nutrition
            .filter(n => new Date(n.date).toISOString().split('T')[0] === date)
            .reduce((acc, curr) => acc + (curr.totalCalories || 0), 0);
        return {
            date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            burned,
            consumed
        };
    });

    // 3. Macro Distribution (Pie Chart) - Average of last 7 entries (or all time if less)
    const recentNutrition = nutrition.slice(0, 7);
    const totalMacros = recentNutrition.reduce((acc, curr) => {
        const mealMacros = curr.foodItems.reduce((mAcc, item) => ({
            protein: mAcc.protein + (item.protein || 0),
            carbs: mAcc.carbs + (item.carbs || 0),
            fat: mAcc.fat + (item.fat || 0),
        }), { protein: 0, carbs: 0, fat: 0 });

        return {
            protein: acc.protein + mealMacros.protein,
            carbs: acc.carbs + mealMacros.carbs,
            fat: acc.fat + mealMacros.fat,
        };
    }, { protein: 0, carbs: 0, fat: 0 });

    const macroData = [
        { name: 'Protein', value: totalMacros.protein, color: '#DC2626' }, // red-600
        { name: 'Carbs', value: totalMacros.carbs, color: '#4B5563' }, // gray-600
        { name: 'Fat', value: totalMacros.fat, color: '#F3F4F6' }, // gray-100
    ].filter(d => d.value > 0);

    const recentWorkouts = workouts.slice(0, 3); // For the quick stats

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-6 rounded-lg text-white border-l-4 border-l-red-600 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <Dumbbell className="w-6 h-6 text-red-500" />
                        <h3 className="font-semibold text-gray-200">Workouts</h3>
                    </div>
                    <p className="text-3xl font-bold">{todaysWorkouts.length} <span className="text-sm font-normal text-gray-400">today</span></p>
                    <p className="text-sm text-gray-400">{todaysCaloriesBurned} kcal burned</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg text-white border-l-4 border-l-gray-500 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <Utensils className="w-6 h-6 text-gray-400" />
                        <h3 className="font-semibold text-gray-200">Nutrition</h3>
                    </div>
                    <p className="text-3xl font-bold">{todaysCaloriesConsumed} <span className="text-sm font-normal text-gray-400">kcal</span></p>
                    <p className="text-sm text-gray-400">Consumed today</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg text-white border-l-4 border-l-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-6 h-6 text-white" />
                        <h3 className="font-semibold text-gray-200">Weight</h3>
                    </div>
                    <p className="text-3xl font-bold">{latestWeight} <span className="text-sm font-normal text-gray-400">kg</span></p>
                    <p className="text-sm text-gray-400">Current Weight</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg flex flex-col justify-center items-center shadow-lg">
                    <Link to="/add-workout" className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded w-full text-center mb-2 font-semibold transition-colors">Log Workout</Link>
                    <Link to="/nutrition" className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded w-full text-center font-semibold transition-colors">Log Meal</Link>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weight Progress Chart */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-500" /> Weight Progress
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weightData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" domain={['dataMin - 1', 'dataMax + 1']} />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                                <Line type="monotone" dataKey="weight" stroke="#EF4444" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Calories Chart */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-gray-400" /> Calories (Last 7 Days)
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={caloriesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                                <Legend />
                                <Bar dataKey="burned" fill="#EF4444" name="Burned" />
                                <Bar dataKey="consumed" fill="#10B981" name="Consumed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Macro Distribution */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <PieIcon className="w-5 h-5 text-yellow-500" /> Macro Distribution (Avg)
                    </h2>
                    <div className="h-64 flex justify-center items-center">
                        {macroData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={macroData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {macroData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500">No nutrition data available.</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-500" /> Recent Workouts
                    </h2>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {workouts.slice(0, 5).map(workout => (
                            <div key={workout._id} className="bg-gray-700 p-4 rounded border border-gray-600 flex justify-between items-center hover:border-red-500/50 transition-colors">
                                <div>
                                    <h4 className="font-bold text-white">{workout.activity}</h4>
                                    <p className="text-sm text-gray-400">{new Date(workout.date).toLocaleDateString()} • {workout.duration} mins</p>
                                </div>
                                <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-500">{workout.category}</span>
                            </div>
                        ))}
                        {workouts.length === 0 && <p className="text-gray-500">No recent workouts.</p>}
                    </div>
                    <Link to="/add-workout" className="block text-center text-red-500 mt-4 hover:text-red-400 hover:underline">View all</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
