import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { User, Settings, Camera, Save } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext); // Access setUser to update context after API call
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        profilePicture: user?.profilePicture || '',
        password: '',
        confirmPassword: '',
        theme: user?.preferences?.theme || 'light',
        unitSystem: user?.preferences?.unitSystem || 'metric'
    });
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            setMsg('Passwords do not match');
            return;
        }

        try {
            const payload = {
                name: formData.name,
                profilePicture: formData.profilePicture,
                preferences: {
                    theme: formData.theme,
                    unitSystem: formData.unitSystem
                }
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            const res = await axios.put('http://localhost:5000/api/auth/profile', payload, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });

            setUser(res.data); // Update context
            setMsg('Profile updated successfully!');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); // Clear password fields
        } catch (err) {
            console.error(err);
            setMsg('Error updating profile');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                <User className="w-8 h-8 text-red-600" /> User Profile
            </h1>

            <div className="bg-theme-dark p-8 rounded-lg">

                {/* Profile Picture (Simulated) */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-gray-700">
                            {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-gray-500" />
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition-colors border-4 border-gray-900">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {msg && <div className={`p-3 rounded mb-4 text-center ${msg.includes('success') ? 'bg-green-900/30 text-green-200 border border-green-800' : 'bg-red-900/30 text-red-200 border border-red-800'}`}>{msg}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm font-medium">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full input-field p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm font-medium">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full input-field p-2 rounded opacity-50 cursor-not-allowed" required disabled />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm font-medium">Profile Picture URL</label>
                        <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} className="w-full input-field p-2 rounded" placeholder="https://example.com/avatar.jpg" />
                    </div>

                    <div className="border-t border-gray-800 pt-4 mt-4">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Settings className="w-5 h-5 text-gray-400" /> Preferences</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Theme</label>
                                <select name="theme" value={formData.theme} onChange={handleChange} className="w-full input-field p-2 rounded">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Units</label>
                                <select name="unitSystem" value={formData.unitSystem} onChange={handleChange} className="w-full input-field p-2 rounded">
                                    <option value="metric">Metric (kg/cm)</option>
                                    <option value="imperial">Imperial (lbs/in)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-4 mt-4">
                        <h3 className="text-lg font-semibold text-white mb-3">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="password" name="password" placeholder="New Password" value={formData.password} onChange={handleChange} className="w-full input-field p-2 rounded" />
                            <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={formData.confirmPassword} onChange={handleChange} className="w-full input-field p-2 rounded" />
                        </div>
                    </div>

                    <button type="submit" className="w-full btn-primary p-3 rounded font-bold text-lg mt-6 flex justify-center items-center gap-2">
                        <Save size={20} /> Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
