import React, { Component } from 'react';
import './game-selection.page.scss';
import { Col, Container, Row } from 'react-bootstrap';

interface GameSelectionPageState {
  errorMessage?: string;
}

class GameSelectionPage extends Component {
  state: Readonly<GameSelectionPageState> = {
    errorMessage: undefined,
  };

  render(): React.ReactNode {
    return (
      <div className='GameSelectionPage'>
        <Container>
          <Row className='d-flex justify-content-center gap-3 nes-field is-inline'>
            <Col xs='12' md='auto'>
              <Row>
                <Col xs='12' md='auto' className='d-flex align-self-center'>
                  <label htmlFor='input'>n. Game</label>
                </Col>
                <Col xs='12' md='auto'>
                  <input
                    type='text'
                    id='input'
                    className={`nes-input is-dark ${this.state.errorMessage ? 'is-error' : ''}`}
                    autoComplete='off'
                    placeholder='#56729'
                  />
                </Col>
              </Row>
            </Col>
            <Col xs='12' md='auto'>
              <button className='nes-btn is-success'>Ok</button>
            </Col>
            <Col xs='12' hidden={!this.state.errorMessage}>
              <span className='d-flex justify-content-center nes-text is-error'>
                {this.state.errorMessage}
              </span>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default GameSelectionPage;
