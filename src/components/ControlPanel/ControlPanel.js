import React from 'react';
import Dropdown from '../Dropdown/Dropdown.js';
import Radio from '../Radio/Radio.js';
import SimpleButton from '../SimpleButton/SimpleButton.js';
import './ControlPanel.css';

class ControlPanel extends React.Component {

	getData(data) {
		this.setState(data)
		this.props.data(data);
	}

	resetState() {
		this.setState({ reset:true })
	}
	render() {

		return (
			<div className = 'ControlPanel'>
				<Dropdown data = {this.getData.bind(this)}
					saved = {this.props.saved}
					cancel = {this.props.cancel}
					options = {this.props.dropdownOptions}
					title = 'TX Power'
					unit = 'dBm'/>
				<Radio data = {this.getData.bind(this)}
					saved = {this.props.saved}
					cancel = {this.props.cancel}
					options = {this.props.radioOptions}
					title = 'Radio'
					unit = 'GHz'/>
				<div className = 'Buttons'>
					<SimpleButton background = 'yes'
						label = 'SAVE'
						handleClick = {this.props.handleClick.bind(this, 'save')}/>
					<SimpleButton background = 'no'
						label = 'CANCEL'
						handleClick = {this.props.handleClick.bind(this, 'cancel')}/>
				</div>
			</div>
		)
	}
}

export default ControlPanel;