import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class StateNameButton extends React.Component {


	render() {
		return (
			<div className="statename" id={this.props.id} onClick={this.props.onClick}>
			{this.props.statename}
			</div>
		);
	}
}
