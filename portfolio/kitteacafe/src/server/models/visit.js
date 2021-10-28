const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Visit = new Schema(
    {
        VisitTypeId: { type: mongoose.ObjectId, required: true },
        NumberOfVisitors: { type: Number, required: true },
        FirstName: { type: String, required: true },
        LastName: { type: String, required: true },
        ContactNumber: { type: String, required: true },
        Email: { type: String, required: true },
        VisitDateTime: {type: Date, required: true},
        IsDeleted: { type: Boolean, required: true },
        IsEditable: { type: Boolean, required: true},
        Status: { type: String, required: true}
    },
)

module.exports = mongoose.model('visits', Visit, 'visit')