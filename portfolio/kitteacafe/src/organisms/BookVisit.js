import { Button, InputGroup, Col, Dropdown, DropdownButton, FloatingLabel, Form, Row } from 'react-bootstrap';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { Component } from 'react';
import MomentFnsUtils from '@date-io/moment';
import moment from 'moment';
import api from '../api/';
import Popup from '../molecules/Popup';
import { ErrorDescription, ErrorTitle, SuccessDescription, SuccessTitle } from '../constants';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import Validator from '../validators/BookVisitFormValidator';

const theme = createTheme({
    palette: {
        primary: {
            main: '#8ab073',
            contrastText: '#FFFFFF'
        },
    }
});

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
            isValidated: false,
            isMobileInvalid: false,
            isMobileValid: false,
            isEmailInvalid: false,
            isEmailValid: false,
            isShown: false,
            popupTitle: '',
            popupDesc: [],
            mobileInvalidMsg: "Mobile number is required.",
            emailInvalidMsg: "Email is required.",
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
        this.setIsValidated = this.setIsValidated.bind(this);
        this.setClearForm = this.setClearForm.bind(this);
    }

// #region functions
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

    setIsValidated() {
        this.setState({ isValidated: true });
    }

    setMobileIsValid() {
        this.setState({ isMobileInvalid: false, isMobileValid: true, mobileInvalidMsg: "" });
    }

    setEmailIsValid() {
        this.setState({ isEmailInvalid: false, isEmailValid: true, emailInvalidMsg: "" });
    }

    setClearForm() {
        this.setState({ isValidated: false });
    }

    setIsShown() {
        this.setState({ isShown: true });
    }

    setOnHide(showModal) {
        this.setState({ isShown: showModal });
    }

    handleSubmit = async (event) => {
        const { visitTypeId, numVisitors, visitDate, visitTime, firstName, lastName, mobileNo, email } = this.state;

        event.preventDefault();
        event.stopPropagation();

        this.setIsValidated();
        this.setState({ popupDesc: []});
        var dateTime = moment(visitDate + ' ' + visitTime);

        var validMobileNumber = Validator.ValidateMobileNumber(mobileNo);
        var validEmail = Validator.ValidateEmail(email);
        var errors = [];

        if (visitTypeId && numVisitors && visitDate && visitTime && firstName && lastName && mobileNo && email) {

            if (!validMobileNumber || !validEmail) {
                if (!validMobileNumber) {
                    console.log("invalidMobileNumber:", validMobileNumber);
                    this.setIsValidated();
                    errors.push("Inputted mobile number must be a valid Australian mobile number.");
                    this.setState({
                        mobileInvalidMsg: "Inputted mobile number is invalid.",
                        isMobileInvalid: true,
                        isMobileValid: false,
                        isValidated: false,
                    });
                }
                else {
                    this.setMobileIsValid();
                }
                if (!validEmail) {
                    console.log("invalidEmail:", validEmail);
                    this.setIsValidated();
    
                    errors.push("Inputted email is invalid.");
    
                    this.setState({
                        emailInvalidMsg: "Inputted email is invalid.",
                        isEmailInvalid: true,
                        isEmailValid: false,
                        isValidated: false,
                    });
                }
                else {
                    this.setEmailIsValid();
                }

                this.setState({ popupTitle: ErrorTitle.ERR_BOOK_TITLE, popupDesc: errors });
                console.log("popupDescArr: ", this.state.popupDesc);
                this.setIsShown();
            }
            else {

                const payload = {
                    VisitTypeId: visitTypeId,
                    NumberOfVisitors: numVisitors,
                    FirstName: firstName,
                    LastName: lastName,
                    ContactNumber: validMobileNumber,
                    Email: email,
                    IsDeleted: false,
                    VisitDateTime: dateTime,
                    IsEditable: true,
                    Status: "Booked"
                }
                console.log('Create Payload in BookVisit -> render -> payload', payload);

                await api.createVisit(payload)
                    .then(res => {
                        errors.push(SuccessDescription.SUCC_BOOK_DESC);
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
                            isMobileInvalid: false,
                            isMobileValid: false,
                            isEmailInvalid: false,
                            isEmailValid: false,
                            popupTitle: SuccessTitle.SUCC_BOOK_TITLE,
                            popupDesc: errors
                        }, this.setIsShown(), this.setClearForm());
                    })
                    .catch(err => {
                        if (err.response.status === 400) {
                            errors.push(ErrorDescription.ERR_BOOK_DESC)
                            this.setState({
                                popupDesc: errors,
                                popupTitle: ErrorTitle.ERR_BOOK_TITLE
                            }, this.setIsShown());

                        }
                    })
            }
        }
        else {
            errors.push("The form has not been completed.")
            this.setState({ 
                popupTitle: "Missing form values",
                popupDesc: errors
            });
            this.setIsShown();
        }
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

    //#endregion

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
                    <p>isValidated (form): {this.state?.isValidated ? this.state.isValidated.toString() : "false"}</p>
                    <p>IsShown (modal): {this.state?.isShown ? this.state.isShown.toString() : "false"}</p>
                    <p>popupTitle (modal): {this.state?.popupTitle ? this.state.popupTitle : "No value"}</p>
                    <p>popupDesc (modal): {this.state?.popupDesc ? "Has value" : "No value"}</p>
                    <p>IsMobileInvalid (modal): {this.state?.isMobileInvalid ? this.state.isMobileInvalid.toString() : this.state.isMobileInvalid.toString()}</p>
                    <p>IsMobileValid (modal): {this.state?.isMobileValid ? this.state.isMobileValid.toString() : this.state.isMobileInvalid.toString()}</p>
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
                                <Form id="MyForm" noValidate validated={this.state.isValidated} onSubmit={this.handleSubmit}>
                                    {/* <Form id="MyForm" noValidate onSubmit={this.handleSubmit}> */}
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
                                            <ThemeProvider theme={theme}>
                                            <DatePicker
                                                variant="inline"
                                                label="Visit Date"
                                                format="DD / MM / yyyy"
                                                value={this.state.visitDate}
                                                onChange={this.handleVisitDateSelect}
                                                disablePast
                                                autoOk
                                            />
                                            </ThemeProvider>
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
                                        <Form.Control required type="text" placeholder="firstName" value={this.state.firstName} onChange={this.handleFirstNameChange} />
                                        <Form.Control.Feedback type="invalid">First name is required.</Form.Control.Feedback>
                                    </FloatingLabel>
                                    <FloatingLabel controlId="floatingLastName" label="Last Name" className="mt-3">
                                        <Form.Control required maxLength="13" type="text" placeholder="lastName" value={this.state.lastName} onChange={this.handleLastNameChange} />
                                        <Form.Control.Feedback type="invalid">Last name is required.</Form.Control.Feedback>
                                    </FloatingLabel>

                                    <FloatingLabel controlId="floatingMobileNo" label="Mobile no." className="mt-3">
                                        <Form.Control required type="text" placeholder="mobileNo" isValid={this.state.isMobileValid} isInvalid={this.state.isMobileInvalid} value={this.state.mobileNo} onChange={this.handleMobileNoChange} />
                                        <Form.Control.Feedback type="invalid">{this.state.mobileInvalidMsg}</Form.Control.Feedback>
                                    </FloatingLabel>
                                    <FloatingLabel controlId="floatingEmail" label="Email" className="mt-3">
                                        <Form.Control required type="email" placeholder="email" isValid={this.state.isEmailValid} isInvalid={this.state.isEmailInvalid} value={this.state.email} onChange={this.handleEmailChange} />
                                        <Form.Control.Feedback type="invalid">{this.state.emailInvalidMsg}</Form.Control.Feedback>
                                    </FloatingLabel>

                                    <h2 className="mt-5">add-ons</h2>

                                    <Button type="submit" className="kcButton mt-3">Submit</Button>
                                    <Popup show={isShown} onHide={() => this.setOnHide(false)} popupTitle={popupTitle} popupDesc={popupDesc} />
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