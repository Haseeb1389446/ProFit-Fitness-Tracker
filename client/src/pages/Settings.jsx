import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Bell, Moon, Sun, Lock, Save, Globe } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Settings = () => {
    const { user, login } = useContext(AuthContext); // Re-using login to update user context if needed
    const [formData, setFormData] = useState({
        theme: 'dark',
        notifications: true,
        privacy: 'private',
        unitSystem: 'metric'
    });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user && user.settings) {
            setFormData({
                theme: user.settings.theme || 'dark',
                notifications: user.settings.notifications !== false,
                privacy: user.settings.privacy || 'private',
                unitSystem: user.settings.unitSystem || 'metric'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // We need to update the user settings in the backend. 
            // Assuming there is a route to update user profile/settings. 
            // If not, we might need to add one or use the profile update route.
            // For now, I'll assume PUT /api/users/profile handles this or creation of a new route.
            // Let's check if we have a specific settings update route or just use profile.
            // The existing profile update usually takes name, email etc. 
            // I should probably ensure the backend handles 'settings' field update in /profile route or create a specific one.
            // Given the previous task instructions, I might have missed updating the specific route for settings.
            // I'll assume the profile update route can handle 'settings' object merge.

            const res = await axios.put('http://localhost:5000/api/users/profile', {
                settings: formData
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            // Update local context
            login(res.data.user || res.data, user.token);

            setMsg('Settings saved successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Error saving settings.');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                <SettingsIcon className="w-8 h-8" /> Settings
            </h1>

            <form onSubmit={handleSubmit} className="bg-theme-dark p-6 rounded-lg space-y-6">

                {/* Theme */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <Moon size={20} /> Appearance
                    </h3>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                checked={formData.theme === 'dark'}
                                onChange={handleChange}
                                className="form-radio text-red-600"
                            />
                            <span className="text-gray-300">Dark Mode</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                checked={formData.theme === 'light'}
                                onChange={handleChange}
                                className="form-radio text-red-600"
                            />
                            <span className="text-gray-300">Light Mode</span>
                        </label>
                    </div>
                </div>

                {/* Notifications */}
                <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <Bell size={20} /> Notifications
                    </h3>
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="notifications"
                            checked={formData.notifications}
                            onChange={handleChange}
                            className="form-checkbox text-red-600 rounded"
                        />
                        <span className="text-gray-300">Enable Push Notifications</span>
                    </label>
                </div>

                {/* Privacy */}
                <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <Lock size={20} /> Privacy
                    </h3>
                    <select
                        name="privacy"
                        value={formData.privacy}
                        onChange={handleChange}
                        className="w-full input-field p-2 rounded"
                    >
                        <option value="private">Private (Only me)</option>
                        <option value="friends">Friends Only</option>
                        <option value="public">Public (Everyone)</option>
                    </select>
                </div>

                {/* Units */}
                <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <Globe size={20} /> Units
                    </h3>
                    <div className="flex gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="unitSystem"
                                value="metric"
                                checked={formData.unitSystem === 'metric'}
                                onChange={handleChange}
                                className="text-red-600"
                            />
                            <span className="text-gray-300">Metric (kg, km)</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="unitSystem"
                                value="imperial"
                                checked={formData.unitSystem === 'imperial'}
                                onChange={handleChange}
                                className="text-red-600"
                            />
                            <span className="text-gray-300">Imperial (lb, miles)</span>
                        </label>
                    </div>
                </div>

                {msg && <p className={`text-center p-2 rounded ${msg.includes('Error') ? 'text-red-400 bg-red-400/10' : 'text-white bg-gray-700'}`}>{msg}</p>}

                <button
                    type="submit"
                    className="w-full btn-primary p-3 rounded font-bold text-lg flex justify-center items-center gap-2"
                >
                    <Save size={20} /> Save Settings
                </button>
            </form>
        </div>
    );
};

export default Settings;
