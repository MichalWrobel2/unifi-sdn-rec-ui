import React from 'react';
import PropTypes from 'prop-types';
import './Radio.css';

class Radio extends React.Component {
	constructor() {
		super();

		this.state = {
			value: 2.4
		}
	}
	handleChange(val) {
		const newValue = val.hasOwnProperty('target') ? Number(val.target.value) : val;

		this.setState({ value: newValue });
		this.props.data({ radio: newValue });
	}
	componentDidUpdate(nextProps) {

		if (nextProps.saved.radio !== this.state.value && nextProps.cancel) {

			this.handleChange(nextProps.saved.radio);
		}
	}
	render() {
		const positionsToRender = this.props.options.map((position, index) => {

			return <label key = {index} className = 'container' >
				{`${position} ${this.props.unit}`}
				<input onChange = {this.handleChange.bind(this)}
					type = 'radio'
					checked = {position === this.state.value}
					value = {position}/>
				<span className = 'checkmark'></span>
			</label>
		});

		return (
			<div className = 'Radio'>
				<div className = 'Sidebar-titles'>{this.props.title}</div>
				<div>{positionsToRender}</div>
			</div>
		)
	}
}

Radio.propTypes = {
	options: PropTypes.array.isRequired
};

export default Radio;