import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
	state = {
		manager: '',
		players: [],
    balance: '',
    value: '',
    message: '',
    lastWinner: ''
	};

	async componentDidMount() {
		const manager = await lottery.methods.manager().call();
		const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

		this.setState({ manager, players, balance });
	}

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'Winner is: ' });
    const lastWinner = await lottery.methods.lastWinner().call();
    this.setState({ lastWinner: lastWinner })
  };

	render() {
		return (
			<div className="container card">
				<h1 className="head-center">Lottery Contract</h1>

        <br/>

        <p className="head-center">This contract is managed by {this.state.manager}</p>
        <p className="head-center">
          There are currently {this.state.players.length} people entered, 
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr/>

        <form onSubmit={this.onSubmit} className="head-center">
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input className="enter-form"
              type="number"
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button className="btn btn-success col-md-2">Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a Winner?</h4>
        <button className="btn btn-success col-md-3" onClick={this.onClick}>Pick a Winner!</button>

        <hr />

        <h2>{this.state.message}{this.state.lastWinner}</h2>
			</div>
		);
	}
}

export default App;
