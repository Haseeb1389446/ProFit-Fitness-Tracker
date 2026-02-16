import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Activity, User, UserCircle, Dumbbell, Utensils, TrendingUp } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    if (!user) return null;

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Activity },
        { path: '/add-workout', label: 'Workouts', icon: Dumbbell },
        { path: '/nutrition', label: 'Nutrition', icon: Utensils },
        { path: '/progress', label: 'Progress', icon: TrendingUp },
        { path: '/profile', label: 'Profile', icon: UserCircle },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
                            <Activity className="text-red-600" size={28} />
                            <span className="tracking-tight">Pro<span className="text-red-600">Fit</span></span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-baseline space-x-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-red-600/10 text-red-500 border border-red-600/20'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-4 pl-4 border-l border-gray-800">
                            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={16} className="text-gray-400" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-300 hidden lg:block">{user.name}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-gray-900 border-t border-gray-800"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            ))}

                            <div className="pt-4 mt-4 border-t border-gray-800">
                                <div className="flex items-center px-3 py-2 gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={20} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{user.name}</div>
                                        <div className="text-gray-500 text-sm">{user.email}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
