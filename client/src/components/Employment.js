import React from 'react';
import PageNavbar from './PageNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmpChart from './EmpChart';
import JobsChart from './JobsChart';
import '../style/Employment.css';
import StateNameButton from './StateNameButton';

export default class Employment extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      stateNames: [],
      stateOverviews: []
    }

    this.showOverview = this.showOverview.bind(this);

  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/Employment",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(stateNameList => {
      if (!stateNameList) return;
      // Map each stateNameObj in stateNameList to an HTML element:
      // A button which triggers the showOverview function for each state.
      let stateNameDivs = stateNameList.map((stateNameObj, i) =>
      <StateNameButton id={"button-" + stateNameObj.statename} onClick={() => this.showOverview(stateNameObj.statename)} statename={stateNameObj.statename} />
      );

      

      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        stateNames: stateNameDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }


  
  /* Set this.state.stateOverviews to a list of <StateOverviewRow />'s. */
  showOverview(statename) {
  	// Send an HTTP request to the server.
    fetch("http://localhost:8081/Employment/Overview/" + statename,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(overviewList => {
      //if (!overviewList) return;
      // Map each overviewObj in overviewList to an HTML element:
      // Map each attribute of an overviewOjj to an HTML element
      let overviewDivs = overviewList.map((StateOverviewRow, i) =>
      <div key={i} className="stateoverview">
        <div className="emp_combined">{StateOverviewRow.emp_combined}</div>
        <div className="emp_combined_inchigh">{StateOverviewRow.emp_combined_inchigh}</div>
        <div className="emp_combined_incmiddle">{StateOverviewRow.emp_combined_incmiddle}</div>
        <div className="emp_combined_inclow">{StateOverviewRow.emp_combined_inclow}</div>
      </div>);

      

      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        stateOverviews: overviewDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }

  render() {    
    return (
      <div className="Employment">

        <PageNavbar active="Employment" />

        <br></br>
        <div className="container overview-container">
          <div className="jumbotron">
          
          <br></br>
	  <div className="h5"> <strong>Select a state</strong></div>
	  <br></br>
	  	<div className="statenames-container">
	  	{this.state.stateNames}
	  	</div>
          </div>

          <br></br>
          <div className="jumbotron">
          <div className="h5"><strong>Most Recent Employment Rates</strong></div>
          <div className="h5">measured relative to January 2020</div>
             <div className="header-container">
             <div className="headers">
                <div className="header"><strong>All workers</strong></div>
                <div className="header">High-income workers</div>
                <div className="header">Middle-income workers</div>
                <div className="header">Low-income workers</div>
              </div>
              
              
             </div>

             <div className="results-container" id="results">
                {this.state.stateOverviews}
             </div>
           </div>
	
        
       
      <div className = "chart-container">
      
      		<EmpChart/> 
      </div>
      
     
      <div className = "chart-container">
      
      		<JobsChart/> 
      </div>
       
      </div>
      </div>

    
      
      
    );
  }
}
