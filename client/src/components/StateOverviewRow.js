import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class StateOverviewRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="stateoverview">
				<div className="emp_combined">EMPLOYMENT</div>
				<div className="emp_combined_inchigh">HIGH_INCOME_EMP</div>
				<div className="emp_combined_incmiddle">MIDDLE_INCOME_EMP</div>
				<div className="emp_combined_inclow">LOW_INCOME_EMP</div>
			</div>
		);
	}
}
