var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createConnection(config);

// Connecting to the database
connection.connect(function (err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});


// Home page: Get covid cases on a national level 
function getNationalCases(req, res) {
  var month = parseInt(req.params.month);
  var day = parseInt(req.params.day);
  var query = `
    SELECT test_count, case_count, death_count  
    FROM covid_db.national_cases
    WHERE month = '${month}' AND day = '${day}'     
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log(rows);
    }
  });

};

// States page: get state-level cases info 
function getStateCases(req, res) {
  var state = req.params.state;
  var month = parseInt(req.params.month);
  var day = parseInt(req.params.day);
  var query = `
    SELECT statename, test_count, case_count, death_count
    FROM covid_db.state_cases SC JOIN covid_db.state_milestone SM on SC.statefips = SM.statefips
    WHERE SM.statename = '${state}' AND SC.month = '${month}' AND SC.day = '${day}'
    `;

  var begin = process.hrtime();
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      var end = process.hrtime(begin);
      console.log((end[1]) / 1000000);
      res.json(rows);
      console.log(rows);
    }
  });
};

// States Page: get the percentage of the state case count over national case count
function getStatePercent(req, res) {
  var state = req.params.state;
  var month = parseInt(req.params.month);
  var day = parseInt(req.params.day);
  var query = `
  SELECT statename, ROUND(SC.case_count / NC.case_count, 4) as case_percent
    FROM covid_db.state_cases SC JOIN covid_db.national_cases NC ON
    (SC.month = NC.month AND SC.day = NC.day) JOIN covid_db.state_milestone SM ON SC.statefips = SM.statefips
    WHERE SM.statename = '${state}' AND SC.month = '${month}' AND SC.day = '${day}'    
    `;
    var begin = process.hrtime();
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      var end = process.hrtime(begin);
      console.log((end[1]) / 1000000);
      res.json(rows);
      console.log(rows);
    }
  });
};

// States Page: get demographic info by state 
function getStateDemographics(req, res) {
  var state = req.params.state;
  var month = parseInt(req.params.month);
  var day = parseInt(req.params.day);

  // Attemped Optimization 
  // var query = 
  // `With state as (
	// 	Select stateabbrev, statename
  //       from state_milestone
  //       where statename = 'California'
  //   ), demo as (
	// 	select D.State, D.Date, D.total, D.White, D.Black, D.LatinX, D.Asian, D.AIAN, D.NHPI, D.Multiracial, D.Other, D.Unknown
  //       from demographics D
  //       WHERE DATEDIFF(D.Date, "2020/5/1") >= 0 and DATEDIFF(D.Date, "2020/5/1") < 7 
  //   )
  //   SELECT state.statename, D.Date, D.total, D.White, D.Black, D.LatinX, D.Asian, D.AIAN, D.NHPI, D.Multiracial, D.Other, D.Unknown
  //   FROM demo D JOIN state on state.stateabbrev = D.State
  //   Limit 1;
  //   `

  // Query
  var query = `
    SELECT SM.statename, D.Date, D.total, D.White, D.Black, D.LatinX, D.Asian, D.AIAN, D.NHPI, D.Multiracial, D.Other, D.Unknown
    FROM covid_db.demographics D JOIN covid_db.state_milestone SM on SM.stateabbrev = D.State
    WHERE DATEDIFF(D.Date, "2020/'${month}'/'${day}'") >= 0 and DATEDIFF(D.Date, "2020/'${month}'/'${day}'") < 7 and SM.statename = '${state}'
    Limit 1;
    `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log(rows);
    }
  });
};






