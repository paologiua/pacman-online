import React from 'react';
import './home.page.scss';
import { Col, Container, Row } from 'react-bootstrap';
import logo from '../../images/pacman_logo.png';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className='HomePage'>
      <Container className='d-flex justify-content-center'>
        <Row className='col-xs-12 col-md-8 col-lg-8'>
          <Col>
            <Container className='d-flex flex-column gap-5'>
              <Row>
                <Col className='col-12'>
                  <Container className='d-flex justify-content-center'>
                    <img src={logo} alt='PAC-MAN' />
                  </Container>
                </Col>
                <Col className='col-12'>
                  <Container className='d-flex justify-content-center nes-text is-primary'>
                    <h2>Online</h2>
                  </Container>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Container className='d-flex justify-content-center'>
                    <button className='nes-btn is-warning' onClick={() => navigate('/nickname')}>
                      <h2>New game</h2>
                    </button>
                  </Container>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Container className='d-flex justify-content-center'>
                    <button className='nes-btn is-success'>
                      <h3>Join game</h3>
                    </button>
                  </Container>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
