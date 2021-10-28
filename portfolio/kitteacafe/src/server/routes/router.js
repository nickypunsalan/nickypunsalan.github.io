const express = require('express')

const VisitCtrl = require('../controllers/visit-ctrl')
const RefCtrl = require('../controllers/ref-ctrl')

const router = express.Router()

// ------ VISIT ENDPOINTS ------ //
router.get('/visits', VisitCtrl.getVisits)
router.get('/visits/:status/:currentDate?', VisitCtrl.getVisitsByStatus)
router.post('/visits', VisitCtrl.createVisit)
router.put('/visit/updateVisitStatus', VisitCtrl.updateVisitStatus)

// ------ REF ENDPOINTS ------ //

router.get('/visitTypes', RefCtrl.getVisitTypes)
router.get('/visitTypes/:code', RefCtrl.getVisitTypesByCode)

module.exports = router