import React from 'react';
import PageNavbar from './PageNavbar';
import OnlineBoostRow from './OnlineBoostRow';
import OnlineAchievement from './OnlineAchievement';
// import OnlineAchievementRow from './OnlineAchievementRow';
import '../style/OnlineMain.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import OnlineChart from './OnlineChart';
import OnlineChart2 from './OnlineChart2';

var class2Params =  new Map([["", ""], ["overall", "badges"], 
["low income" ,"badges_inclow" ], 
["mediem income" ,"badges_incmiddle"], 
["high income" , "badges_inchigh" ]]);

export default class OnlineMain extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedIncomeClass: "",
			incomeClasses: [],
			topStates: []
		};

		this.submitClass = this.submitClass.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		var ClassList = ["overall", "low income", "mediem income", "high income"]; 
			let displayedClasses = ClassList.map((classObj, i) =>
				<option value={classObj} key ={classObj.toString()}>
				{classObj}
				</option>
			);
	
			
			// Set the state of the genres list to the value returned by the HTTP response from the server.
			this.setState({
			incomeClasses: displayedClasses
			});
	
	}
	

	handleChange(e) {
		this.setState({
			selectedIncomeClass: e.target.value
		});
	}

	submitClass() {
		// Send an HTTP request to the server.
		console.log("->selectedIncomeClass:" + this.state.selectedIncomeClass);
		var query = class2Params.get(this.state.selectedIncomeClass);
		console.log("->query:" + query);
		fetch("http://localhost:8081/online-learning/selectedIncomeClass=" + query,
		{
			method: 'GET' // The type of HTTP request.
		}).then(res => {
			// Convert the response data to a JSON.
			return res.json();
		}, err => {
			// Print the error if there is one.
			console.log(err);
		}).then(stateList => {
			console.log(JSON.stringify(stateList));
			if (!stateList) return;
			// Map each stateObj in stateList to an HTML element:
			// A button which triggers the getOnlineTopBoostStates function.
			let topBoostStatesDivs =stateList.map((stateObj, i) =>
				<OnlineBoostRow row={stateObj} key = {i} />
			);

			
			this.setState({
				topStates: topBoostStatesDivs
			});
		}, err => {
			// Print the error if there is one.
			console.log(err);
		});
		
	}


	render() {

		return (
			<div className="OnlineMain">
				<PageNavbar active="online-learning" />
				<br></br>

			    <div className = "chart-container">
			         <OnlineChart/> 
			    </div>
			   
			   <div className = "OnlineAchievement-container">
			         <OnlineAchievement/> 
			    </div>

			    <div className = "chart-container">
			         <OnlineChart2/> 
			    </div>

				<div className="container bestgenres-container">
			      
			      <div className="jumbotron">
			        <div className="h3">Online-Learning Affected Index</div>
			        
            		<div className="h8"> Display the <strong>TOP 10</strong> states, where students achievemnt through online education was greatly affected by the lockdow. </div>
            		<br></br>
            		<div className="h6"> *Note this “affected index” per state is measured by looking up the school shut down date first, and then compute average weekly achiviment index before and after this date, finally taking the absolute value of the two.</div>
            		<br></br>

            		<div className="h8"> -- Options to evaluate on students overall, students from low/middle/high income families --  </div>
			       
			       <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedIncomeClass} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	<option select="true" value> -- select an option -- </option>
			            	{this.state.incomeClasses}
			            </select>
			            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitClass}>Submit</button>
			          </div>
			        </div>

			      </div>

			      <div className="jumbotron">
			        <div className="affectedstates-container">        	
			    		<table className="table table-striped">
						  <thead>
						    <tr>
						      <th scope="col">#</th>
						      <th scope="col">State</th>
						      <th scope="col">Affected Index</th>
						    </tr>
						  </thead>
						  <tbody>
						     {this.state.topStates}
						  </tbody>
						</table>		          
						
						 
			        </div>
			      </div>


			    </div>
				


			</div>
		);
	}
}