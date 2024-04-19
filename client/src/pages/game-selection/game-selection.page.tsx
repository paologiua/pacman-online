import React from 'react';
import './game-selection.page.scss';
import { Col, Container, Row } from 'react-bootstrap';

function GameSelectionPage() {
  let isError: boolean = false;

  return (
    <div className='GameSelectionPage'>
      <Container>
        <Row className="d-flex justify-content-center gap-md-0 gap-3 nes-field is-inline">
          <Col xs='12' md='auto'>
            <Row>
              <Col xs='12' md='auto' className='d-flex align-self-center'>
                <label htmlFor="input">n. Game</label>
              </Col>
              <Col xs='12' md='auto'>
                <input type="text" id="input" className={`nes-input is-dark ${isError ? "is-error" : ""}`} autoComplete="off" placeholder="#56729" />
              </Col>
            </Row>
          </Col>
          <Col xs='12' md='auto'>
            <button id="nickname_button" className="nes-btn is-success">Ok</button>
          </Col>
          <Col xs='12' hidden={!isError}>
              <span id="nickname_error" className="nes-text is-error"></span>
            </Col>
        </Row>
      </Container>
    </div>
  );
}

export default GameSelectionPage;
