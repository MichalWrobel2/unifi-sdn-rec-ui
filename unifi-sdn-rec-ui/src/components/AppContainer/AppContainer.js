import ControlPanel from '../ControlPanel/ControlPanel.js';
import MainPanel from '../MainPanel/MainPanel.js';
import PropTypes from 'prop-types';
import React from 'react';
import Scale from '../Scale/Scale.js';
import './AppContainer.css';

class AppContainer extends React.Component {
	constructor() {
		super();
		this.state = {
			cancel: false,
			txOptions: [4, -6 , -16],
			radioOptions: [2.4, 5],
			scaleFactor: 1,
			dropdown: 4,
			radio: 2.4,
			range: 353.4424865920735,
			saved: {
				dropdown: 4,
				radio: 2.4,
				scaleFactor: 1,
				range: 353.4424865920735
			}
		}
	}
	getRange(frequency, txPower) {

		return this.state.scaleFactor * (2 * Math.pow(10, (27.55 - (20 * Math.log10(frequency * 1000)) + (Math.abs(-80) + txPower + 1)) / 20.0));
	}
	getData(data) {
		Object.assign(data, { cancel: false });
		this.setState(data);

	}
	handleClick(action) {
		const { radio, dropdown } = this.state;
		if (action === 'cancel') {
			this.setState({ radio, dropdown, cancel: true });

			return;
		}
		if (action === 'save') {
			let newScale = 1;
			if (dropdown === -16) {
				newScale = 8;
			} else if (dropdown === 4) {
				newScale = 1;
			} else if (dropdown === -6) {
				newScale = 3;
			}
			this.setState({
				saved: {
					radio,
					dropdown,
					scaleFactor: newScale,
				},
				cancel: false,
				scaleFactor: newScale
			}, () => {
				const range = this.getRange(radio, dropdown);
				const newState = { range: range, saved: { radio, dropdown, scaleFactor: newScale, range: range } };

				this.setState(newState)

			});
		}
	}

	render() {

		return (
			<div className = 'AppContainer'>
				<Scale scale = {this.state.scaleFactor}/>
				<MainPanel
					data = {this.getData.bind(this)}
					scale = {this.state.scaleFactor}
					setup = {this.state.saved}
					range = {this.state.range}
				/>
				<ControlPanel
					data = {this.getData.bind(this)}
					saved = {this.state.saved}
					cancel = {this.state.cancel}
					dropdownOptions = {this.state.txOptions}
					handleClick = {(action) => this.handleClick(action)}
					radioOptions = {this.state.radioOptions}

				/>
			</div>
		);
	}
}

AppContainer.propType = {
	powerAndFrequency: PropTypes.object.isRequired,
	radioOptions: PropTypes.array.isRequired
};

export default AppContainer;