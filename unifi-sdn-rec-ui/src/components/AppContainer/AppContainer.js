import ControlPanel from '../ControlPanel/ControlPanel.js';
import MainPanel from '../MainPanel/MainPanel.js';
import PropTypes from 'prop-types';
import React from 'react';

import './AppContainer.css';

class AppContainer extends React.Component {
	constructor() {
		super();
		this.state = {
			txOptions: [4, -6 , -16],
			radioOptions: [2.4, 5],
			mapScaleLegend: 100,
			dropdown: 4,
			radio: 2.4,
			range: 352,
			saved: {
				dropdown: 4,
				radio: 2.4
			}
		}
	}
	getRange() {
		const { dropdown, radio } = this.state.saved;
		let distance = null;

		if (dropdown === 4 && radio === 2.4) {
			distance = 176;
		}
		if (dropdown === 4 && radio === 5) {
			distance = 84;
		}
		if (dropdown === -6 && radio === 2.4) {
			distance = 55;
		}
		if (dropdown === -6 && radio === 5) {
			distance = 27;
		}
		if (dropdown === -16 && radio === 2.4) {
			distance = 18;
		}
		if (dropdown === -16 && radio === 5) {
			distance = 8;
		}

		return distance * 2;
	}
	getData(data) {
		this.tempData = data;
		this.setState(data);
		this.cancel = false;
	}
	handleClick(action) {
		const { radio, dropdown } = this.state;
		if (action === 'save') {
			this.setState({ saved: { radio, dropdown } }, () => {
				this.setState({ range: this.getRange() })
			});

			return;
		}
		this.setState({ radio, dropdown });
		this.cancel = true;
	}

	render() {

		return (
			<div className = 'AppContainer'>
				<MainPanel scale = {this.state.mapScaleLegend}
					wrapperToLift = {this.state.scale}
					setup = {this.state.saved}
					range = {this.state.range}
				/>
				<ControlPanel
					data = {this.getData.bind(this)}
					saved = {this.state.saved}
					cancel = {this.cancel}
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