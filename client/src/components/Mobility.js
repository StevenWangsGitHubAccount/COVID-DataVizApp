import React from 'react';
import PageNavbar from './PageNavbar';
import { Button, Row } from 'reactstrap';
import Chart from 'chart.js';
import '../style/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const mystyle = (side) => ({
	color: "white",
	backgroundColor: "DodgerBlue",
	width: side,
	height: side,
	borderRadius: "50%",
	textAlign: "center",
	margin: "10px",
	justifyContent: 'center',
});

const blue = "#55bae7";
const green = "#bae755";

export default class Mobility extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			bubbles: [], 	// worst then best	
			atHomeState: [],
			stateName: "",
			// preorder: [],
			// postorder: [],
			// days3: [],
			stateList: undefined,
			bubbleState: undefined,
			flag: false,
		}

		this.chartRef2 = React.createRef();
		this.chartRef3 = React.createRef();
		this.handleStateChange = this.handleStateChange.bind(this);
		this.handleStateChange2 = this.handleStateChange2.bind(this);
		this.submitStateInfo = this.submitStateInfo.bind(this);
		this.submitStateInfo2 = this.submitStateInfo2.bind(this);
	}


	handleStateChange(e) {
		this.setState({
			stateName: e.target.value
		});
	}

	submitStateInfo() {
		if (this.state.stateName === "") {
			alert("Please choose the state first!");
			return;
		}
		fetch("http://localhost:8081/atHome/:" + this.state.stateName,
			{
				method: 'GET' // The type of HTTP request.
			}).then(res => {
				// Convert the response data to a JSON.
				return res.json();
			}, err => {
				// Print the error if there is one.
				console.log(err);
			}).then(dailyOutside => {
				if (Object.keys(dailyOutside).length === 0) return;
				var pre = [];
				var post = [];
				var days3 = [];

				if (dailyOutside[0].start === "0000-00-00") {
					dailyOutside.forEach((el) => {
						days3.push(el.date.slice(0, 10));
						pre.push(el.outside);
						post.push(null);
					})
				}
				else {
					dailyOutside.forEach((el) => {
						if (el.date >= el.start) {
							days3.push(el.date.slice(0, 10));
							pre.push(null);
							post.push(el.outside);
						}
						else {
							days3.push(el.date.slice(0, 10));
							pre.push(el.outside);
							post.push(null);
						}
					})
				}

				// this.setState({
				// 	days3: days3,
				// 	preorder: pre,
				// 	postorder: post,
				// });
				if (this.myChart3 !== undefined) this.myChart3.destroy();
				// this.chartRef3.current.destroy();

				this.myChart3 = new Chart(this.chartRef3.current, {
					type: 'line',
					data: {
						labels: days3,
						datasets: [{
							label: 'Before Lockdown Order',
							yAxisID: 'New Cases',
							data: pre,
							fill: false,
							borderColor: blue, //blue
							pointBackgroundColor: blue, // blue
							pointBorderColor: blue,
							pointHoverBackgroundColor: "#e755ba",
							pointHoverBorderColor: "#e755ba",
						}, {
							label: 'After Lockdown Order',
							// yAxisID: 'Outside',
							data: post,
							fill: false,
							borderColor: green, //green
							pointBackgroundColor: green,
							pointBorderColor: green,
							pointHoverBackgroundColor: "#e755ba",
							pointHoverBorderColor: "#e755ba",
						}]
					},
					options: {
						elements: {
							point: {
								radius: 1
							}
						},
						scales: {
							xAxes: [{
								ticks: {
									display: true, //th
									autoSkip: true,
									maxTicksLimit: 20
								},
								gridLines: {
									display: false
								}
							}],
							yAxes: [{
								id: 'New Cases',
								type: 'linear',
								position: 'left',
								gridLines: {
									display: false
								},
							}, {
								id: 'Outside',
								type: 'linear',
								position: 'right',
								/* ticks: {
								  max: 1,
								  min: 0
								} */
							}]
						}
					}
				});

			}, err => {
				// Print the error if there is one.
				console.log(err);
			});
	}

	handleStateChange2(e) {
		this.setState({
			bubbleState: e.target.value
		});
		this.setState({ flag: false })
	}

	submitStateInfo2() {
		if (this.state.bubbleState === undefined) {
			alert("Please select the state first!");
			return;
		}
		this.setState({ flag: true })
		this.state.bubbles.forEach((ele) => {
			if (ele.abbr === this.state.bubbleState) {
				this.setState({ bubbleState: ele });
				return;
			}
		})
	}



	componentDidMount() {
		fetch("http://localhost:8081/getAllStates",
			{
				method: 'GET'
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(stateList => {
				// console.log(stateList)
				let decadeDivs = stateList.map((decadeObj, i) =>
					<option value={decadeObj.abbr} key={i}>
						{decadeObj.abbr}
					</option>
				);

				// console.log(toList);
				// Set the state of the genres list to the value returned by the HTTP response from the server.
				this.setState({
					stateList: decadeDivs
				});
				// console.log(this.state.stateList);
			}, err => {
				console.log(err);
			});


		fetch("http://localhost:8081/getBubbles",
			{
				method: 'GET'
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(dataList => {
				if (!dataList) return;
				// let bubbles = dataList.map((bubble, i) => <Col><h3 style={mystyle(`${100 * (1 + Math.floor(100 * bubble.outsideTime) / 100)}px`)} >{bubble.abbr}<br />{Math.floor(100 * bubble.outsideTime)}%</h3></Col>
				// );
				// bubbles.splice(3, 0, <h3 style={mystyle("100px")} >2019<br />100%</h3>);

				this.setState({
					// bubbles: <Row>{bubbles.splice(0, 4).concat(bubbles.reverse())}</Row>,
					bubbles: dataList
				});
			}, err => {
				console.log(err);
			});

		fetch("http://localhost:8081/getSuperSpreader",
			{
				method: 'GET'
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(dataList => {
				if (!dataList) return;
				let dates = [], newcases = [], outsideTimes = [];
				dataList.forEach((line) => {
					dates.push(line.date.slice(0, 10));
					newcases.push(line.newcase);
					outsideTimes.push(line.outsideTime);
				})

				this.myChart2 = new Chart(this.chartRef2.current, {
					type: 'line',
					data: {
						labels: dates,
						datasets: [{
							label: 'New Cases',
							yAxisID: 'New Cases',
							data: newcases,
							fill: false,
							borderColor: blue, //blue
							pointBackgroundColor: blue, // blue
							pointBorderColor: blue,
							pointHoverBackgroundColor: "#e755ba",
							pointHoverBorderColor: "#e755ba",
						}, {
							label: 'Outside',
							yAxisID: 'Outside',
							data: outsideTimes,
							fill: false,
							borderColor: green, //green
							pointBackgroundColor: green,
							pointBorderColor: green,
							pointHoverBackgroundColor: "#e755ba",
							pointHoverBorderColor: "#e755ba",
						}]
					},
					options: {
						elements: {
							point: {
								radius: 1
							}
						},
						scales: {
							xAxes: [{
								ticks: {
									display: true, //th
									autoSkip: true,
									maxTicksLimit: 20
								},
								gridLines: {
									display: false
								}
							}],
							yAxes: [{
								id: 'New Cases',
								type: 'linear',
								position: 'left',
								gridLines: {
									display: false
								},
							}, {
								id: 'Outside',
								type: 'linear',
								position: 'right',
								/* ticks: {
								  max: 1,
								  min: 0
								} */
							}]
						}
					}
				});


				// console.log(this.state.spreader);
			}, err => {
				console.log(err);
			});


	}

	render() {

		return (
			<div className="OnlineMain">
				<PageNavbar active="Mobility" />
				<br></br>


				<div className="container states-container">
					{/*<div className="jumbotron row">
						<h3 class="display-4">Google Mobility Analysis</h3>
					</div>*/}

					<div className="jumbotron row">
						<div className="col-12 h3">Do people still stay outside? </div>
						<br></br><br></br>
						<div className="col-sm-6 lead">
							<div>
								Most states have issued their stay-at-home order, but of course, not everyone has been carefully obeying it since then.
								Some states like Arkansas and Ohio still haven't issued one yet. However, does everyone really listen to their governors
								in the home state? Google can answer it. Average time people spent outside are well documented, so go head and search your
								home state!
							</div>
							<br></br>
							<div className="h8">
								* The result is based on the average time people spend outside their home from Feburary 24, 2020 to November 1, 2020.
							</div>
						</div>
						<br></br>
						<div className="col-sm-6 lead">
							<div>Outside Time Reduction</div>
							<select value={this.state.bubbleState} onChange={this.handleStateChange2} className="dropdown">
								<option select value> -- Select a State -- </option>
								{/* <option value='DC'> DC </option>
							<option value='CA'> CA </option> */}
								{this.state.stateList}

							</select>&nbsp;&nbsp;&nbsp;
							<Button variant="outline-dark" onClick={this.submitStateInfo2}>SUBMIT</Button>{' '}
							<br></br><br></br><br></br>
							<Row>
								<div className="col-6">
									<h3 style={mystyle("200px")} >2019<br />100%</h3>
								</div>
								<div className="col-6">
									{this.state.flag === false ? <div></div> : <h3 style={mystyle(`${200 * (1 + 1.5 * Math.floor(100 * this.state.bubbleState.outsideTime) / 100)}px`)} >{this.state.bubbleState.abbr}<br />{Math.floor(100 * this.state.bubbleState.outsideTime)}%</h3>}
								</div>
							</Row>
						</div>




					</div>

					<div className="jumbotron row">
						<div className="col-12 h3"> How correlated are new cases and outside time? </div>
						<br></br><br></br>
						<div className="col-sm-12 lead">
							<div>
								A popular myth is that staying at home doesn't help contain the transmission of Covid-19. Luckily, by the graph below, we can
								find out by ourselves whether they are correlated or not. The green line represents how much time people spend outside. The
								blue line means the number of people who were infected on that day, a constant period earlier than the case confirmation date.
								Feel free to hover your mouse on the datapoints for the most accurate
								numbers and measurements.
							</div>
							<br></br>

						</div>

						<div className="col-12">
							{/* two line graph with 13 days difference, national case, national timeoutside*/}
							<canvas ref={this.chartRef2} />
						</div>
						<br></br><br></br>
						<div className="col-12 h8">
							* Due to the lag between virus exposure and case confirmation, a 13 day difference has been applied while comparing, so the true
							relationship is presented.
						</div>
					</div>

					<div className="jumbotron row">
						<div className="col-12 h3">A look deep into people behaviour</div>
						<br></br><br></br>
						<div className="col-sm-12 lead">
							<div>
								Besides a general number that summarized people's behaviour in each state, more detail can be discovered on how people responding to
								the local stay-at-home order. Choose your home state, and go from there!
							</div>
							<br></br>
						</div>

						<select value={this.state.stateName} onChange={this.handleStateChange} className="dropdown">
							<option select value> -- Select a State -- </option>
							{/* <option value='DC'> DC </option>
							<option value='CA'> CA </option> */}
							{this.state.stateList}

						</select>&nbsp;&nbsp;&nbsp;
						<Button variant="outline-dark" onClick={this.submitStateInfo}>SUBMIT</Button>{' '}

						<div className="col-12">
							{/* two line graph with 13 days difference, national case, national timeoutside*/}
							<canvas ref={this.chartRef3} />
						</div>
						<br></br><br></br>
						<div className="col-12 h8">
							* An all blue line indicates that stay-at-home has not been issued in that state.
						</div>
					</div>
				</div>

				<br></br>



			</div >
		);
	}
}