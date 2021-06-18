import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import PageNavbar from './PageNavbar';
import StateInfo from './StateInfo';
import StateDemoInfo from './StateDemoInfo';
import StatePercentInfo from './StatePercentInfo';


export default class States extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      month: 0,
      day: 0,
      state: "",
      days: [],
      states: [],
      selectedStateInfo: null,
      selectedDemoInfo: null,
      selectedPercentInfo: null
    }

    // Handling input change
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    
    this.submitStateInfo = this.submitStateInfo.bind(this);
    this.getStateInfo = this.getStateInfo.bind(this);
    this.getDemoInfo = this.getDemoInfo.bind(this);
    this.getPercentInfo = this.getPercentInfo.bind(this);
  }

  componentDidMount(){
    fetch("http://localhost:8081/states",
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

      let stateInfo = stateList.map((stateObj, i) =>
        <option value={stateObj.statename}>{stateObj.statename}</option>
      );

      this.setState({
        states: stateInfo
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });

  }

  // Change handlers
  handleMonthChange(e) {
    let lastDay = 0;
    let month = parseInt(e.target.value);
    if (this.handleMonthChange === 0) return;
    if ([1, 3, 5, 7, 8, 10].includes(month)) {
      lastDay = 31;
    } else if (month === 2) {
      lastDay = 29;
    } else if (month === 11) {
      lastDay = 5;
    } else {
      lastDay = 30;
    }

    let days = [];

    for (let i = 1; i <= lastDay; i++) {
      days.push(<option value={i}>{i}</option>);
    }

    this.setState({
      month: month,
      days: days
    });

  }

  // This function handles the day change
  handleDayChange(e) {
    this.setState({
      day: e.target.value
    });
  }

  // This function handles the state change
  handleStateChange(e) {
    this.setState({
      state: e.target.value
    });
  }

  getStateInfo() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/state/state=" + this.state.state + "&m=" + this.state.month + "&d=" + this.state.day,
      {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        // Convert the response data to a JSON.
        return res.json();
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(caseList => {
        if (!caseList) return;
        console.log(caseList);

        let caseInfo = caseList.map((caseObj, i) =>
          <StateInfo state={caseObj.statename} test_count={caseObj.test_count}
            case_count={caseObj.case_count} death_count={caseObj.death_count} />
        );

        this.setState({
          selectedStateInfo: caseInfo
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
  }

  getDemoInfo() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/state/demoinfo/state=" + this.state.state + "&m=" + this.state.month + "&d=" + this.state.day,
      {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        // Convert the response data to a JSON.
        return res.json();
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(caseList => {
        if (!caseList) return;
        console.log(caseList);

        let demoInfo = caseList.map((caseObj, i) =>
          <StateDemoInfo state={caseObj.statename} white={caseObj.White} black={caseObj.Black}
            latinx={caseObj.LatinX} asian={caseObj.Asian} aian={caseObj.AIAN} nhpi={caseObj.NHPI}
            multiracial={caseObj.Multiracial} other={caseObj.Other} unknown={caseObj.Unknown} />
        );

        this.setState({
          selectedDemoInfo: demoInfo
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });

  }

  getPercentInfo(){
     // Send an HTTP request to the server.
     fetch("http://localhost:8081/state/percent/state=" + this.state.state + "&m=" + this.state.month + "&d=" + this.state.day,
     {
       method: 'GET' // The type of HTTP request.
     }).then(res => {
       // Convert the response data to a JSON.
       return res.json();
     }, err => {
       // Print the error if there is one.
       console.log(err);
     }).then(caseList => {
       if (!caseList) return;
       console.log(caseList);

       let percentInfo = caseList.map((caseObj, i) =>
         <StatePercentInfo state={caseObj.statename} percent={caseObj.case_percent} nationalPercent = {1 - caseObj.case_percent} />
       );

       this.setState({
          selectedPercentInfo: percentInfo
       });
     }, err => {
       // Print the error if there is one.
       console.log(err);
     });

  }

  submitStateInfo() {
    this.getPercentInfo();
    this.getStateInfo();
    this.getDemoInfo();
  }

  render() {
    return (
      <div className="States">

        <PageNavbar active="states" />

        <br></br>
        <div className="container states-container">
          <div className="jumbotron">
            <div className="h5">Covid Cases by State</div>
            <br></br>
            <div className="h8"> The COVID-19 pandemic affects individual states differently.
            Please select the date and state to get a detailed report on the state you are interested in.</div>
            <div className="h9"> Case data availability: 1/21 - 11/5 </div>
            <div className="h9">Demographic data availability: 4/12 - 9/27 </div>
            <br></br>
            <div className="input-container">
              <text> Enter State: </text>
              <select value={this.state.state} onChange={this.handleStateChange} className="dropdown" id="stateDropdown">
                    <option select value> -- Select a State -- </option>
                    {this.state.states}
                </select>
              <br></br>
              <br></br>

              <text> Enter Date: </text>
                &nbsp;
			          <select value={this.state.month} onChange={this.handleMonthChange} className="dropdown" id="monthDropdown">
                    <option select value> -- Select a Month -- </option>
                    <option value='1'> January </option>
                    <option value='2'> February </option>
                    <option value='3'> March </option>
                    <option value='4'> April </option>
                    <option value='5'> May </option>
                    <option value='6'> June </option>
                    <option value='7'> July </option>
                    <option value='8'> August </option>
                    <option value='9'> September </option>
                    <option value='10'> October </option>
                    <option value='11'> November </option>
                </select>
                &nbsp;
                &nbsp;
                <select value={this.state.day} onChange={this.handleDayChange} className="dropdown" id="dayDropdown">
                <option select value> -- Select a Day -- </option>
                {this.state.days}
              </select>
              <br></br>
              <br></br>

              <Button variant="outline-dark" onClick={this.submitStateInfo}>SUBMIT</Button>{' '}
            </div>
          </div>
          {this.state.selectedPercentInfo}
          {this.state.selectedStateInfo}
          {this.state.selectedDemoInfo}
          <br></br>
        </div>
      </div>
    );
  }
}