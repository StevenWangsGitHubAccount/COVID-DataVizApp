import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";

const EmpChart = () => {
  const [selectedState, setSelectedState] = useState("");

  const handleNameChange = useCallback(e => {        
    setSelectedState(e.target.value)                          
  }, []);


  const [chartData, setChartData] = useState({});
  const [stayAtHomeStart, setStayAtHomeStart] = useState("0000-00-00");
  const [stayAtHomeEnd, setStayAtHomeEnd] = useState("0000-00-00");


  const chart = () => {
      let empRates = [];
      let dates = [];    
     
      fetch("http://localhost:8081/Employment/emprates/" + selectedState,
    {
      method: "GET"
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(rawData => {
        if(!rawData) return;
        // console.log(JSON.stringify(rawData));
        setStayAtHomeStart(
          rawData[0].stayathome_start.substring(0,10)
        );
        setStayAtHomeEnd(
          rawData[0].statewide_stayathome_end.substring(0,10)
        );
        for (const dataObj of rawData) {
          dates.push(dataObj.date.substring(0,10));
          empRates.push(parseFloat(dataObj.emp_combined));
        }
        
        setChartData({
          labels: dates,
          datasets: [
            {
              label: "Measured relative to January 2020",
              data: empRates,
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
   
      <div className="jumbotron">
        <div className="h5"><strong>Chart changes in employment rates in 2020 </strong></div> 
        <br></br>
        <div className="input-container">
            
              <input type='text' placeholder="Enter State Name" value={selectedState} onChange={handleNameChange} id="stateName" className="state-input"/>
              <button id="submitWeekBtn" className="submit-btn" onClick={chart}>Go</button>
        </div>
       
        <div className="h8"><small>Statewide stay-at-home order effective on <strong><ins> {stayAtHomeStart}</ins> </strong> </small></div>
        <div className="h8"><small>Statewide stay-at-home order ended on <strong><ins> {stayAtHomeEnd}</ins> </strong> </small></div>


        <Line
          data={chartData}
          options={{
            responsive: true,
            title:{
              display:true,
              text:'Changes in Employment Rate Through 2020 in ' + selectedState,
              fontSize:20
            },
            legend:{
              display:true,
              position:"bottom"
            }
          }}
        />
   
        
      </div>
   
  );
};

export default EmpChart;