// MOBILITY QUERIES
function getAllStates(req, res) {
  var query = `select stateabbrev as abbr from state_milestone;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getBubbles(req, res) {
  var query = `
    select s.stateabbrev as abbr, avg(m.gps_away_from_home) as outsideTime
    from state_milestone s join mobility_state m on s.statefips = m.statefips
    group by s.statefips
    order by outsideTime DESC
    ;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getSuperSpreader(req, res) {
  var query = `
    with dailyCase as (SELECT DATE_SUB(\`date\`, INTERVAL 13 DAY) as date, 
        case_count - LAG(case_count, 1, 0) OVER(ORDER BY date) as newcase
        FROM national_cases) 
    select mobility_national.date, mobility_national.gps_away_from_home as outsideTime, dailyCase.newcase
    from dailyCase join mobility_national on mobility_national.date=dailyCase.date
    ;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function atHomeEachState(req, res) {
  var selectedState = req.params.stateAbbr.slice(1);
  // console.log(selectedState);

  /*--Query before Optimization--*/
  // var query = `
  // select mobility_state.date, mobility_state.gps_away_from_home as outside, state_milestone.stayathome_start as start
  // from state_milestone join mobility_state on state_milestone.statefips=mobility_state.statefips
  // where state_milestone.stateabbrev='${selectedState}'
  // ;`;
  /*--Query after Optimization--*/
  var query = `
  with startDate as (select statefips, stateabbrev, stayathome_start from state_milestone where stateabbrev='${selectedState}'),
  trimedMobility as (select statefips, date, gps_away_from_home as outside from mobility_state)
  select date, outside, stayathome_start as start
  from startDate join trimedMobility on startDate.statefips=trimedMobility.statefips
  ;`;
  var begin = process.hrtime();
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      var end = process.hrtime(begin);
      console.log((end[1]) / 1000000);
      res.json(rows);
    }
  });
}

// Employment queries

function getStateNames(req, res) {
  var query = `
    SELECT DISTINCT m.statename
    FROM state_milestone m;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getEmploymentRates(req, res) {
  var reqState = req.params.selectedState;
  var query = `
    SELECT m.stayathome_start, m.statewide_stayathome_end, e.emp_combined, e.date
    FROM state_milestone m
    JOIN employment e ON m.statefips = e.statefips
    WHERE m.statename = '${reqState}';
`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getJobPostings(req, res) {
  var reqState = req.params.selectedState;
  var query = `
    SELECT m.stayathome_start, m.statewide_stayathome_end, j.bg_posts, j.date
    FROM state_milestone m
    JOIN job_postings j ON m.statefips = j.statefips
    WHERE m.statename = '${reqState}';
`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

function getLockdownOverview(req, res) {
  var reqState = req.params.statename;
  var query = `
    SELECT e.emp_combined, h.emp_combined_inchigh, d.emp_combined_incmiddle, l.emp_combined_inclow
    FROM state_milestone m
    JOIN employment e ON m.statefips = e.statefips
    JOIN emp_high h ON m.statefips = h.statefips
    JOIN emp_middle d ON m.statefips = d.statefips
    JOIN emp_low l ON m.statefips = l.statefips 
    WHERE m.statename = '${reqState}' AND e.date >= ALL(SELECT e2.date FROM employment e2) AND h.date >= ALL(SELECT h2.date FROM emp_high h2) AND d.date >= ALL(SELECT d2.date FROM emp_middle d2) AND l.date >= ALL(SELECT l2.date FROM emp_low l2);
`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* ---- Online-learning page: regarding achivment index per selected week---- */
function getOnlineTopAchievStates(req, res) {
  var inputNumber = req.params.selectedWeek;
  // console.log("recevie request of getOnlineTopAchievStates", + req);
  /*--Query before Optimization--*/
  // var query = `
  //   SELECT S.statename,Z.badges,Z.date
  //   FROM zearn_processed Z JOIN state_milestone S
  //     ON Z.z_statefips = S.statefips
  //   WHERE date(Z.date) = ADDDATE(
  //     (select min(date(Z.date))
  //       from zearn_processed Z
  //       where date(Z.date) > date(S.schools_closed)
  //     ), 7* ${inputNumber})
  //   ORDER BY Z.badges DESC
  //   LIMIT 5;
  // `;
  /*--Query after Optimization--*/
  var query = `
        WITH TEMP AS(
            select min(Z.date) AS datePoint
            from zearn_processed Z JOIN state_milestone S ON Z.z_statefips = S.statefips
            where date(Z.date) > date(S.schools_closed)
        )
        SELECT S.statename,Z.badges,Z.date
        FROM TEMP T, zearn_processed Z JOIN state_milestone S
            ON Z.z_statefips = S.statefips
        WHERE date(Z.date) = ADDDATE(
            (T.datePoint
            ), 7*${inputNumber})
        ORDER BY Z.badges DESC
        LIMIT 5;
  `;
  var begin = process.hrtime();
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      var end = process.hrtime(begin);
      console.log((end[1]) / 1000000);
      res.json(rows);
    }
  });
};

