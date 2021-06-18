import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import States from './States';
import Mobility from './Mobility';
import Home from './Home';
import OnlineMain from './OnlineMain';
import Employment from './Employment';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Home />
							)}
						/>
						<Route
							exact
							path="/home"
							render={() => (
								<Home />
							)}
						/>		
						<Route
							exact
							path="/states"
							render={() => (
								<States />
							)}
						/>
						<Route
							path="/online-learning"
							render={() => (
								<OnlineMain />
							)}
						/>

						<Route
							path="/mobility"
							render={() => (
								<Mobility />
							)}
						/>
						
						<Route
							path="/Employment"
							render={() => (
								<Employment />
							)}
						/>

					</Switch>
				</Router>
			</div>
		);
	}
}
