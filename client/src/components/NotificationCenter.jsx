import { useState, useEffect, useContext } from 'react';
import { Bell, X } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const NotificationCenter = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!user?.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('http://localhost:5000/api/notifications', config);
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.read).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every minute (simple implementation)
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, config);

            // Update local state
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = async (e, id) => {
        e.stopPropagation(); // Prevent closing dropdown or marking as read if we were clicking the item
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/notifications/${id}`, config);

            // Update local state
            const notif = notifications.find(n => n._id === id);
            if (notif && !notif.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative">
            <button
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-700">
                    <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-700 font-semibold text-white">
                            Notifications
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-400">No notifications</div>
                            ) : (
                                notifications.map(notif => (
                                    <div
                                        key={notif._id}
                                        className={`px-4 py-3 hover:bg-gray-700 cursor-pointer flex justify-between items-start transition-colors ${!notif.read ? 'bg-gray-700/50' : ''}`}
                                        onClick={() => markAsRead(notif._id)}
                                    >
                                        <div className={`text-sm ${!notif.read ? 'text-white font-semibold' : 'text-gray-400'}`}>
                                            <p>{notif.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{new Date(notif.date).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            onClick={(e) => deleteNotification(e, notif._id)}
                                            className="text-gray-500 hover:text-red-500 ml-2"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop to close dropdown when clicking outside */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                ></div>
            )}
        </div>
    );
};

export default NotificationCenter;
