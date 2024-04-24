import React, { Component } from 'react';
import './nickname.page.scss';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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

			return;
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
						<Link to="/players-list">
							<button className='nes-btn is-success' onClick={_ => this.onSubmit()}>Ok</button>
						</Link>
					</Col>
					<Col xs='12' hidden={!this.state.errorMessage}>
						<span className='d-flex justify-content-center nes-text is-error'>
							{this.state.errorMessage}
						</span>
					</Col>
				</Row>
			</div>
		);
	}
}

export default NicknamePage;
