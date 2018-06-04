import React from 'react';
import PropTypes from 'prop-types';
import './Dropdown.css';

class Dropdown extends React.Component {
	constructor() {
		super();
		this.state = {
			value: 4,
			optionsVisible: false
		}
	}
	componentWillReceiveProps(nextProps) {

		if (nextProps.saved.dropdown !== this.state.value && nextProps.cancel) {
			this.changeValue(nextProps.saved.dropdown);
		}
	}
	chooseTxPowerLabel(valueToChooseLabel) {

		// Since there is no standard for how much dBM txPower is high, medium or low I'm providing values from task description.
		let label = Math.trunc(valueToChooseLabel);
		switch(label) {
		case -16: {
			label = 'Low';
			break;
		}
		case -6: {
			label = 'Medium';
			break;
		}
		case 4: {
			label = 'High';
			break;
		}
		default: label = 'Unknown';
		}

		return label;
	}

	changeValue(value) {
		this.setState({ value: value });
		this.props.data({ dropdown: value });
	}

	handleClick() {
		this.setState({ optionsVisible: !this.state.optionsVisible });
	}
	render() {
		const optionsToRender = this.props.options.map((selectOption, index) => {
			const label = this.chooseTxPowerLabel(selectOption);

			return <div key = {index} className = 'Dropdown-option' onClick = {this.changeValue.bind(this, selectOption)}><span value = {selectOption}>{`${label} (${selectOption} ${this.props.unit})`}</span></div>
		});

		return (
			<div className = 'Dropdown'
				current = {this.props.currentDropdown}
				options = {this.props.options}
				title = {this.props.title}
				unit = {this.props.unit}>
				<div className = 'Sidebar-titles'>{this.props.title}</div>
				<div className = 'Dropdown-select' onClick={this.handleClick.bind(this)}>
					<div className = 'Dropdown-static'>{`${this.chooseTxPowerLabel(this.state.value)} (${this.state.value} ${this.props.unit})`}
						<div className = 'Dropdown-arrow'></div>
					</div>
					{	this.state.optionsVisible &&
						<div className = 'Dropdown-options-container'>{optionsToRender}</div>
					}
				</div>
			</div>
		)
	}
}

Dropdown.propTypes = {
	options: PropTypes.array.isRequired,
	title: PropTypes.string,
	unit: PropTypes.string
};

export default Dropdown;