const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'pending'],
        default: 'open'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
