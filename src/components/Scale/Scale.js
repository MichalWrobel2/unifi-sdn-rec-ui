import React from 'react';
import PropTypes from 'prop-types';
import './Scale.css';

class Scale extends React.Component {

	render() {

		const display = Math.floor(100 / this.props.scale);

		return (
			<div className = 'Scale'>{`${display} m`}</div>
		)
	}
}

Scale.propType = {
	scaleCount: PropTypes.number.isRequired
};

export default Scale;