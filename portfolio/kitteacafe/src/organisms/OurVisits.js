import { Button, Col, Dropdown, DropdownButton, FormControl, InputGroup, Modal, Row, Table } from 'react-bootstrap';
import api from '../api';
import React, { Component } from 'react';
import moment from 'moment';
import { VisitStatus } from '../constants';

class OurVisits extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visits: [],
            columns: [],
            visitTypes: [],
            isLoading: false,
            visitStatus: VisitStatus.STATUS_TODAY,
            dateToday: ""
        }

        this.handleCancelVisit = this.handleCancelVisit.bind(this);
        this.handleAttendVisit = this.handleAttendVisit.bind(this);
        this.populateTableData = this.populateTableData.bind(this);
        this.handleVisitStatusSelect = this.handleVisitStatusSelect.bind(this);
    }

    handleCancelVisit = async (visitId) => {
        alert("test: " + visitId);
        const payload = {
            VisitId: visitId,
            Status: VisitStatus.STATUS_CANCELLED
        };

        await api.updateVisitStatus(payload).then(res => {
            alert(`Visit updated to Cancelled successfully`);
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
            await api.getVisitsByStatus(this.state.visitStatus).then(visits => {
                this.setState({
                    visits: visits.data,
                    isLoading: false
                });
            })
        }
    }

    handleAttendVisit = async (visitId) => {
        alert("attendVisitTest: " + visitId);
        const payload = {
            VisitId: visitId,
            Status: VisitStatus.STATUS_ATTENDED
        };

        await api.updateVisitStatus(payload).then(res => {
            alert(`Visit updated to Attended successfully`);
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
            await api.getVisitsByStatus(this.state.visitStatus).then(visits => {
                this.setState({
                    visits: visits.data,
                    isLoading: false
                });
            })
        }
    }

    handleVisitStatusSelect = async (visitStatus) => {
        this.setState({ visitStatus: visitStatus });
        var newDate = moment().startOf('day');

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
        var isCurrentDate = moment(date).startOf('day').isSame(moment().startOf('day'));
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

    MyVerticallyCenteredModal(props) {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Modal heading
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Centered Modal</h4>
              <p>
                Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                consectetur ac, vestibulum at eros.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
        );
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
                </div>
            </div>
        )
    }
}

export default OurVisits;