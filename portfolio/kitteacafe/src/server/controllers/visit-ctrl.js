const Visit = require('../models/visit');

getVisits = async (req, res) => {
    await Visit.find({}, (err, visits) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!visits.length) {
            alert('error');
            return res
                .status(404)
                .json({ success: false, error: `Visit not found ` + err })
        }
        return res.status(200).json(visits)
    }).sort({ VisitDateTime: 1 }).catch(err => console.log(err))
}

getVisitsByStatus = async (req, res) => {

    var currentDate = new Date(req.params.currentDate);
    var tomorrowDate = new Date(currentDate);
        tomorrowDate.setHours(23,59);
        console.log("currentDate: ", currentDate);
        console.log("tomorrowDate: ", tomorrowDate);   

    if (req.params.status === 'Today') {
        console.log("Reached Today");
        await Visit.find({ VisitDateTime : {$gt: currentDate, $lt: tomorrowDate}, Status: 'Booked' }, (err, visits) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
    
            if (!visits) {
                return res
                    .status(404)
                    .json({ success: false, error: `Visits not found` })
            }
            return res.status(200).json(visits)
        }).sort({ VisitDateTime: 1 }).catch(err => console.log(err))
    }
    else {
        await Visit.find({ Status: req.params.status }, (err, visits) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
    
            if (!visits) {
                return res
                    .status(404)
                    .json({ success: false, error: `Visits not found` })
            }
            return res.status(200).json(visits)
        }).sort({ VisitDateTime: 1 }).catch(err => console.log(err))
    }
}

createVisit = async (req, res) => {
    console.log('Create Payload in Visit-Ctrl -> render -> req.body', req.body);
    const payload = req.body;

    if (!payload) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a visit',
        })
    }

    const visit = new Visit(payload);
    console.log('Create Payload in Visit-Ctrl -> render -> visit', visit);

    if (!visit) {
        alert(res.status(400).json({ success: false, error: err }));
    }

    visit
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                message: 'Visit created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Visit not created!',
                errorMessage: error.Message
            })
        })
};

updateVisitStatus = async (req, res) => {
    const payload = req.body

    if (!payload) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Visit.findOne({ _id: payload.VisitId }, (err, visit) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Visit not found!',
            })
        }

        console.log('IsEditable: ' + visit.IsEditable);

        if (visit.IsEditable) {
            
            visit.Status = payload.Status;

            visit
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: visit._id,
                        message: 'Visit updated!',
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Visit not updated!',
                    })
                })
        }
        else {
            console.log('Not editable');            
        }
    })
}

module.exports = {
    getVisits,
    getVisitsByStatus,
    createVisit,
    updateVisitStatus
}