import React from 'react';
import OnlineAchievementRow from './OnlineAchievementRow';
import '../style/OnlineAchievement.css';
import 'bootstrap/dist/css/bootstrap.min.css';



export default class OnlineAchievement extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			selectedWeek: 0,
			topStates: []
		}

		this.handleWeekNumberChange = this.handleWeekNumberChange.bind(this);
		this.submitWeek = this.submitWeek.bind(this);
	}

	handleWeekNumberChange(e) {
		this.setState({
			selectedWeek: e.target.value
		});
	}

	/* ---- Q2 (OnlineAchievement) ---- */
	// Hint: Name of movie submitted is contained in `this.state.selectedWeek`.
	submitWeek() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/online-learning/selectedWeek=" + this.state.selectedWeek,
		{
			method: 'GET' // The type of HTTP request.
		}).then(res => {
			// Convert the response data to a JSON.
			return res.json();
		}, err => {
			// Print the error if there is one.
			console.log(err);
		}).then(stateList => {
			if (!stateList) return;
			console.log(stateList);
			// Map each genreObj in genreList to an HTML element:
			// A button which triggers the showMovies function for each genre.
			let topAchievStates = stateList.map((stateObj, i) =>
			<OnlineAchievementRow row={stateObj} key={i}/>
			);
	
			
			// Set the state of the genres list to the value returned by the HTTP response from the server.
			this.setState({
				topStates: topAchievStates
			});
		}, err => {
			// Print the error if there is one.
			console.log(err);
		});
		
	}

	
	render() {

		return (
			<div className="onlineAchievement container">

			    	<div className="jumbotron">
			    		<div className="h3">Online-Learning Achievement Index</div>
			    		<div className="h8">Display <strong>TOP 5</strong> states where students are leading in the online education achievemnt during the week you selected.</div>
			    		<div className="h8">-- Slide the bar to evaluate week _<strong><ins> {this.state.selectedWeek}</ins></strong>_ since the school shutdown date due to COVID-19 --</div>
			    		<br></br>
			    		<div className="input-container">

			    			<input type="range" min={-5} max={5} value={this.state.selectedWeek} className="slider" onChange={this.handleWeekNumberChange} id="selectedWeek" />
			    			
			    			<button id="submitWeekBtn" className="submit-btn" onClick={this.submitWeek}>Go</button>
			    			
       						 
			    		</div>

			    		<div className="header-container">
			    			<br></br>
			    			
			    			<table className="table table-striped">
							  <thead>
							    <tr>
							      <th scope="col">#</th>
							      <th scope="col">State</th>
							      <th scope="col">Achievement Index</th>
							      <th scope="col">Week Evaluated (last day of the week)</th>
							    </tr>
							  </thead>
							  <tbody>
							     {this.state.topStates}
							  </tbody>
							</table>

			    		</div>


			    	</div>
			    

		    </div>
		);
	}
}