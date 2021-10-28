import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
})

// ---------- VISITS ---------- //
// ----- GET ----- //
export const getAllVisits = () => api.get(`/visits`);
export const getVisitsByStatus = (visitStatus, currentDate) => api.get(`/visits/${visitStatus}/${currentDate}`);

// ----- POST ----- //
export const createVisit = visitPayload => api.post(`/visits`, visitPayload);

// ----- PUT ----- //
export const updateVisitStatus = (payload) => api.put(`/visit/updateVisitStatus`, payload);

// --------- REF DATA ------- //

export const getVisitTypes = () => api.get(`/visitTypes`);

export const getVisitTypesByCode = visitTypeCode => api.get(`/visitTypes/${visitTypeCode}`);


const apis = {
    getAllVisits,
    getVisitsByStatus,
    createVisit,
    updateVisitStatus,
    getVisitTypes,
    getVisitTypesByCode
}

export default apis