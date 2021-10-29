import { Button, InputGroup, Col, Dropdown, DropdownButton, FloatingLabel, Form, FormControl, Row } from 'react-bootstrap';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { Component } from 'react';
import MomentFnsUtils from '@date-io/moment';
import moment from 'moment';
import api from '../api/';
import Popup from '../molecules/Popup';
import { ErrorDescription, ErrorTitle, SuccessDescription, SuccessTitle } from '../constants';

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
            isValid: false,
            isShown: false,
            popupMsgCode: '',
            popupTitle: '',
            popupDesc: '',
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

        this.setIsShown = this.setIsShown.bind(this);
        this.setOnHide = this.setOnHide.bind(this);
        this.setIsValid = this.setIsValid.bind(this);
        this.setClearForm = this.setClearForm.bind(this);
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

    setIsValid() {
        this.setState({ isValid: true});
    }

    setClearForm() {
        this.setState({ isValid: false});
    }

    setIsShown() {
        this.setState({ isShown: true });
    }

    setOnHide(showModal) {
        this.setState({ isShown: showModal });
    }

    handleSubmit = async (event) => {
        const { visitTypeId, numVisitors, visitDate, visitTime, firstName, lastName, mobileNo, email } = this.state;
        const form = event.currentTarget;

        // if (form.checkValidity() === false) {
        //     event.preventDefault();
        //     event.stopPropagation();
        // }

        event.preventDefault();
        event.stopPropagation();
        
        this.setIsValid();
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
                    this.setState({
                        visitType: '',
                        visitTypeId: '',
                        numVisitors: '',
                        visitDate: moment().format('YYYY-MM-DD'),
                        visitTime: '9:00',
                        firstName: '',
                        lastName: '',
                        mobileNo: '',
                        email: '',
                        popupDesc: SuccessDescription.SUCC_BOOK_DESC,
                        popupTitle: SuccessTitle.SUCC_BOOK_TITLE
                    }, this.setIsShown(), this.setClearForm())
                 })
                 .catch (err => {
                    if (err.response.status === 400) {
                        this.setState({
                            popupDesc: ErrorDescription.ERR_BOOK_DESC,
                            popupTitle: ErrorTitle.ERR_BOOK_TITLE
                        }, this.setIsShown());
                    }
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
        const { visitTypes, isShown, popupDesc, popupTitle } = this.state;
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
                                <p>IsValid (form): {this.state?.isValid ? this.state.isValid.toString() : "false"}</p>
                                <p>IsShown (modal): {this.state?.isShown ? this.state.isShown.toString() : "false"}</p>
                                <p>ErrorMessage (modal): {this.state?.popupMsgCode ? this.state.popupMsgCode : "No value"}</p>

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
                                <Form id="MyForm" noValidate validated={this.state.isValid} onSubmit={this.handleSubmit}>
                                <InputGroup className="mt-3">
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title="Visit type"
                                        id="visitTypeDropdown"
                                        onSelect={this.handleVisitTypeSelect}
                                        >
                                        {visitTypes.map(this.populateVisitTypes)}
                                    </DropdownButton>
                                    <Form.Control required name="VisitTypeValue" aria-label="VisitTypeValue" value={this.state.visitType} />
                                    <Form.Control.Feedback type="invalid">Visit type is required.</Form.Control.Feedback>
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
                                    <Form.Control required aria-label="NumberOfVisitorsValue" value={this.state.numVisitors} />
                                    <Form.Control.Feedback type="invalid">Number of visitors is required.</Form.Control.Feedback>
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
                                    <Form.Control required aria-label="VisitTimeValue" value={this.state.visitTime} />
                                </InputGroup>

                                <h2 className="mt-5">contact details</h2>

                                <FloatingLabel controlId="floatingFirstName" label="First Name">
                                    <Form.Control required type="text" placeholder="firstName" value={this.state.firstName} onChange={this.handleFirstNameChange}/>
                                    <Form.Control.Feedback type="invalid">First name is required.</Form.Control.Feedback>
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingLastName" label="Last Name" className="mt-3">
                                    <Form.Control required type="text" placeholder="lastName" value={this.state.lastName} onChange={this.handleLastNameChange}/>
                                    <Form.Control.Feedback type="invalid">Last name is required.</Form.Control.Feedback>
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingMobileNo" label="Mobile no." className="mt-3">
                                    <Form.Control required type="text" placeholder="mobileNo" value={this.state.mobileNo} onChange={this.handleMobileNoChange}/>
                                    <Form.Control.Feedback type="invalid">Mobile number is required.</Form.Control.Feedback>
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingEmail" label="Email" className="mt-3">
                                    <Form.Control required type="text" placeholder="email" value={this.state.email} type="email" onChange={this.handleEmailChange}/>
                                    <Form.Control.Feedback type="invalid">Email is required.</Form.Control.Feedback>
                                </FloatingLabel>

                                <h2 className="mt-5">add-ons</h2>

                                <Button type="submit" className="kcButton mt-3">Submit</Button>
                                <Popup show={isShown} onHide={() => this.setOnHide(false)} popupTitle={popupTitle} popupDesc={popupDesc}/>
                                </Form>
                                
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default BookVisit;