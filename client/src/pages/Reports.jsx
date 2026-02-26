import { useState, useContext } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Download, Calendar } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Reports = () => {
    const { user } = useContext(AuthContext);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('workouts');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const generateReport = async () => {
        if (!startDate || !endDate) {
            setMsg('Please select both start and end dates.');
            return;
        }

        setLoading(true);
        setMsg('');

        try {
            const params = new URLSearchParams();
            params.append('startDate', startDate);
            params.append('endDate', endDate);

            const doc = new jsPDF();

            // Header
            doc.setFontSize(22);
            doc.setTextColor(220, 38, 38); // Red-600
            doc.text('ProFit Performance Report', 14, 22);

            doc.setFontSize(11);
            doc.setTextColor(100, 116, 139); // Slate-500
            doc.text(`Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 14, 30);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);
            doc.text(`Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`, 14, 42);
            doc.text(`User: ${user?.name || 'User'}`, 14, 48);

            if (reportType === 'workouts') {
                const res = await axios.get(`http://localhost:5000/api/workouts?${params.toString()}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                const data = res.data;

                if (!Array.isArray(data) || data.length === 0) {
                    setMsg('No workout data found for the selected period.');
                    setLoading(false);
                    return;
                }

                const tableData = data.map(w => [
                    new Date(w.date).toLocaleDateString(),
                    w.activity || 'N/A',
                    w.category || 'N/A',
                    `${w.duration || 0} mins`,
                    `${w.calories || 0} kcal`
                ]);

                autoTable(doc, {
                    startY: 55,
                    head: [['Date', 'Activity', 'Category', 'Duration', 'Calories']],
                    body: tableData,
                    headStyles: { fillColor: [220, 38, 38] },
                });

                // Summary
                const totalWorkouts = data.length;
                const totalDuration = data.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
                const totalCalories = data.reduce((acc, curr) => acc + (Number(curr.calories) || 0), 0);

                let finalY = (doc).lastAutoTable.finalY + 15;
                doc.setFontSize(14);
                doc.setTextColor(0, 0, 0);
                doc.text('Workout Summary Stats', 14, finalY);
                doc.setFontSize(11);
                doc.text(`Total Workouts: ${totalWorkouts}`, 14, finalY + 8);
                doc.text(`Total Duration: ${totalDuration} minutes`, 14, finalY + 14);
                doc.text(`Total Calories Burned: ${totalCalories} kcal`, 14, finalY + 20);

            } else if (reportType === 'nutrition') {
                const res = await axios.get(`http://localhost:5000/api/nutrition?${params.toString()}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                const data = res.data;

                if (!Array.isArray(data) || data.length === 0) {
                    setMsg('No nutrition data found for the selected period.');
                    setLoading(false);
                    return;
                }

                const tableData = data.map(n => {
                    const protein = (n.foodItems || []).reduce((acc, item) => acc + (Number(item.protein) || 0), 0);
                    const carbs = (n.foodItems || []).reduce((acc, item) => acc + (Number(item.carbs) || 0), 0);
                    const fat = (n.foodItems || []).reduce((acc, item) => acc + (Number(item.fat) || 0), 0);

                    return [
                        new Date(n.date).toLocaleDateString(),
                        n.mealType || 'N/A',
                        `${n.totalCalories || 0} kcal`,
                        `${protein}g`,
                        `${carbs}g`,
                        `${fat}g`
                    ];
                });

                autoTable(doc, {
                    startY: 55,
                    head: [['Date', 'Meal Type', 'Calories', 'Protein', 'Carbs', 'Fat']],
                    body: tableData,
                    headStyles: { fillColor: [220, 38, 38] },
                });

                // Summary
                const totalCalories = data.reduce((acc, curr) => acc + (Number(curr.totalCalories) || 0), 0);
                const avgCalories = (totalCalories / data.length).toFixed(0);

                let finalY = (doc).lastAutoTable.finalY + 15;
                doc.setFontSize(14);
                doc.setTextColor(0, 0, 0);
                doc.text('Nutrition Summary Stats', 14, finalY);
                doc.setFontSize(11);
                doc.text(`Total Calories Consumed: ${totalCalories} kcal`, 14, finalY + 8);
                doc.text(`Average Calories per Entry: ${avgCalories} kcal`, 14, finalY + 14);

            } else if (reportType === 'progress') {
                const res = await axios.get(`http://localhost:5000/api/progress?${params.toString()}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                const data = res.data;

                if (!Array.isArray(data) || data.length === 0) {
                    setMsg('No progress data found for the selected period.');
                    setLoading(false);
                    return;
                }

                const tableData = data.map(p => [
                    new Date(p.date).toLocaleDateString(),
                    `${p.weight || 'N/A'} kg`,
                    `${p.measurements?.chest || '-'}`,
                    `${p.measurements?.waist || '-'}`,
                    `${p.measurements?.hips || '-'}`,
                    `${p.measurements?.biceps || '-'}`
                ]);

                autoTable(doc, {
                    startY: 55,
                    head: [['Date', 'Weight', 'Chest', 'Waist', 'Hips', 'Biceps']],
                    body: tableData,
                    headStyles: { fillColor: [220, 38, 38] },
                });

                // Summary
                const weights = data.map(p => Number(p.weight)).filter(w => !isNaN(w));
                let weightChange = '0.0';
                if (weights.length > 1) {
                    weightChange = (weights[0] - weights[weights.length - 1]).toFixed(1);
                }

                let finalY = (doc).lastAutoTable.finalY + 15;
                doc.setFontSize(14);
                doc.setTextColor(0, 0, 0);
                doc.text('Progress Summary Stats', 14, finalY);
                doc.setFontSize(11);
                doc.text(`Starting Weight: ${weights.length > 0 ? weights[weights.length - 1] : 'N/A'} kg`, 14, finalY + 8);
                doc.text(`Current Weight: ${weights.length > 0 ? weights[0] : 'N/A'} kg`, 14, finalY + 14);
                doc.text(`Net Weight Change: ${weights.length > 1 ? (Number(weightChange) > 0 ? '+' : '') + weightChange : '0.0'} kg`, 14, finalY + 20);
            }

            doc.save(`ProFit_Report_${reportType}_${startDate}_${endDate}.pdf`);
            setLoading(false);
            setMsg('Report downloaded successfully!');
        } catch (err) {
            console.error('Report Generation Error:', err);
            const errorText = err.response?.data?.message || err.message || 'Unknown error';
            setMsg(`Error generating report: ${errorText}`);
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                <FileText className="w-8 h-8 text-red-600" /> Reports & Export
            </h1>

            <div className="bg-theme-dark p-6 rounded-lg max-w-2xl mx-auto border border-gray-800 shadow-xl">
                <div className="mb-6">
                    <label className="block text-gray-400 mb-3 font-medium">Select Report Type</label>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setReportType('workouts')}
                            className={`p-3 rounded-lg border transition-all ${reportType === 'workouts' ? 'bg-red-600/20 border-red-600 text-red-500 font-bold' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                        >
                            Workouts
                        </button>
                        <button
                            type="button"
                            onClick={() => setReportType('nutrition')}
                            className={`p-3 rounded-lg border transition-all ${reportType === 'nutrition' ? 'bg-red-600/20 border-red-600 text-red-500 font-bold' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                        >
                            Nutrition
                        </button>
                        <button
                            type="button"
                            onClick={() => setReportType('progress')}
                            className={`p-3 rounded-lg border transition-all ${reportType === 'progress' ? 'bg-red-600/20 border-red-600 text-red-500 font-bold' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                        >
                            Progress
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-400 mb-2 font-medium">Start Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 pl-10 focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2 font-medium">End Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded p-2 pl-10 focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>
                </div>

                {msg && <p className={`text-center p-2 rounded ${msg.includes('Error') || msg.includes('Please') ? 'text-red-400 bg-red-400/10' : 'text-green-400 bg-green-400/10'}`}>{msg}</p>}

                <button
                    onClick={generateReport}
                    disabled={loading}
                    className="w-full btn-primary p-3 rounded font-bold flex justify-center items-center gap-2"
                >
                    {loading ? 'Generating...' : <><Download size={20} /> Download PDF Report</>}
                </button>
            </div>
        </div>
    );
};

export default Reports;
