const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Routes
app.get('/', function (req, res) {
    res.send('You have reached the covid tracker:)');
})

// Home Page: 
app.get('/cases/m=:month&d=:day', routes.getNationalCases); // Get covid cases on a national level 


// States Page: 
app.get('/state/state=:state&m=:month&d=:day', routes.getStateCases); // Get covid cases on a state level
app.get('/state/percent/state=:state&m=:month&d=:day', routes.getStatePercent); // Get percentage of state case over national cases
app.get('/state/demoinfo/state=:state&m=:month&d=:day', routes.getStateDemographics) // Get demographics by state

// Mobility 
app.get('/getAllStates', routes.getAllStates);
app.get('/getBubbles', routes.getBubbles);
app.get('/getSuperSpreader', routes.getSuperSpreader);
app.get('/atHome/:stateAbbr', routes.atHomeEachState);


// Employment page
app.get('/Employment', routes.getStateNames); // get statenames
app.get('/Employment/Overview/:statename', routes.getLockdownOverview); // get most recent employment rates for all states, ordered by lockdown start
app.get('/Employment/emprates/:selectedState', routes.getEmploymentRates); // get employment rates for specified state
app.get('/Employment/jobpostings/:selectedState', routes.getJobPostings); // get job postings for specified state

// Online-learning Page:
app.get('/online-learning/selectedWeek=:selectedWeek', routes.getOnlineTopAchievStates);
app.get('/online-learning/selectedIncomeClass=:selectedIncomeClass', routes.getOnlineTopBoostStates);
app.get('/online-learning/selectedState=:selectedState', routes.getOnlineStateData);

app.get('/online-learning/high/selectedState=:selectedState', routes.getOnlineHighIncome);
app.get('/online-learning/middle/selectedState=:selectedState', routes.getOnlineMiddleIncome);
app.get('/online-learning/low/selectedState=:selectedState', routes.getOnlineLowIncome);


// Helper 
app.get('/states', routes.getStates); // This helper endpoint will return a list of state names

app.listen(8081, () => {
    console.log(`Server listening on PORT 8081`);
});
