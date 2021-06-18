import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";

const OnlineChart2 = () => {
  const [selectedState, setSelectedState] = useState("");
  // const [selectedIncome, setSelectedIncome] = useState("badges");
  
  const handleNameChange = useCallback(e => {        
    setSelectedState(e.target.value)                          
  }, []);
  


  const [chartData, setChartData] = useState({});
  const [schoolCloseDate, setSchoolCloseDate] = useState("0000-00-00");


  const chart = () => {
      let scoresHigh = [];
      let scoresLow = [];
      let scoresMiddle = [];
      let dates = [];    
      
    Promise.all([
        fetch("http://localhost:8081/online-learning/high/selectedState=" + selectedState,
      {
        method: "GET"
      }),
        fetch("http://localhost:8081/online-learning/low/selectedState=" + selectedState,
      {
        method: "GET"
      }),
      fetch("http://localhost:8081/online-learning/middle/selectedState=" + selectedState,
      {
        method: "GET"
      })
    ])
    .then(([res1, res2, res3]) => Promise.all([res1.json(), res2.json(),res3.json()]))
    .then(([data1, data2, data3]) => {
        if(!data1) return;
        // console.log(JSON.stringify(rawData));
        setSchoolCloseDate(
          data1[0].closeDate.substring(0,10)
        );
        for (const dataObj of data1) {
          dates.push(dataObj.date.substring(0,10));
          scoresHigh.push(parseFloat(dataObj.badges_inchigh));
        }
        if(!data2) return;
        for (const dataObj2 of data2) {
          scoresLow.push(parseFloat(dataObj2.badges_inclow));
        }
        if(!data3) return;
        for (const dataObj3 of data3) {
          scoresMiddle.push(parseFloat(dataObj3.badges_incmiddle));
        }

     
        setChartData({
          labels: dates,
          datasets: [
            {
              label: "high income",
              data: scoresHigh,
              backgroundColor: ["rgba(255, 206, 86, 0.6)"],
              borderWidth: 2,
              borderColor: ["rgba(255, 206, 86, 0.6)"],
              pointBorderColor:["rgba(255, 206, 86, 0.6)"],
              pointBackgroundColor: ["rgba(255, 206, 86, 0.6)"]
            }
            ,
            {
              label: "low income",
              data: scoresLow,
              backgroundColor: ["rgba(75, 192, 192, 0.6)"],
              borderWidth: 2,
              borderColor: ["rgba(75, 192, 192, 0.6)"]
            }
            ,
            {
              label: "middle income",
              data: scoresMiddle,
              backgroundColor: ["rgba(255, 99, 132, 0.6)"],
              borderWidth: 2,
              borderColor: ["rgba(255, 99, 132, 0.6)"]
            }

          ]
        });
      })
      .catch(err => {
        console.log(err);
      });
      

  };

  useEffect(() => {
    chart();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div className="OnlineChartDisplay container">
      <div className="jumbotron">

        <div className="input-container">
            
              <input type='text' placeholder="Enter State Name" value={selectedState} onChange={handleNameChange} id="stateName2" className="state-input"/>
              <button id="submitWeekBtn" className="submit-btn" onClick={chart}>Go</button>
        </div>
       
        <div className="h8"><small>School closed on <strong><ins> {schoolCloseDate}</ins> </strong> </small></div>


        <Line
          data={chartData}
          options={{
            responsive: true,
            title:{
              display:true,
              text:'High/Low/Middle Income Class Student Online Learning Achievement in ' + selectedState,
              fontSize:20
            },
            legend:{
              display:true,
              position:"bottom"
            }
          }}
        />
   
        <div className="h8"> <small> * Note that there are no data recorded during summer or winter break </small></div>
      </div>
    </div>
  );
};

export default OnlineChart2;