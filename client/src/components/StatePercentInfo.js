import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-vis/dist/style.css';
import {
	GradientDefs, RadialChart, makeVisFlexible
} from 'react-vis';
import '../style/States.css';

export default class StatePercentInfo extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			hoverValue: null
		}
	}

	render() {

		// Set fixed height 
		const chartHeight = 300;
		const percentData = [{ angle: this.props.percent, gradientLabel: 'grad1' }, { angle: this.props.nationalPercent, gradientLabel: 'grad2' }]
		const FlexiblePieChart = makeVisFlexible(RadialChart);


		return (
			<div className="jumbotron">
				<div className="h5">Case Count in {this.props.state} in Relation to National Count</div>
				<div class="row">
					<div class="col-6">

						<FlexiblePieChart
						    style={{stroke: '#fff'}}
							colorType={'literal'}
							colorDomain={[0, 100]}
							colorRange={[0, 10]}
							getColor={d => `url(#${d.gradientLabel})`}

							data={percentData}
							height={chartHeight}>
							<GradientDefs>
								<linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
									<stop offset="0%" stopColor="red" stopOpacity={0.5} />
									<stop offset="100%" stopColor="black" stopOpacity={0.5} />
								</linearGradient>
								<linearGradient id="grad2" x1="0" x2="0" y1="0" y2="1">
									<stop offset="0%" stopColor="grey" stopOpacity={0.4} />
									<stop offset="100%" stopColor="black" stopOpacity={0.4} />
								</linearGradient>
							</GradientDefs>
						</FlexiblePieChart>
					</div>
					<div class="col-6">
						<br></br>
						<br></br>
						<br></br>

						<div className="h6">{this.props.state} is responsible for {(this.props.percent * 100).toPrecision(2)}% of all COVID cases in the United States.</div>
					</div>
				</div>

			</div>
		);
	}
}
