import React from 'react';
import PropTypes from 'prop-types';
import './Scale.css';

class Scale extends React.Component {

	render() {
		const scaleCount = this.props.scale;

		return (
			<div className = 'Scale' style = {{ width: scaleCount }}>{`${scaleCount} m`}</div>
		)
	}
}

Scale.propType = {
	scaleCount: PropTypes.number.isRequired
};

export default Scale;