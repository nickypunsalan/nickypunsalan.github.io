import '../styles/kitteacafe.css';
import { Container, Row, Col } from 'react-bootstrap';
import OurVisits  from '../organisms/OurVisits';
import BookVisit from '../organisms/BookVisit';

function KitteaCafe() {
  return (
    <div className="greyBkg">

      <Container fluid className="welcomeSection d-flex align-items-center">
        <Col lg={12}>
          <span className="welcomeHeader">kittea cafe</span>
        </Col>
      </Container>

      <Container fluid>
        <Row>
          <Col lg={5}>
            <OurVisits />
          </Col>
          <Col lg={7}>
            <BookVisit/>
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default KitteaCafe;
