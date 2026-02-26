import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Settings, Camera, Save, LifeBuoy } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext); // Use updateUser instead of setUser
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        profilePicture: user?.profilePicture || '',
        work: user?.work || '',
        bio: user?.bio || '',
        location: user?.location || '',
        password: '',
        confirmPassword: '',
        theme: user?.preferences?.theme || 'light',
        unitSystem: user?.preferences?.unitSystem || 'metric'
    });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                profilePicture: user.profilePicture || '',
                work: user.work || '',
                bio: user.bio || '',
                location: user.location || '',
                password: '',
                confirmPassword: '',
                theme: user.preferences?.theme || 'light',
                unitSystem: user.preferences?.unitSystem || 'metric'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            });

            // Update local state and context
            setFormData(prev => ({ ...prev, profilePicture: res.data.imageUrl }));
            // Assuming the response also returns the updated user object or we construct it
            // Better to refresh the user from context or use the returned url
            const updatedUser = { ...user, profilePicture: res.data.imageUrl };
            updateUser(updatedUser);

            setMsg('Profile picture updated successfully!');
        } catch (err) {
            console.error(err);
            setMsg(err.response?.data?.message || 'Error uploading image');
        }
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
                profilePicture: formData.profilePicture, // This might be the URL now
                work: formData.work,
                bio: formData.bio,
                location: formData.location,
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
                    Authorization: `Bearer ${user.token}`
                }
            });

            updateUser(res.data); // Update context and localStorage while preserving token
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
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-gray-700">
                            {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-gray-500" />
                            )}
                        </div>
                        <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition-colors border-4 border-gray-900 cursor-pointer">
                            <Camera className="w-4 h-4" />
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {msg && <div className={`p-3 rounded mb-4 text-center ${msg.includes('success') ? 'bg-gray-800 text-white border border-gray-700' : 'bg-red-900/30 text-red-200 border border-red-800'}`}>{msg}</div>}

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Link to="/settings" className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-gray-700 transition-colors border border-gray-700 group">
                        <Settings className="w-8 h-8 text-gray-300 mb-2 group-hover:rotate-45 transition-transform" />
                        <span className="text-gray-300 font-semibold">Settings</span>
                    </Link>
                    <Link to="/support" className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-gray-700 transition-colors border border-gray-700 group">
                        <LifeBuoy className="w-8 h-8 text-gray-300 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-300 font-semibold">Support</span>
                    </Link>
                </div>

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
                        <label className="block text-gray-400 mb-1 text-sm font-medium">Work / Profession</label>
                        <input type="text" name="work" value={formData.work} onChange={handleChange} className="w-full input-field p-2 rounded" placeholder="Software Engineer" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm font-medium">Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full input-field p-2 rounded" placeholder="New York, USA" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm font-medium">Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full input-field p-2 rounded" rows="3" placeholder="Tell us about yourself..."></textarea>
                    </div>

                    {/* Preferences Moved to Settings Page */}

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
