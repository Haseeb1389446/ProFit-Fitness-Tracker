import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950">
            {/* Background Animations */}
            <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-gray-700/10 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-theme-dark p-8 rounded-2xl w-full max-w-md relative z-10 mx-4"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-white mb-2">Join ProFit</h2>
                    <p className="text-gray-400">Start your professional fitness journey</p>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-3 input-field rounded-xl"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 input-field rounded-xl"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 input-field rounded-xl"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 btn-primary font-bold rounded-xl shadow-lg shadow-red-900/20 hover:shadow-red-900/40 flex items-center justify-center gap-2"
                    >
                        <span>Create Account</span>
                        <ArrowRight size={20} />
                    </motion.button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-red-500 font-semibold hover:text-red-400 hover:underline transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
