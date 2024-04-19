import React from 'react';
import './home.page.scss';
import { Col, Container, Row } from 'react-bootstrap';
import logo from '../../images/pacman_logo.png';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className='HomePage'>
      <Container className='d-flex justify-content-center'>
        <Row xs='12' md='8'>
          <Col>
            <Container className='d-flex flex-column gap-5'>
              <Row>
                <Col xs='12'>
                  <Container className='d-flex justify-content-center'>
                    <img src={logo} alt='PAC-MAN' />
                  </Container>
                </Col>
                <Col xs='12'>
                  <Container className='d-flex justify-content-center nes-text is-primary'>
                    <h3>Online</h3>
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
                    <button className='nes-btn is-success' onClick={() => navigate('/game-selection')}>
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
