import React, { Component } from 'react';
import './players-list.page.scss';
import { Col, Container, Row } from 'react-bootstrap';

interface PlayersListPageState {
  gameNumber?: number;
  players: string[];
}

class PlayersListPage extends Component {
  state: Readonly<PlayersListPageState> = {
    gameNumber: undefined,
    players: [],
  };

  render(): React.ReactNode {
    return (
      <div className='PlayersListPage'>
        <Container>
          <Row className='justify-content-center gap-4'>
            <Col xs='12' md='8'>
              <section className='nes-container is-dark member-card'>
                Game number: #{this.state.gameNumber}
                <div className='nes-table-responsive'>
                  <table className='nes-table is-bordered is-centered'>
                    <thead>
                      <tr>
                        <th># player</th>
                        <th>nickname</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>{this.state.players[0]}</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>{this.state.players[1]}</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>{this.state.players[2]}</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>{this.state.players[3]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </Col>
            <Col xs='12'>
              <Container className='d-flex justify-content-center'>
                <button type='button' className='nes-btn is-success active'>
                  <h1>►</h1>
                </button>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default PlayersListPage;
