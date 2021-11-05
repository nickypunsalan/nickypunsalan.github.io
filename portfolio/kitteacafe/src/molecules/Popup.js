import { Button, Modal } from 'react-bootstrap';
import React, { Component } from 'react';

class Popup extends Component {

    render() {

        return (
            <>  
              <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                backdrop="static"
                keyboard={false}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>{this.props.popupTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {this.props.popupDesc ? this.props.popupDesc.map(desc => <p>{desc}</p>) : "Test"}

                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.props.onHide}>Close</Button>
                  {this.props.isConfirmationPopup && (<Button className="kcButton" onClick={this.props.onConfirm}>OK</Button>)}
                </Modal.Footer>
              </Modal>
            </>
          );
    }
  }
  
export default Popup;