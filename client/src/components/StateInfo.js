import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import '../style/States.css';




export default class StateInfo extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			img: ""
		}

		this.validateState = this.validateState.bind(this);
	}

	// Render the state flag image unless it is "District of Columbia"
	validateState() {
		if (this.props.state !== null && this.props.state !== "District Of Columbia") {
			var stateName = this.props.state.toLowerCase().split(' ').join('-');
			return "https://cdn.civil.services/us-states/flags/" + stateName + "-large.png";
		} else if (this.props.state !== null) {
			return "https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_the_District_of_Columbia.svg"
		}

		return "";
	}

	// The initial image source set-up
	componentDidMount() {
		var imgSrc = this.validateState();

		this.setState({
			img: imgSrc
		});
	}

	// Listen for state changes
	componentDidUpdate(prevProps) {
		if (this.props.state !== prevProps.state) {
			var imgSrc = this.validateState();

			this.setState({
				img: imgSrc
			})
		}
	}


	render() {
		return (
			<div className="stateInfo">
				<div className="jumbotron">
					<div class="container">
						<div className="h5">Case Summary of COVID-19 in {this.props.state}</div>
						<div class="row">
							<div class="col-8">
								Total Test Count:
								<div className="h6">{this.props.test_count}</div>
								<br></br>
								Total Case Count:
								<div className="h6">{this.props.case_count}</div>
								<br></br>
								Total Death Count:
								<div className="h6">{this.props.death_count}</div>
							</div>
							<div class="col-4">
								<Image src={`${this.state.img}`} thumbnail />
							</div>
						</div>
					</div>

				</div>
			</div>
		);
	}
}
