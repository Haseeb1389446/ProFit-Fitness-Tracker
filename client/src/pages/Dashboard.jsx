import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Activity, Dumbbell, Utensils, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

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

                setWorkouts(workoutsRes.data);
                setNutrition(nutritionRes.data);
                setProgress(progressRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate today's stats
    const today = new Date().toISOString().split('T')[0];
    const todaysWorkouts = workouts.filter(w => w.date.startsWith(today));
    const todaysNutrition = nutrition.filter(n => n.date.startsWith(today));

    // Aggregates
    const todaysCaloriesBurned = todaysWorkouts.reduce((acc, curr) => acc + (curr.calories || 0), 0);
    const todaysCaloriesConsumed = todaysNutrition.reduce((acc, curr) => acc + (curr.totalCalories || 0), 0);
    const latestWeight = progress.length > 0 ? progress[0].weight : '--';

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-white">Welcome back, {user?.name}!</h1>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-theme-dark p-6 rounded-lg text-white border-l-4 border-l-red-600">
                    <div className="flex items-center gap-3 mb-2">
                        <Dumbbell className="w-6 h-6 text-red-500" />
                        <h3 className="font-semibold text-gray-200">Workouts</h3>
                    </div>
                    <p className="text-3xl font-bold">{todaysWorkouts.length} <span className="text-sm font-normal text-gray-400">today</span></p>
                    <p className="text-sm text-gray-400">{todaysCaloriesBurned} kcal burned</p>
                </div>

                <div className="bg-theme-dark p-6 rounded-lg text-white border-l-4 border-l-gray-600">
                    <div className="flex items-center gap-3 mb-2">
                        <Utensils className="w-6 h-6 text-gray-400" />
                        <h3 className="font-semibold text-gray-200">Nutrition</h3>
                    </div>
                    <p className="text-3xl font-bold">{todaysCaloriesConsumed} <span className="text-sm font-normal text-gray-400">kcal</span></p>
                    <p className="text-sm text-gray-400">Consumed today</p>
                </div>

                <div className="bg-theme-dark p-6 rounded-lg text-white border-l-4 border-l-red-600">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-6 h-6 text-red-500" />
                        <h3 className="font-semibold text-gray-200">Weight</h3>
                    </div>
                    <p className="text-3xl font-bold">{latestWeight} <span className="text-sm font-normal text-gray-400">kg</span></p>
                    <p className="text-sm text-gray-400">Current Weight</p>
                </div>

                <div className="bg-theme-dark p-6 rounded-lg flex flex-col justify-center items-center">
                    <Link to="/add-workout" className="btn-primary py-2 px-4 rounded w-full text-center mb-2 font-semibold">Log Workout</Link>
                    <Link to="/nutrition" className="btn-secondary py-2 px-4 rounded w-full text-center font-semibold">Log Meal</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-theme-dark p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-500" /> Recent Workouts
                    </h2>
                    <div className="space-y-4">
                        {workouts.slice(0, 5).map(workout => (
                            <div key={workout._id} className="bg-gray-800 p-4 rounded border border-gray-700 flex justify-between items-center hover:border-red-500/50 transition-colors">
                                <div>
                                    <h4 className="font-bold text-white">{workout.activity}</h4>
                                    <p className="text-sm text-gray-400">{new Date(workout.date).toLocaleDateString()} • {workout.duration} mins</p>
                                </div>
                                <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-600">{workout.category}</span>
                            </div>
                        ))}
                        {workouts.length === 0 && <p className="text-gray-500">No recent workouts.</p>}
                    </div>
                    <Link to="/add-workout" className="block text-center text-red-500 mt-4 hover:text-red-400 hover:underline">View all</Link>
                </div>

                {/* Progress Overview */}
                <div className="bg-theme-dark p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-500" /> Progress
                    </h2>
                    <div className="space-y-4">
                        {progress.slice(0, 5).map(p => (
                            <div key={p._id} className="bg-gray-800 p-4 rounded border border-gray-700 flex justify-between items-center hover:border-red-500/50 transition-colors">
                                <div>
                                    <h4 className="font-bold text-white">{new Date(p.date).toLocaleDateString()}</h4>
                                </div>
                                <div className="font-bold text-red-400">{p.weight} kg</div>
                            </div>
                        ))}
                        {progress.length === 0 && <p className="text-gray-500">No progress logged yet.</p>}
                    </div>
                    <Link to="/progress" className="block text-center text-red-500 mt-4 hover:text-red-400 hover:underline">View full progress</Link>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
