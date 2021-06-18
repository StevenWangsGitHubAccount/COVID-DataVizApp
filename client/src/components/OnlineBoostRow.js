import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class OnlineBoostRow extends React.Component {
	// constructor(props) {
	// 	super(props);
	// }

	render() {
		console.log(JSON.stringify(this.props));
		return (
			// <div className="stateBoostResults">
			// 	<div className="state">{this.props.row.statename}</div>
			// 	<div className="boostIndex">{this.props.row.influence}</div>
			// </div>
			<tr>
		      <th scope = "row">{this.props.row.index}</th>
		      <td>{this.props.row.statename}</td>
		      <td>{this.props.row.influence.toString().substring(0, 6)}</td>
		    </tr>

		);
	}
}
