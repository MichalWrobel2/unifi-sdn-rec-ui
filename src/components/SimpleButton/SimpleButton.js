import React from 'react';
import PropTypes from 'prop-types';
import './SimpleButton.css';

class SimpleButton extends React.Component {

	render() {
		const classFromProps = this.props.background === 'yes' ? 'SimpleButton-bg' : 'SimpleButton-nobg';

		return (
			<span className = {classFromProps}
				label = {this.props.label}
				onClick = {this.props.handleClick}>
				<div className = 'SimpleButton-text'>{this.props.label}</div>
			</span>
		)
	}
}

SimpleButton.propType = {
	label: PropTypes.string.isRequired
}

export default SimpleButton;