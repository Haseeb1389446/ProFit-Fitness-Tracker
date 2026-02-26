import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { LifeBuoy, Send, MessageSquare } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Support = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (activeTab === 'history') {
            fetchTickets();
        }
    }, [activeTab]);

    const fetchTickets = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/support', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/support', { subject, message }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMsg('Ticket submitted successfully!');
            setSubject('');
            setMessage('');
            setTimeout(() => setMsg(''), 3000);
            if (activeTab === 'history') fetchTickets();
        } catch (err) {
            console.error(err);
            setMsg('Error submitting ticket.');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                <LifeBuoy className="w-8 h-8" /> Support & Help
            </h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-700">
                <button
                    className={`pb-2 px-4 font-semibold ${activeTab === 'new' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setActiveTab('new')}
                >
                    New Ticket
                </button>
                <button
                    className={`pb-2 px-4 font-semibold ${activeTab === 'history' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => setActiveTab('history')}
                >
                    My Tickets
                </button>
            </div>

            {activeTab === 'new' ? (
                <form onSubmit={handleSubmit} className="bg-theme-dark p-6 rounded-lg space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm font-medium">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full input-field p-2 rounded"
                            placeholder="e.g. Issue with workout log"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm font-medium">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full input-field p-2 rounded h-32"
                            placeholder="Describe your issue..."
                            required
                        ></textarea>
                    </div>

                    {msg && <p className={`text-center p-2 rounded ${msg.includes('Error') ? 'text-red-400 bg-red-400/10' : 'text-white bg-gray-700'}`}>{msg}</p>}

                    <button type="submit" className="w-full btn-primary p-3 rounded font-bold flex justify-center items-center gap-2">
                        <Send size={18} /> Submit Ticket
                    </button>
                </form>
            ) : (
                <div className="space-y-4">
                    {tickets.map(ticket => (
                        <div key={ticket._id} className="bg-theme-dark p-4 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white text-lg">{ticket.subject}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${ticket.status === 'open' ? 'text-white border-gray-500 bg-gray-700' :
                                        ticket.status === 'closed' ? 'text-gray-500 border-gray-700 bg-gray-900' :
                                            'text-white border-gray-500 bg-gray-700'
                                    }`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <p className="text-gray-300 mb-3">{ticket.message}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-800 pt-2">
                                <span>ID: {ticket._id.slice(-6)}</span>
                                <span>{new Date(ticket.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                    {tickets.length === 0 && <p className="text-center text-gray-500 py-8">No support tickets found.</p>}
                </div>
            )}
        </div>
    );
};

export default Support;
