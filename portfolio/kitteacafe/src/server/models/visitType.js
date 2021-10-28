const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VisitType = new Schema(
    {
        Name: { type: String, required: true },
        Code: { type: String, required: true },
        IsDeleted: { type: Boolean, required: true }
    },
)

module.exports = mongoose.model('visitTypes', VisitType, 'ref_visittype')