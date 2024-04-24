import React, { Component, useRef } from 'react';
import './game.page.scss';
import pacman_player_logo from '../../images/pacman_player_logo.png';
import blinky_player_logo from '../../images/blinky_player_logo.png';
import clyde_player_logo from '../../images/clyde_player_logo.png';
import inky_player_logo from '../../images/inky_player_logo.png';
import pinky_player_logo from '../../images/pinky_player_logo.png';
import { PhaserGame } from '../../components/phaser-game/phaser-game.component';
import { Col, Container, Row } from 'react-bootstrap';

interface GamePageState {
	nickname: string;
	lifePoints: number;
	score: number;
}

class GamePage extends Component {
	state: Readonly<GamePageState> = {
		nickname: "Batman",
		lifePoints: 3,
		score: 0,
	};

	render(): React.ReactNode {
		return (
			<div className='GamePage'>
				<Row className='justify-content-center'>
					<Col xs='12' md='8' xl='6'>
						<div className='d-flex justify-content-between'>
							<div className='d-flex gap-3 align-items-end'>
								<div className='d-flex gap-3 align-items-center'>
									{Array.from(Array(this.state.lifePoints).keys()).map(i =>
										<><img height={16} width={16} src={pacman_player_logo}></img> </>
									)} {this.state.nickname}: {this.state.score}
								</div>
							</div>
							<div>
								<div className='d-flex gap-3 justify-content-end align-items-center'>
									<img height={16} width={16} src={blinky_player_logo}></img>{"test"}
								</div>
								<div className='d-flex gap-3 justify-content-end align-items-center'>
									<img height={16} width={16} src={clyde_player_logo}></img> {"altro test"}
								</div>
								<div className='d-flex gap-3 justify-content-end align-items-center'>
									<img height={16} width={16} src={inky_player_logo}></img> {"altro altro test"}
								</div>

							</div>
						</div>
					</Col>
				</Row>
				<Row className='justify-content-center'>
					<Col xs='12' md='8' xl='6'>
						<PhaserGame />
					</Col>
				</Row>
			</div>
		);
	};
}

export default GamePage;