/* ---- Online-learning page: regarding boost index per income class---- */
function getOnlineTopBoostStates(req, res) {
  // Z.badges_inchigh
  var input = req.params.selectedIncomeClass;
  // console.log("recevie request of getOnlineTopBoostStates", + req);
  var query = `
    SELECT T.statename, ABS(MAX(T.val) - MIN(T.val)) AS influence
    FROM(
        SELECT S.statename,AVG(Z.${input}) AS val
        FROM zearn_processed Z 
            JOIN state_milestone S ON Z.z_statefips = S.statefips
        GROUP BY S.statename,  date(Z.date) > date(S.schools_closed) 
    ) T
    GROUP BY T.statename
    ORDER BY influence DESC
    LIMIT 10;    
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log("result:\n" + res);

    }
  });
};

/* ---- Online-learning page: get state data for chart---- */
function getOnlineStateData(req, res) {

  var selectedState = req.params.selectedState;
  // var selectedIncome = req.params.selectedIncome;

  var query = `
    SELECT Z.badges, Z.date, S.schools_closed AS closeDate
    FROM zearn_processed Z
            JOIN state_milestone S ON Z.z_statefips = S.statefips
    WHERE S.statename = '${selectedState}';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- Online-learning page: get class data for chart---- */
function getOnlineHighIncome(req, res) {

  var selectedState = req.params.selectedState;

  var query = `
    SELECT Z.badges_inchigh, Z.date, S.schools_closed AS closeDate
    FROM zearn_processed Z
            JOIN state_milestone S ON Z.z_statefips = S.statefips
    WHERE S.statename = '${selectedState}';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- Online-learning page: get class data for chart---- */
function getOnlineMiddleIncome(req, res) {

  var selectedState = req.params.selectedState;

  var query = `
    SELECT Z.badges_incmiddle, Z.date, S.schools_closed AS closeDate
    FROM zearn_processed Z
            JOIN state_milestone S ON Z.z_statefips = S.statefips
    WHERE S.statename = '${selectedState}';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- Online-learning page: get class data for chart---- */
function getOnlineLowIncome(req, res) {

  var selectedState = req.params.selectedState;

  var query = `
    SELECT Z.badges_inclow, Z.date, S.schools_closed AS closeDate
    FROM zearn_processed Z
            JOIN state_milestone S ON Z.z_statefips = S.statefips
    WHERE S.statename = '${selectedState}';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getStates(req, res) {
  var query = `
    SELECT statename From state_milestone;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getNationalCases: getNationalCases,
  getStateCases: getStateCases,
  getStatePercent: getStatePercent,
  getStateDemographics: getStateDemographics,
  getStates: getStates,
  getBubbles: getBubbles,
  getSuperSpreader: getSuperSpreader,
  atHomeEachState: atHomeEachState,
  getAllStates: getAllStates,

  getStateNames: getStateNames,
  getEmploymentRates: getEmploymentRates,
  getJobPostings: getJobPostings,
  getLockdownOverview: getLockdownOverview,

  // online-learning sub page
  getOnlineTopAchievStates: getOnlineTopAchievStates,
  getOnlineTopBoostStates: getOnlineTopBoostStates,
  getOnlineStateData: getOnlineStateData,
  getOnlineHighIncome: getOnlineHighIncome,
  getOnlineMiddleIncome: getOnlineMiddleIncome,
  getOnlineLowIncome: getOnlineLowIncome,
}
