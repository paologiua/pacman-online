import React, { Component } from 'react';
import './game.page.scss';
import pacman_player_logo from '../../images/pacman_player_logo.png';
import blinky_player_logo from '../../images/blinky_player_logo.png';
import clyde_player_logo from '../../images/clyde_player_logo.png';
import inky_player_logo from '../../images/inky_player_logo.png';
import { PhaserGame } from '../../components/phaser-game/phaser-game.component';
import { Col, Row } from 'react-bootstrap';

interface GamePageState {
	pacman_nickname: string;
	blinky_nickname: string;
	clyde_nickname: string;
	inky_nickname: string;
	lifePoints: number;
	score: number;
}

class GamePage extends Component {
	state: Readonly<GamePageState> = {
		pacman_nickname: "12345678",
		blinky_nickname: "Marco",
		clyde_nickname: "Bob",
		inky_nickname: "12345678",
		lifePoints: 3,
		score: 0,
	};

	render(): React.ReactNode {
		return (
			<div className='GamePage'>
				<Row className='gap-3 justify-content-center align-items-end'>
					<Col></Col>
					<Col xs='12' md='6' xl='4' xxl='3'>
						<div className='d-flex gap-3 align-items-center'>
							<img 
								style={{opacity: this.state.lifePoints < 1 ? 0 : 1}}
								height={16} 
								width={16} 
								src={pacman_player_logo} 
								alt='*'
							></img>
							<img 
								style={{opacity: this.state.lifePoints < 2 ? 0 : 1}}
								height={16} 
								width={16} 
								src={pacman_player_logo} 
								alt='*'
							></img>
							<img 
								style={{opacity: this.state.lifePoints < 3 ? 0 : 1}}
								height={16} 
								width={16} 
								src={pacman_player_logo} 
								alt='*'
							></img>
							{this.state.pacman_nickname}: {this.state.score}
						</div>
					</Col>
					<Col xs='12' md='4' xl='4' xxl='3'>
						<div className='d-flex gap-3 justify-content-end align-items-center'>
							<img height={16} width={16} src={blinky_player_logo} alt='-'></img>
							{this.state.blinky_nickname}
						</div>
						<div className='d-flex gap-3 justify-content-end align-items-center'>
							<img height={16} width={16} src={clyde_player_logo} alt='-'></img>
							{this.state.clyde_nickname}
						</div>
						<div className='d-flex gap-3 justify-content-end align-items-center'>
							<img height={16} width={16} src={inky_player_logo} alt='-'></img>
							{this.state.inky_nickname}
						</div>
					</Col>
					<Col></Col>
					<Col xs='12' md='10' xl='8' xxl='6' className='p-md-0'>
						<PhaserGame />
					</Col>
				</Row>
			</div>
		);
	};
}

export default GamePage;
