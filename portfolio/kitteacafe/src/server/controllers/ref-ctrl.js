const VisitType = require('../models/visitType')

getVisitTypes = async (req, res) => {
    await VisitType.find({}, (err, visitTypes) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!visitTypes.length) {
            alert('error');
            return res
                .status(404)
                .json({ success: false, error: `VisitTypes not found ` + err })
        }
        return res.status(200).json(visitTypes)
    }).catch(err => console.log(err))
}

getVisitTypesByCode = async (req, res) => {
    await VisitType.findOne({ Code: req.params.code }, (err, visitType) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!visitType) {
            return res
                .status(404)
                .json({ success: false, error: `VisitType not found` })
        }
        return res.status(200).json(visitType);
    }).catch(err => console.log(err))
}

module.exports = {
    getVisitTypes,
    getVisitTypesByCode
}