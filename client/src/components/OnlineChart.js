import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";

const OnlineChart = () => {
  const [selectedState, setSelectedState] = useState("");
  // const [selectedIncome, setSelectedIncome] = useState("badges");

  const handleNameChange = useCallback(e => {        
    setSelectedState(e.target.value)                          
  }, []);


  const [chartData, setChartData] = useState({});
  const [schoolCloseDate, setSchoolCloseDate] = useState("0000-00-00");


  const chart = () => {
      let scores = [];
      let dates = [];    
     
      fetch("http://localhost:8081/online-learning/selectedState=" + selectedState,
    {
      method: "GET"
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(rawData => {
        if(!rawData) return;
        // console.log(JSON.stringify(rawData));
        setSchoolCloseDate(
          rawData[0].closeDate.substring(0,10)
        );
        for (const dataObj of rawData) {
          dates.push(dataObj.date.substring(0,10));
          scores.push(parseFloat(dataObj.badges));
        }
        
        setChartData({
          labels: dates,
          datasets: [
            {
              label: "overall",
              data: scores,
              backgroundColor: ["rgba(255, 99, 132, 0.6)"],
              borderWidth: 2,
              pointHoverRadius: 3
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
            
              <input type='text' placeholder="Enter State Name" value={selectedState} onChange={handleNameChange} id="stateName1" className="state-input"/>
              <button id="submitWeekBtn" className="submit-btn" onClick={chart}>Go</button>
        </div>
       
        <div className="h8"><small>School closed on <strong><ins> {schoolCloseDate}</ins> </strong> </small></div>


        <Line
          data={chartData}
          options={{
            responsive: true,
            title:{
              display:true,
              text:'Student Online Learning Achievement in ' + selectedState,
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

export default OnlineChart;