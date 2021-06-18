import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-vis/dist/style.css';
import {
	FlexibleWidthXYPlot, VerticalGridLines, HorizontalGridLines,
	YAxis, XAxis, Hint,
	VerticalBarSeries, GradientDefs
} from 'react-vis';
import '../style/States.css';
import Col from 'react-bootstrap/Col';

export default class StateInfo extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			hoverValue: null
		}
	}

	render() {

		// Set fixed height 
		const chartHeight = 480;

		// Feed in case data
		let caseData = [
			{ x: 'White', y: `${this.props.white}` },
			{ x: 'Black', y: `${this.props.black}` },
			{ x: 'Hispanic', y: `${this.props.latinx}` },
			{ x: 'Asian', y: `${this.props.asian}` },
			{ x: 'AIAN', y: `${this.props.aian}` },
			{ x: 'NHPI', y: `${this.props.nhpi}` },
			{ x: 'Multiracial', y: `${this.props.multiracial}` },
			{ x: 'Other', y: `${this.props.other}` },
			{ x: 'Unknown', y: `${this.props.unknown}` }
		];

		// Set Y-axis domain for the bar graph
		const yDomain = caseData.reduce(
			(res, row) => {
				return {
					max: Math.max(res.max, row.y),
					min: Math.min(res.min, row.y)
				};
			},
			{ max: -Infinity, min: Infinity }
		);

		return (
			<div className="stateInfo">
				<div className="jumbotron">
					<div class="container">
						<div className="h5">Demographics Summary of COVID-19 in {this.props.state}</div>
						<div class="row">
							<Col>
								White:
									<div className="h6">{this.props.white}</div>
								<br></br>
									Black or African American:
									<div className="h6">{this.props.black}</div>
								<br></br>
									Hispanic or Latino:
									<div className="h6">{this.props.latinx}</div>
								<br></br>
									Asian:
									<div className="h6">{this.props.asian}</div>
								<br></br>
									American Indian or Alaska Native:
									<div className="h6">{this.props.aian}</div>
								<br></br>
									* By the end of the week *
								</Col>
							<Col>
								Native Hawaiian and Pacific Islander:
									<div className="h6">{this.props.nhpi}</div>
								<br></br>
									Two or More Races:
									<div className="h6">{this.props.multiracial}</div>
								<br></br>
									Other:
									<div className="h6">{this.props.other}</div>
								<br></br>
									Unknown:
									<div className="h6">{this.props.unknown}</div>
							</Col>
							<br></br>
						</div>
					</div>
				</div>
				<div className="jumbotron">
					<FlexibleWidthXYPlot
						xType="ordinal"
						height={chartHeight}
						yDomain={[yDomain.min, yDomain.max]}
						margin={{ left: 75 }}
						onMouseLeave={() => this.setState({ hoverValue: null })}
					>

						<GradientDefs>
							<linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="red" stopOpacity={0.4} />
								<stop offset="100%" stopColor="black" stopOpacity={0.3} />
							</linearGradient>
						</GradientDefs>
						<XAxis title="Demographics" />
						<YAxis title="Cases" />
						<HorizontalGridLines />
						<VerticalGridLines />
						<VerticalBarSeries
							color={'url(#CoolGradient)'}
							data={caseData}
							onValueMouseOver={(d) => this.setState({ hoverValue: d })}
						/>
						{this.state.hoverValue && <Hint value={this.state.hoverValue} />}
					</FlexibleWidthXYPlot>
				</div>
			</div>
		);
	}
}
