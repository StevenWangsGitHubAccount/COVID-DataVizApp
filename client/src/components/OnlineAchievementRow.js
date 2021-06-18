import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class OnlineAchievementRow extends React.Component {
	// constructor(props) {
	// 	super(props);
	// }
	
	render() {

		return (
			<tr>
		      <th scope = "row">{this.props.row.index}</th>
		      <td>{this.props.row.statename}</td>
		      <td>{this.props.row.badges}</td>
		      <td>{this.props.row.date.substring(0,10)}</td>
		    </tr>
		);
	}
}


