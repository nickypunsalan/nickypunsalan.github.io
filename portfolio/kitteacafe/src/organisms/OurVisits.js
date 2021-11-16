import { Col, Dropdown, DropdownButton, FormControl, InputGroup, Row, Table } from 'react-bootstrap';
import api from '../api';
import React, { Component } from 'react';
import moment from 'moment';
import Popup from '../molecules/Popup';
import { VisitStatus, SuccessTitle, WarningTitle, WarningDescription, SuccessDescription } from '../constants';

class OurVisits extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visits: [],
            columns: [],
            visitTypes: [],
            visitId: '',
            isLoading: false,
            visitStatus: VisitStatus.STATUS_TODAY,
            dateToday: "",
            confirmationPopupShown: false,
            cancelSucccessPopupShown: false,
            attendedPopupShown: false,
            attendSuccessPopupShown: false,
            isConfirmed: false,
            popupTitle: "",
            popupDesc: []
        }

        this.handleCancelVisit = this.handleCancelVisit.bind(this);
        this.handleAttendVisit = this.handleAttendVisit.bind(this);
        this.populateTableData = this.populateTableData.bind(this);
        this.handleVisitStatusSelect = this.handleVisitStatusSelect.bind(this);

        this.setConfirmationPopupShown = this.setConfirmationPopupShown.bind(this);
        this.setCancelSucccessPopupShown = this.setCancelSucccessPopupShown.bind(this);
        this.setOnConfirmationHide = this.setOnConfirmationHide.bind(this);
        this.setOnCancelSuccessHide = this.setOnCancelSuccessHide.bind(this);

        this.setAttendedPopupShown = this.setAttendedPopupShown.bind(this);
        this.setAttendSuccessPopupShown = this.setAttendSuccessPopupShown.bind(this);

    }

    setOnConfirmationHide(showModal) {
        this.setState({ confirmationPopupShown: showModal });
    }

    setOnCancelSuccessHide(showModal) {
        this.setState({ cancelSucccessPopupShown: showModal });
    }

    setOnAttendHide(showModal) {
        this.setState({ attendedPopupShown: showModal  });
    }

    setOnAttendSuccessHide(showModal) {
        this.setState({ attendSuccessPopupShown: showModal });
    }

    setConfirmationPopupShown() {
        this.setState({ confirmationPopupShown: true});
    }

    setCancelSucccessPopupShown() {
        this.setState({ cancelSucccessPopupShown: true});
    }

    setAttendedPopupShown() {
        this.setState({ attendedPopupShown: true});
    }

    setAttendSuccessPopupShown() {
        this.setState({ attendSuccessPopupShown: true});
    }

    handleCancelVisit = async (visitId) => {
        var warnings = [];
        warnings.push(WarningDescription.WARN_CANCEL_DESC);
        this.setState({ visitId: visitId, popupTitle: WarningTitle.WARN_CANCEL_TITLE, popupDesc: warnings });

        this.setConfirmationPopupShown();

    }

    cancelVisit = async () => {

        this.setOnConfirmationHide(false);

        var successes = [];
        successes.push(SuccessDescription.SUCC_CANCEL_DESC);

        this.setState({ popupTitle: SuccessTitle.SUCC_CANCEL_TITLE, popupDesc: successes });

        const payload = {
            VisitId: this.state.visitId,
            Status: VisitStatus.STATUS_CANCELLED
        };

        await api.updateVisitStatus(payload).then(res =>{
            this.setCancelSucccessPopupShown();
        });

        if (this.state.visitStatus === VisitStatus.STATUS_ALL) {
            await api.getAllVisits().then(visits => {
                this.setState({
                    visitStatus: VisitStatus.STATUS_ALL,
                    visits: visits.data,
                    isloading: false
                });
            })
        }
        else {
            await api.getVisitsByStatus(this.state.visitStatus).then(visits => {
                this.setState({
                    visits: visits.data,
                    isLoading: false
                });
            })
        }
    }

    handleAttendVisit = async (visitId) => {
        
        var warnings = [];
        warnings.push(WarningDescription.WARN_ATTEND_DESC);

        this.setState({ visitId: visitId, popupTitle: WarningTitle.WARN_ATTEND_TITLE, popupDesc: warnings });

        this.setAttendedPopupShown();
    }

    attendVisit = async () => {

        this.setOnAttendHide(false);

        var successes = [];
        successes.push(SuccessDescription.SUCC_ATTEND_DESC);

        this.setState({ popupTitle: SuccessTitle.SUCC_ATTEND_TITLE, popupDesc: successes });

        const payload = {
            VisitId: this.state.visitId,
            Status: VisitStatus.STATUS_ATTENDED
        };

        await api.updateVisitStatus(payload).then(res => {
            this.setAttendSuccessPopupShown();
        })

        if (this.state.visitStatus === VisitStatus.STATUS_ALL) {
            await api.getAllVisits().then(visits => {
                this.setState({
                    visitStatus: VisitStatus.STATUS_ALL,
                    visits: visits.data,
                    isloading: false
                });
            })
        }
        else {
            await api.getVisitsByStatus(this.state.visitStatus, this.state.dateToday).then(visits => {
                this.setState({
                    visits: visits.data,
                    isLoading: false
                });
            })
        }
    }

    handleVisitStatusSelect = async (visitStatus) => {
        this.setState({ visitStatus: visitStatus });

        if (visitStatus === VisitStatus.STATUS_ALL) {
            await api.getAllVisits().then(visits => {
                this.setState({
                    visitStatus: VisitStatus.STATUS_ALL,
                    visits: visits.data,
                    isloading: false
                });
            })
        }
        else {
            await api.getVisitsByStatus(visitStatus, this.state.dateToday).then(visits => {
                this.setState({
                    visitStatus: visitStatus,
                    visits: visits.data,
                    isLoading: false
                });
            })
        }
    }

    componentDidMount = async () => {
        var dateToday = moment().startOf('day');
        this.setState({ isLoading: false, dateToday: dateToday });

        await api.getVisitsByStatus("Today", dateToday).then(visits => {
            this.setState({
                visits: visits.data,
                isLoading: false
            });
        })

        await api.getVisitTypes().then(visitTypes => {
            this.setState({
                visitTypes: visitTypes.data
            })
        });
    }

    isVisitToday(visitId, date) {
        var isCurrentDate = moment(date).startOf('day').isSameOrBefore(moment().startOf('day'));
        return isCurrentDate ? (<i className="bi-person-check icon" onClick={() => this.handleAttendVisit(visitId)}></i>) : '';
    }

    populateTableData(visit, index) {
        const date = moment(visit.VisitDateTime).format('DD MMM YYYY hh:mm A');
        var visitType = '';

        this.state.visitTypes.forEach(vt => {
            if (visit.VisitTypeId === vt._id) {
                visitType = vt.Name
            }
        });

        return (
            <tr key={index}>
                <td>{visit.ContactNumber}</td>
                <td>{visit.Status}</td>
                <td>{visit.FirstName}</td>
                <td>{visit.LastName}</td>
                <td>{visitType}</td>
                <td>{date}</td>
                <td>{visit.NumberOfVisitors}</td>
                    {visit.Status === VisitStatus.STATUS_BOOKED ?
                        (<td>
                            <i className="bi-trash icon" alt="Cancel" onClick={() => this.handleCancelVisit(visit._id)}></i>
                            {this.isVisitToday(visit._id, date)}
                        </td>)
                        : (<td>-</td>)
                    }
            </tr>
        )
    }

    populateTableHeader(columns) {
        return (
            <th>{columns.Header}</th>
        )
    }

    render() {
        const { visits } = this.state;
        console.log('VisitsList -> render -> visits', visits);

        const columns = [
            { Header: 'Contact No.' },
            { Header: 'Status' },
            { Header: 'First Name' },
            { Header: 'Last Name' },
            { Header: 'Visit Type'},
            { Header: 'Visit Time' },
            { Header: '# Visitors' },
            { Header: 'Actions' }
        ];

        return (
            <div>
                <div className="testBox2">
                    <h2>Test - View state values</h2>
                    <p>Visits: {this.state?.visits ? "Has value" : "No value"}</p>
                    <p>VisitStatus: {this.state?.visitStatus ? this.state.visitStatus : "No value"}</p>
                    <p>VisitTypes: {this.state?.visitTypes ? "Has value" : "No value"}</p>
                    <p>DateToday: {this.state?.dateToday ? "Has value" : "No value"}</p>
                    <p>VisitId: {this.state?.visitId ? this.state.visitId : "No value"}</p>

                </div>
                <div className="section whiteBkg mt-4">
                    <Row>
                        <span className="sectionHeader">
                            our visits
                    </span>
                    </Row>

                    <Row className="mt-3">
                        <InputGroup className="mt-3">
                            <DropdownButton
                                variant="outline-secondary"
                                title="Visit Status"
                                id="visitStatusDropdown"
                                onSelect={this.handleVisitStatusSelect}
                            >
                                <Dropdown.Item eventKey={VisitStatus.STATUS_ALL}>All</Dropdown.Item>
                                <Dropdown.Item eventKey={VisitStatus.STATUS_TODAY}>Today</Dropdown.Item>
                                <Dropdown.Item eventKey={VisitStatus.STATUS_BOOKED}>Booked</Dropdown.Item>
                                <Dropdown.Item eventKey={VisitStatus.STATUS_ATTENDED}>Attended</Dropdown.Item>
                                <Dropdown.Item eventKey={VisitStatus.STATUS_CANCELLED}>Cancelled</Dropdown.Item>
                            </DropdownButton>
                            <FormControl aria-label="VisitStatusValue" value={this.state.visitStatus} />
                        </InputGroup>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <Table striped condensed hover responsive className="mt-4">
                                <thead>
                                    <tr>
                                        {columns.map(this.populateTableHeader)}
                                    </tr>
                                </thead>
                                    {visits && visits.length > 0 ? 
                                        (<tbody>{visits.map(this.populateTableData)}</tbody>)
                                        : (<tr>{"No appointments"}</tr>)
                                    }                                    
                            </Table>
                        </Col>
                    </Row>

                    <Popup isConfirmationPopup={true} show={this.state.confirmationPopupShown} onHide={() => this.setOnConfirmationHide(false)} onConfirm={() => this.cancelVisit()} popupTitle={this.state.popupTitle} popupDesc={this.state.popupDesc} />
                    <Popup isConfirmationPopup={false} show={this.state.cancelSucccessPopupShown} onHide={() => this.setOnCancelSuccessHide(false)} popupTitle={this.state.popupTitle} popupDesc={this.state.popupDesc} />

                    <Popup isConfirmationPopup={true} show={this.state.attendedPopupShown} onHide={() => this.setOnAttendHide(false)} onConfirm={() => this.attendVisit()} popupTitle={this.state.popupTitle} popupDesc={this.state.popupDesc} />
                    <Popup isConfirmationPopup={false} show={this.state.attendSuccessPopupShown} onHide={() => this.setOnAttendSuccessHide(false)} popupTitle={this.state.popupTitle} popupDesc={this.state.popupDesc} />

                </div>
            </div>
        )
    }
}

export default OurVisits;