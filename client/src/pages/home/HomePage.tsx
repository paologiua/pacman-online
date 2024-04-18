import React from 'react';
import './HomePage.scss';// script.js
import { Col, Container, Row } from 'react-bootstrap';
import logo from '../../images/pacman_logo.png';

function HomePage() {
  return (
    <div className='HomePage'>
      <Container>
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
              <button className='nes-btn is-warning'>
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
    </div>
  );
}

export default HomePage;
