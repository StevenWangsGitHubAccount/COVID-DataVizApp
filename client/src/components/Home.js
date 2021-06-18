import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Home extends React.Component {
	handleMovieNameChange(e) {
		this.setState({
		});
	}
	
	render() {

		return (
			<div className="Home">
				<PageNavbar active="home" />

				{/* Header: overall introduction */}
				<div class="jumbotron">
				  <h1 class="display-4">Welcome to The Covid Tracker!</h1>
				  <p class="lead">COVID-19 is an infectious disease caused by a newly discovered coronavirus. 
						People infected with the COVID-19 virus will experience mild to moderate respiratory illness.
						The elderly and those with underlying medical problems such as cardiovascular disease, diabetes, chronic respiratory disease, and cancer, are more likely to develop serious illness.</p>
						
				  <p class="lead">This website investigates and visualizes how COVID-19 has changed people’s lives within the United States, especially before and after the imposition of state lockdown(stay at home) orders. We examine the impact of COVID-19 on American states in terms of cases and deaths; time spent outside; achievement rates in online education; and the labor market. We hope that our efforts help others to better understand how COVID-19 has changed our lives in both obvious and subtle ways.</p>
	
				</div>

                <br></br>
                <br></br>


            	{/* This is state subpage introduction */}
                <br></br>
				<div class="card text-center hoverable p-4" style={{margin: "auto",  background: "rgba(255, 255, 255, 0.7)"}}>
				  <div class="row">
				    <div class="col-md-4 offset-md-1 mx-3 my-3">
				      <div class="view overlay">
				        <img src={"https://static01.nyt.com/images/2020/10/25/us/coronavirus-us-cases-promo-1601396060818/coronavirus-us-cases-promo-1601396060818-videoSixteenByNineJumbo1600-v298.png"} class="img-fluid" alt="State alt pic" thumbnail/> 
				      </div>	      	
				  </div>      

				  <div class="col-md-7 text-md-left ml-3 mt-3">				     
					       {/* <h6 class="h6 pb-1"><i class="fas fa-desktop pr-1"></i> Online-learning Study</h6>*/}
					      <h4 class="h4 mb-4">COVID-19 Cases by State</h4>

					      <p class="font-weight-normal">Here you can find case summaries for each state, 
how each state is doing relative to the nation as a whole, and the demographic breakdown of all COVID-19 cases within each state.</p>
					      
					      <a class="btn btn-outline-secondary" href={"/states"} role="button">Learn more</a>
				   </div>		
				  </div>
				 </div>
				<br></br>
				


				{/* This is online-learning subpage introduction */}
				<br></br>
				<div class="card text-center hoverable p-4" style={{margin: "auto", background: "rgba(255, 255, 255, 0.75)"}}>
				  <div class="row">
				    <div class="col-md-4 offset-md-1 mx-3 my-3">
				      <div class="view overlay">
				        <img src={"https://previews.123rf.com/images/microone/microone1804/microone180400344/99455054-student-or-school-boy-studying-on-computer-online-lesson-and-education-vector-concept-student-at-com.jpg"} class="img-fluid" alt="Education alt pic" thumbnail/> 
				      </div>	      	
				  </div>      

				  <div class="col-md-7 text-md-left ml-3 mt-3">				     
					      <h4 class="h4 mb-4">Online-learning Study</h4>

					      <p class="font-weight-normal">
					      	  Schools across the US have closed in response to the pandemic, disrupting learning for millions of students. Education has changed dramatically, as classes are taught remotely on digital platforms.
					      	  How the pandemic has affected student e-learning performance? Which states have been most impacted by these changes, and which are rising to the challenge? Will low-income students be at a disadvantage relative to their better-off peers? 
					      	  Using online math learning data from Zearn, we investigate these questions and show how students across 50 states are faring with online-learning.
					      </p>
					      
					     
					      <a class="btn btn-outline-secondary" href={"/online-learning"} role="button">Learn more</a>
				   </div>		
				  </div>
				 </div>
				<br></br>



				{/* This is mobility subpage introduction */}
				<br></br>
				<div class="card text-center hoverable p-4" style={{margin: "auto",  background: "rgba(255, 255, 255, 0.75)"}}>
				  <div class="row">
				    <div class="col-md-4 offset-md-1 mx-3 my-3">
				      <div class="view overlay">
				        <img src={"https://today.law.harvard.edu/wp-content/uploads/2020/04/shutterstock_1689264058_web-1800x993.jpg"} class="img-fluid" alt="Mobility alt pic" thumbnail/> 
				      </div>	      	
				  </div>      

				  <div class="col-md-7 text-md-left ml-3 mt-3">				     
					      <h4 class="h4 mb-4">Mobility Study</h4>

					      <p class="font-weight-normal">Stay-at-home orders issued by most states have met considerable resistance. Many question whether this sacrifice of personal freedom actually contributes to stopping the spread of COVID-19. By using Google's Community Mobility Reports, we examine how people have changed their mobility patterns in 2020 and possible correlations with COVID-19 case numbers.</p>
					      
					      
					      <a class="btn btn-outline-secondary" href={"/Mobility"} role="button">Learn more</a>
				   </div>		
				  </div>
				 </div>
				<br></br>
				
				{/* This is employment subpage introduction */}
				<br></br>
				<div class="card text-center hoverable p-4" style={{margin: "auto",  background: "rgba(255, 255, 255, 0.75)"}}>
				  <div class="row">
				    <div class="col-md-4 offset-md-1 mx-3 my-3">
				      <div class="view overlay">
				        <img src={"https://media.istockphoto.com/vectors/excellent-work-award-on-red-vector-id877487654?k=6&m=877487654&s=170667a&w=0&h=pP9LIhvUbQnKYL1k5Pdm5brq1KFqohLFFWbrF0wpWJE="} class="img-fluid" alt="employment alt pic" thumbnail/> 
				      </div>	      	
				  </div>      

				  <div class="col-md-7 text-md-left ml-3 mt-3">				     
					      <h4 class="h4 mb-4">Employment Study </h4>

					      <p class="font-weight-normal">The pandemic has had a devastating impact on the US labor market, and 2020 has yielded unemployment rates not seen since the Great Depression. This page explores the impact of COVID-19 and state lockdowns on the job market.</p>
					      
					      
					      <a class="btn btn-outline-secondary" href={"/Employment"} role="button">Learn more</a>
				   </div>		
				  </div>
				 </div>


				{/* This is a footer */}
				<br></br>				
				<footer class="page-footer font-small pt-4">

				  <div class="footer-copyright text-center py-3">© 2020 Copyright:
				    <a href="https://localhost:3000/"> mict550groupProject</a>
				  </div>

				</footer>
				

		    </div>
		);
	}
}

