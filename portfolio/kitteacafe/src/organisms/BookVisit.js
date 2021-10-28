import { Button, InputGroup, Col, Dropdown, DropdownButton, FloatingLabel, FormControl, Row } from 'react-bootstrap';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@material-ui/styles';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { Component } from 'react';
import MomentFnsUtils from '@date-io/moment';
import moment from 'moment';
import api from '../api/';

class BookVisit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visitType: '',
            visitTypeId: '',
            numVisitors: '',
            visitDate: moment().format('YYYY-MM-DD'),
            visitTime: '9:00',
            firstName: '',
            lastName: '',
            mobileNo: '',
            email: '',
            visitTypes: []
        }
        this.handleVisitTypeSelect = this.handleVisitTypeSelect.bind(this);
        this.handleNumVisitorsSelect = this.handleNumVisitorsSelect.bind(this);
        this.handleVisitDateSelect = this.handleVisitDateSelect.bind(this);
        this.handleVisitTimeSelect = this.handleVisitTimeSelect.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleMobileNoChange = this.handleMobileNoChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleVisitTypeSelect = async (visitTypeValue) => {
        const { visitTypes } = this.state;

        this.setState({ visitType: visitTypeValue });

        visitTypes.forEach(visitType => {
            if (visitTypeValue === visitType.Code) {
                this.setState({ visitTypeId: visitType._id });
            }
        });
    }

    handleNumVisitorsSelect(numVisitorsValue) {
        this.setState({ numVisitors: numVisitorsValue });
    }

    handleVisitDateSelect(visitDateValue) {
        const date = moment(visitDateValue).format('YYYY-MM-DD');
        console.log("date : " + date.toString())
        this.setState({ visitDate: date });
    }

    handleVisitTimeSelect(visitTimeValue) {
        console.log("time : " + visitTimeValue.toString())
        this.setState({ visitTime: visitTimeValue });
    }

    handleFirstNameChange(firstNameValue) {
        this.setState({ firstName: firstNameValue.target.value });
    }

    handleLastNameChange(lastNameValue) {
        this.setState({ lastName: lastNameValue.target.value });
    }

    handleMobileNoChange(mobileNoValue) {
        this.setState({ mobileNo: mobileNoValue.target.value });
    }

    handleEmailChange(emailValue) {
        this.setState({ email: emailValue.target.value });
    }

    handleSubmit = async () => {
        const { visitTypeId, numVisitors, visitDate, visitTime, firstName, lastName, mobileNo, email } = this.state;
        var dateTime = moment(visitDate + ' ' + visitTime);
        
        const payload = {
            VisitTypeId: visitTypeId, 
            NumberOfVisitors: numVisitors,
            FirstName: firstName,
            LastName: lastName, 
            ContactNumber: mobileNo,
            Email: email,
            IsDeleted: false,
            VisitDateTime: dateTime,
            IsEditable: true,
            Status: "Booked"            
        }
        console.log('Create Payload in BookVisit -> render -> payload', payload);

        await api.createVisit(payload)
                 .then(res => {
                    window.alert('success');
                    this.setState({
                        visitType: '',
                        visitTypeId: '',
                        numVisitors: '',
                        visitDate: moment().format('YYYY-MM-DD'),
                        visitTime: '9:00',
                        firstName: '',
                        lastName: '',
                        mobileNo: '',
                        email: ''
                    })
                 })
    }

    componentDidMount = async () => {
        await api.getVisitTypes().then(visitTypes => {
            this.setState({
                visitTypes: visitTypes.data
            })
        });
    }

    populateVisitTypes(visitType, index) {
        return (
            <Dropdown.Item eventKey={visitType.Code}>{visitType.Name}</Dropdown.Item>
        )
    }

    render() {
        const { visitTypes } = this.state;
        return (
            <div>
                {/* Component -- Create Appt */}
                <div className="testBox">
                                <h2>Test - View state values</h2>
                                <p>VisitType: {this.state?.visitType ? this.state.visitType : "No value"}</p>
                                <p>VisitTypeId: {this.state?.visitTypeId ? this.state.visitTypeId : "No value"}</p>
                                <p>NumOfVisitors: {this.state?.numVisitors ? this.state.numVisitors : "No value"}</p>
                                <p>VisitDate: {this.state?.visitDate ? moment(this.state.visitDate).format('DD MMM YYYY HH:mm A') : "No value"}</p>
                                <p>VisitTime: {this.state?.visitTime ? this.state.visitTime : "No value"}</p>
                                <p>FirstName: {this.state?.firstName ? this.state.firstName : "No value"}</p>
                                <p>LastName: {this.state?.lastName ? this.state.lastName : "No value"}</p>
                                <p>MobileNo: {this.state?.mobileNo ? this.state.mobileNo : "No value"}</p>
                                <p>Email: {this.state?.email ? this.state.email : "No value"}</p>
                                <p>VisitTypes: {this.state?.visitTypes ? "has Value" : "No value"}</p>
                </div>
                <div className="section  whiteBkg mt-4">
                    <Row>
                        <span className="sectionHeader">
                            book a visit
                        </span>
                    </Row>

                    {/* Component -- VisitForm */}
                    <Row>
                        <Col lg={6}>
                            <div>
                                <h2 className="mt-3">visit details</h2>
                                <InputGroup className="mt-3">
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title="Visit type"
                                        id="visitTypeDropdown"
                                        onSelect={this.handleVisitTypeSelect}
                                        >
                                            {visitTypes.map(this.populateVisitTypes)}
                                        {/* <Dropdown.Item eventKey="Cat visit">Cat visit</Dropdown.Item>
                                        <Dropdown.Item eventKey="Kitten visit">Kitten visit</Dropdown.Item> */}
                                    </DropdownButton>
                                    <FormControl aria-label="VisitTypeValue" value={this.state.visitType} />
                                </InputGroup>

                                <InputGroup className="mt-3">
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title="Number of visitors"
                                        id="numVisitorsDropdown"
                                        onSelect={this.handleNumVisitorsSelect}
                                    >
                                        <Dropdown.Item eventKey="1">1</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">2</Dropdown.Item>
                                        <Dropdown.Item eventKey="3">3</Dropdown.Item>
                                        <Dropdown.Item eventKey="4">4</Dropdown.Item>
                                        <Dropdown.Item eventKey="5">5</Dropdown.Item>
                                        <Dropdown.Item eventKey="6">6</Dropdown.Item>
                                    </DropdownButton>
                                    <FormControl aria-label="NumberOfVisitorsValue" value={this.state.numVisitors} />
                                </InputGroup>

                                <InputGroup className="mt-3">
                                <MuiPickersUtilsProvider utils={MomentFnsUtils}>
                                    <DatePicker
                                        variant="inline"
                                        label="Visit Date"
                                        format="DD / MM / yyyy"
                                        value={this.state.visitDate}
                                        onChange={this.handleVisitDateSelect}
                                        disablePast
                                        autoOk
                                    />
                                    </MuiPickersUtilsProvider>
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title="Visit Time"
                                        id="visitTimeDropdown"
                                        onSelect={this.handleVisitTimeSelect}
                                    >
                                        <Dropdown.Item eventKey="9:00">9:00</Dropdown.Item>
                                        <Dropdown.Item eventKey="10:00">10:00</Dropdown.Item>
                                        <Dropdown.Item eventKey="11:00">11:00</Dropdown.Item>
                                        <Dropdown.Item eventKey="12:00">12:00</Dropdown.Item>
                                        <Dropdown.Item eventKey="13:00">13:00</Dropdown.Item>
                                        <Dropdown.Item eventKey="14:00">14:00</Dropdown.Item>
                                        <Dropdown.Item eventKey="15:00">15:00</Dropdown.Item>
                                        <Dropdown.Item eventKey="16:00">16:00</Dropdown.Item>
                                    </DropdownButton>
                                    <FormControl aria-label="VisitTimeValue" value={this.state.visitTime} />
                                </InputGroup>

                                <h2 className="mt-5">contact details</h2>

                                <FloatingLabel controlId="floatingFirstName" label="First Name">
                                    <FormControl type="text" placeholder="firstName" value={this.state.firstName} onChange={this.handleFirstNameChange}/>
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingLastName" label="Last Name" className="mt-3">
                                    <FormControl type="text" placeholder="lastName" value={this.state.lastName} onChange={this.handleLastNameChange}/>
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingMobileNo" label="Mobile no." className="mt-3">
                                    <FormControl type="text" placeholder="mobileNo" value={this.state.mobileNo} onChange={this.handleMobileNoChange}/>
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingEmail" label="Email" className="mt-3">
                                    <FormControl type="text" placeholder="email" value={this.state.email} type="email" onChange={this.handleEmailChange}/>
                                </FloatingLabel>

                                <h2 className="mt-5">add-ons</h2>

                                <Button className="kcButton mt-3" onClick={this.handleSubmit} >Submit</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default BookVisit;