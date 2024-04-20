import React, { Component, FormEvent, useState } from 'react';
import './nickname.page.scss';
import { Col, Container, Row } from 'react-bootstrap';

interface NicknamePageState {
  nickname: string,
  validity: ValidityState,
  errorMessage?: string;
}

class NicknamePage extends Component {
  state: Readonly<NicknamePageState> = {
    nickname: '',
    validity: {} as ValidityState,
    errorMessage: undefined,
  };

  onSubmit(): void {
    if (this.state.validity.tooShort) {
      this.setState({
        errorMessage: 'Testo troppo corto',
      });
    }
  }

  onInputChange({ target }: { target: HTMLInputElement }): void {
    this.setState({
      nickname: target.value,
      validity: target.validity,
      errorMessage: undefined,
    });
  }

  render(): React.ReactNode {
    return (
      <div className='NicknamePage'>
        <Container>
          <Row className='d-flex justify-content-center gap-3 nes-field is-inline'>
            <Col xs='12' md='auto'>
              <Row>
                <Col xs='12' md='auto' className='d-flex align-self-center'>
                  <label htmlFor='input'>Nickname</label>
                </Col>
                <Col xs='12' md='auto'>
                  <input
                    type='text'
                    id='input'
                    className={`nes-input is-dark ${this.state.errorMessage ? 'is-error' : ''}`}
                    autoComplete='off'
                    placeholder='ex. BATMAN'
                    minLength={3}
                    maxLength={15}
                    onChange={e => this.onInputChange(e)}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs='12' md='auto'>
              <button className='nes-btn is-success' onClick={_ => this.onSubmit()}>Ok</button>
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

export default NicknamePage;
