# Senior-Design
Data Mining and Visualizing Public Transportation Delays
![alt text](https://github.com/riyadhhossain01/Senior-Design/blob/master/Bus%20Delayed%20Stops%20_%20Data%20Visualization.gif)
  
Data Mining and Visualizing Public Transportation Delays
 (December 2018)
 Ronak Etemadpour (Assistant Professor, CS Dept.), Riyadh Hossain (Computer Engr Student, CCNY), Husnain Baig (Computer Engr Student, CCNY), Jannatul Ferdous Brishty (Computer Engr Student, CCNY), Sadia Sakandar (Computer Engr Student, CCNY), Mostafizur Rahman (CS Student, CCNY)
Abstract— Public bus transit plays an important role in city transportation infrastructure. However, public bus transit is often difficult to use because of lack of information about bus locations and delay time, which in the presence of operational delays and service alerts makes it difficult for riders to predict when buses will arrive and plan trips. Precisely tracking vehicle and informing riders of estimated times of arrival is challenging due to a number of factors, such as traffic congestion, operational delays, varying times taken to load passengers at each stop. In this paper, we introduce a different visualization for short-term prediction of bus delay times. The system uses bus position data, time of the day, bus ids and historical arrival and departure data - available for selected stops to show bus delay time. Our approach combines clustering analysis, T-test and P values analysis with a shared route segment model in order to produce more accurate delay time information. This information is then visualized with the help of different visualizations, each showing a unique property based upon which, analysis and results are being derived.
INTRODUCTION
    The New York City Subway system, operated by MTA, is the largest Metro rail transit system in the world. Between 2005 and 2007, the average weekday subway ridership was 5 million, with a yearly average of over 1.8 billion. The system boasts 468 stations and well over 600 miles of passenger-used tracks. Nearly 70,000 people are employed by the MTA. It is consistently among the highest ranked subway systems in the world in terms of ridership and is the only system which is fully operational 24 hours a day, seven days a week. By looking at these numbers we can see that a very large amount of population is directly affected with the delays in the system. 

Bus systems are the backbones of public transit services in many cities. With their high capacity and relatively low investment and operational costs, bus systems can reduce traffic congestion substantially as well as bring environmental benefits such as reducing energy consumption and air pollution [1]. However, one major issue preventing many people from choosing bus service for commuting and travelling is its unpredictability [2]. Buses can often show up late due to various reasons: traffic congestion, road construction, special events or bad weather. This uncertainty forces potential riders to opt for other modes of transportation. Travel/arrival time is one key research topic in intelligent transportation research [3], [4], [5]. Often, transit authorities use Automatic vehicle location (AVL) systems to monitor bus service status to provide information to city decision makers as well as commuters. The data collected provides the potential for more intelligent applications such as transit operation monitoring, smart trip planning, rough delay time estimation, at-stop displays, etc.
 
Arrival time estimation is not a new concept. Systems that provide real-time arrival information of the next train have been in place for rail transit operations for a long time. For example, in the San Francisco Bay Area, every BART (Bay Area Rapid Transit) station has an overhead display panel showing the arrival time of an oncoming train. Although identical in objectives, the technology used for arrival time estimation in a rail transit system is not directly transferable to a fixed route bus system due to two distinct variances between the operations of these two modes. First, relatively speaking, rail transit is a well-controlled mode; its operation is confined to tracks usually with little external interference. The location of a train at every moment, therefore, can be determined internally based on the speed profile of a train. Bus locations, however, cannot be tracked easily without external sensors. Second, with the advancement in technologies, train operations today can be preprogrammed into a computer system and thus require less direct control from the train operator. Travel time between two stations can be predicted with a high degree of certainty and delays can be show with more certitude. The operation of buses, on the other hand, remains predominantly at the control of human beings. The driver's behavior plays an important role in on-time performance of the buses. The uncertainty is unlikely to be reduced significantly with the presence of traffic signal preemption at intersections or through the use of separate HOV lanes for buses. The arrival time of the next bus could fluctuate in accordance with changes in traffic. How to deal with these two barriers is yet to be explored. The above given reasons are our motivations on pursuing this project.
 
In this paper, we focus on delay time analysis of two different bus routes using different methods and techniques such as P Test, T Test, cluster modeling, bubble chart etc. The result of these analysis is then shown using different types of visualization, each showing a different facet of the findings. These visualizations can help us get a better understanding of how the delays are being spread over the course of 24 hours and how variations are being observed when different factors are accounted for. 

Our project is different from the above described as it only focuses on the delays and informs which bus should be taken for better time management. Our visualization includes an interactive google map where markers are placed on the map showing the bus stops which enables a user to see if the bus is stopping at a specific stop, this can be seen in section E. These stops are then further dissected by analyzing them on the basis of daily to weekly delays. We also included a linear scatter plot which shows the total number of stops at the bus-stop. Along with this, we included a scatter line chart to a T-test chart which shows a deep statistical analysis for the bus-stops null hypothesis, more details of this can be seen in section G.

Along with this, in our project we tried to answer the following questions:

	Does it show a heavy congestion track segment in the morning time on a week basis?
	Does it show the total number of buses stopping at a particular stop?
	 Does the visualization include where the stop is? For instance, the Longitude and Latitude?
	Does the stop show which buses are better to take if there is a delay?
	Is there a refined calculation for a mean value? Example t-test or P values?
	Can a user identify which stop has heavy delay no matter what the alternative is?
	Can a user see the average delay for a bus track?
	Can a user see an in-depth statistical analysis which proves the delayed values?
	Can a user differentiate between the 2 different Bus lines shown in the visualization?
	Can a user see the delays for a single day?
Furthermore, some questions or concerns that might arise in user mind include: 
	Not enough data for everyday of the week.
	Require a scatter line to see trend of delays in the week day.
	Might need a Heat map visualization.
	Possible reason for delays? A foot note.
	A summation of the total delay made by the bus for a day.
	How many trips are made by the bus on that particular day? 
	Average trip made by the bus with delays? Without delays?
Related Works

	Historical Delay Analysis Models 

Many researchers have conducted studies that analyze the historical data of bus service to investigate factors that cause delay and affect bus service. Abkowitz et al. [9] found that trip distance, passenger activity and signalized intersections could greatly affect the mean and variance of bus running time. Kimpel et al. [10] analyzed the bus service performance and passenger demand using Tri-Met Bus Dispatch System data at time point level. They found that the delay variation at previous time points, passenger demand variation, speed and distance contribute to delay variations. They suggested that optimizing delay at early time points could improve service reliability. El-Geneidy et al. [11] investigated how reserved bus lane affect the running time delay and arrival time delay of other parallel routes.

	Bus Service Quality Measurement

Researchers have defined several performance measures to quantify the quality of bus service. Sterman et al. [12] tested the inverse of the standard deviation of travel times to measure service reliability. Camus et al. [13] proposed a new service measure called weighted delay index. Saberi et al. [14] evaluated the existing reliability measures and defined an alternative metric at the stop level. Other researchers have presented systematic frameworks for bus service measurement. Lin et al. [15] created a quality control framework of Data Envelopment Analysis (DEA) that uses data from AVL devices to quantify route service reliability. Gilmore et al. [16] presented the integration of quantitative analysis tools and applied to public bus systems.

	Delay Prediction Models

        Travel time and arrival time variation were found to have a great impact on commuters’ satisfaction [17]. In the past decade, numerous studies have been conducted to develop models and algorithms to predict bus travel delay and arrival delay. Abdelfattah et al. [18] developed linear and nonlinear regression models for predicting bus delay under normal conditions using simulation data. Williams and Hoel [19] found that daily traffic condition patterns are consistent across the weeks. Jeong et al. [20] presented a historical average model and found that the historical model was outperformed by other models because its prediction accuracy was limited by the reliability of traffic patterns. Regression models measure various independent variables to predict a dependent variable. Patnaik et al. [4] used distance, number of passengers at stops, stop numbers, and weather conditions for multilinear regression models to predict bus arrival time. However, since the attributes in transit services are often not independent but correlated with each other, the performance of regression models will deteriorate as the dimension of the data increases. Machine learning models can deal with complicated relationships and noisy data. Elhenawy et al. [3] presented a data clustering and genetic programming approach to predict the travel time along freeways. Artificial neural network (ANN)[21], [22], [23] and support vector machine (SVM) [5], [24], [23], [25] are two most widely used machine learning models in bus time prediction. Kalman Filtering models rely on historical data.
      The prior work in this area has been primarily focused on
developing models for predicting delay as a short or long
term self-contained process. While some of the approaches
have studied the effect of traffic on the travel delay, to the
best of our knowledge the effect and comparisons of different facets at the same time are not studied side by side. In this paper, we present a models to understand the comparison of travel delays of different time frames, our project is different from the above described as it only focuses on the delays and informs the passenger on which bus should be taken for better time management, however, our future extension will look on other factors such as local events co-relations and will consider other models as our data collection continues.



METHODOLOGY 
The goal of this project focused on developing easy to use, but powerful and interactive visualization tools which displayed the delays of two Metropolitan Transportation Authority buses; M100 and M101. By the use of these visualizations the bus users can successfully time manage and determine which bus to take. 

Our interest laid in the City College students and the many users who ride on MTA buses every day. After retrieving the data from the MTA’s website, our approach was finalized on dealing with buses; M100 and M101, that are taken by City College students and many other users on daily bases. We then decided to move forward with the idea of how the students and many other users can efficiently manage their time once the delays times on these buses are known. To proceed with this idea, the first step was data mining. From the data provided by data mining a visualization with many models was created which included Open street map, Scattered line Plot, Line chart, Bubble chart, all which are explained in details. Our approach combines clustering analysis, T-test and P values analysis with a shared route segment model in order to produce more accurate delay time information. This information is then visualized with the help of different visualizations, each showing a unique property based upon which, analysis and results are being derived.

Data Mining

The data mining is an essential part of the project as all visualizations are built on it. The provided data from the MTA website consisted of 500 MB which included longitude, latitude, time_received, vehicle_id, distance_along_trip, inferred_phase, inferred_direction, inferred_route_id, inferred_trip_id, next_scheduled_stop_distance and next_scheduled_stop_id. This came out to be millions and millions of sets of data as it updated the bus movement every second, which made the process very tedious. The above attributes are the only ones used as they lead in determining the delays and help in discovering patterns for the visualizations. From this data we mined and calculated the average time delays. It also specifies the location and the time of the bus on google map. This data aide us in the following manner:

	We are able to visualize the position of the bus
	We can visualize the route of a specific bus ID.
	We are able to understand the delay of a bus.
	We are able to identify the number of buses allotted to run the specific route for that specific date.
	The total hours of delay made in the whole year/month/week/day.

As the whole project focused on buses M100 and M101, attributes only for these buses are considered. Excel was used for data mining. The process included creating various formulas in excel to successfully extract the delays calculated from one stop id to another. The first step included finding common stops between the two buses which was successfully done by using the built-in function Vlookup in excel. Next, delays from these stops were calculated for each bus and from these delays the sum of delays were calculated, with the help of the formulas. The following are the formulas used: 

	Delay:
IF(two next_scheduled_stop_id equal, sum_delay_by_id + delay, 0)

	 Sum Delay: 
IF(vehicle_id equal, IF(two next_scheduled_stop_id equal, ABS(time_recieved - previous time_recived),0,0)

These delays were later manually separated for purpose of having clean data sheets. The same was done for all other attributes of data. The final data consisted of longitude, latitude, time, Common Stop_id_name, Common Stop_ids, 16 vehicle ids for each bus, sum delay for each bus, average_wait for each bus, p-values, null hypothesis, alternative hypothesis, mean and variance. 

The challenges that we encountered with data mining were as the following:

	Coming up with sophisticated formulas to successfully extract the data needed.
	Manually finding common ids, as vlookup would delete necessary data.
	Manually separating the sum delays.

	Visualization and Participation

Statistical Analysis
The t-test  is any statistical hypothesis test in which the test statistic follows a Student's t-distribution under the null hypothesis. A t-test is most commonly applied when the test statistic would follow a normal distribution if the value of a scaling term in the test statistic were known. When the scaling term is unknown and is replaced by an estimate based on the data, the test statistics (under certain conditions) follow a Student's t distribution. The t-test can be used, for example, to determine if two sets of data are significantly different from each other.
After the data clean-up was done, based on the data that was provided, our team came up with a null hypothesis and an alternate hypothesis. Hypothesis testing is an essential procedure in statistics. A hypothesis test evaluates two mutually exclusive statements about a population to determine which statement is best supported by the sample data. Considering μ_A as the average wait time of M100 for all the common stops and μ_B as the average wait time for M101.

Null Hypothesis: The average wait time of M100 and M101 are equal.
i.e μ_A = μ_B

Alternate Hypothesis: The average wait time of M100 is not equal to the average wait time of M101.
i.e μ_A ≠ μ_B

Based on the data provided we can see that we were only able to calculate the average wait times of both the busses at certain stops and there was no sufficient data to calculates the variance. Hence in order to test our hypothesis we chose to do a two sample T-Test. The t-test was ran down using both excel and statistical language R. The reason to choose both platform was to make sure that the p-value we get from the test is accurate.
Excel: 
 Fig. 1.  T – Test on excel





R console:
 
Fig. 2.  T – Test on Console

From both the platforms we can see that the P- Value is 0.0158 which is less than 0.05. Hence, it rejects the null hypothesis. 
Now since our test proves the Alternate Hypothesis i.e μ_A ≠ μ_B our next step is to find whether μ_A > μ_B or μ_A < μ_B. For this we run simple calculation on the excel. The overall average is then calculated for all the common stops for each of the busses

    
Fig. 3.  Average wait time of M100 and M101 for all 27 stops

From the above figure we can see that the average wait time of M101 is greater than the average wait time of M100. This proves μ_A < μ_B, making M101 as our delayed bus and M100 as our alternate bus using the same route.

Interactive Visualization 

We also created a simple user preferred visualization for MTA Department of Bus through which the employees will be able to identify the root cause for the bus congestion and delays. Our Map portrays a visualization for the congestion route where the user can select the bus stops and see which bus is stopping at that bus stop. 

Selection of the marker on the map is also interactive with two other charts which shows the number of buses stopped at the specific stop and T – test value chart shows the hypothesis; details are provided in section 1. 

Along with this, the two buttons at the bottom of the main page represents visualizations including the bubble and line chart. The overall visualization can be seen in the following figure:

 
Figure 4. The overall visualization
If we click on the part labeled d; bubble chart button, the total delays of the two busses will appear together in the form of bubbles, and a total of three buttons will appear. The first button with heading “All delays” is the one which is displayed first, the button “Separate Buses” display the bubble chart splatted showing the delays of the individual buses. Lastly, the third button labeled, “Peak Time” displays a scatter plot of delays at peak times during a regular day. Details are provided in section d.

If we click on the part labeled e in the above diagram; a line chart showing the delays with respect to time of the day and stops would appear. The x-axis shows the time of the day while Y-axis represents the total delay time. It shows different stops, each with a different color based upon the intensity of delays. In addition, the stops are shown in the decreasing order of the delays with stops with more delays, on the top and the stops with less delays at the bottom. Moreover, there is a slider at the bottom of the visualization to change the time and zoom in and out of the visualization down to 15 minutes interval. Details are provided in section e.  
 
Figure 4a. The line chart -delay analysis for a day (Part e)
Open Street Map

We have two general categories of buses naming M100 and M101 each consisting 16 individual bus ids, and have 27 bus stops in common. The common bus stops are shown in the open street map using blue markers.

 
Fig. 5.  L – Shaped bus route consisting of 27 common stops

The update function in our code reads data from the bus data excel sheet using D3.js. Hovering over a certain bus stop marker changes the color of the marker to red and shows the user all the information that can be seen in the figure below. The tooltip in the figure is populated with the information from the excel sheet called bus data.

 
Fig. 6.  Tooltip information showing my hovering the mouse over a bus stop marker

When a user clicks an individual marker on the google map for a certain stop the color of the marker is changes to orange. The scattered line plot and the bar chart show information related to that selected stop.
 
Fig. 6.  Scattered Line plot and Bar chart for selected marker

On the figure above we can see that the user selected a certain bus stop marked in red color named E 125 st/ Lexington av, for that certain stop the scatter plot on the left shows 16 individual gray lines for both M100 and M101 representing the wait time of those bus ids at that stop. Any bus id sharing the same wait time is represented by one gray line. Hovering over it will show the tooltip consisting of all the ids for that gray line. The redline shows the average wait time of both the busses at that stop.

Below the scattered plot we can see a bar chart that of T – value test which give use the null Hypothesis. Below there are two more individual visualization which shows a more clear picture for the buses were assigned for the route on that specific day and the line chart gives a visualization for the delays in a time line.

 

Fig. 7. T- Value Test 

Scatter Line Plot
The purpose of this visualization is to compare the wait time lengths of two different bus lines. The two scatter line plots are stacked together to facilitate the comparison between the two bus lines.

 
Fig. 8 Scattered line plot representing wait time and average wait time of both M100 and M101 for E125 ST/ 3av 

The chart provides two concentrations for the readers to investigate the data: overview (gray lines) and details (red lines). The gray lines show the wait time length in minutes for multiple bus ids for a specific bus stop. The individual gray lines provide the interested audience a more detailed level of the distribution of the wait time lengths.
 
Fig. 9: Bus wait time of multiple bus id for M100

The red line shows their average wait time length. The red lines are chosen to appeal the audience's at the beginning, so they have a quick overview of the different wait time lengths between the two bus lines at that specific bus stop.

 
Fig. 10 Average wait time of M101 for E 125 st/ 3 av


T- value Bar Chart

Apart from the overall T-test, we had to perform T-value test for each individual stop. T-value test is a ratio of signal to noise, signals going to be numbers that tell us the difference between these two samples and noise is the number that acts as anomalies. 

Equation:
 
Where 〖S1〗^2 is the standard deviation[ how far data is spread from the mean].
In order to get lower T-value, which gives us more noise, we increase the variance by squaring it. i.e 〖S1〗^2.
The 〖n1〗^2& 〖n2〗^2 represents the number of samples we are taking for each criterion. These samples are visualized in the scattered line plot. And an increase in the number of samples, will increase the signal up to the desired point. So, the difference between the mean will give us more signal i.e higher T value and increasing that variability is going to give us less signal i.e decreased T-value. To perform t-value test for each stop we consider our null hypothesis as 

 

 
Fig. 11 T and P values for degrees of freedom


From the above chart we identify the critical value (marked as red), which is 2.12. When the t-value is greater than 2.12 we reject our null hypothesis. And if the t-value is less than 2.12 we reject our alternative hypothesis.
We perform a two-tail t-test for individual stops as well. Generally, the standard p-value for comparison is considered to be 0.05. This means that if we do the test on these samples 100 times, then 95% of the times we would reject the null hypothesis and only 5% of the time we accept it. To find the t-value when p value = .05, we need to calculate the degrees of freedom . The formula is given below,

 
In our case df=16. For visualizing the results of our calculation, we are using a bar chart. When a marker for a specific stop is clicked a comparison is done to check if we reject the null hypothesis for this stop or not. If the null hypothesis is accepted, then at the top of the bar chart it will show that it is safe to take any bus at this stop and the bar color will turn green.
 
Fig. 12  Acceptance of null hypothesis.

But through comparison if a certain stop rejects the null hypothesis then the bas color will turn red and it will show the user which bus should be taken at that specific stop.
 
Fig. 13 Rejection of null hypothesis

Bubble Chart for Weekly Delay:
The bubble chart is a user-friendly visualization which focuses on showing user the delays at each stop for the two buses: M100, M101. This model consists of three interactive visualizations. The three parts are given a button, and upon clicking these buttons the user can access these visualizations. The tree parts include: “All Delays” (figure 14), “Delay by Separate Bus”; (figure 15), and “Delays at Peak Hours” ;(figure 16). In general, the blue and pink bubbles represent M101 and M100 respectively, the bigger bubbles represent a larger delay and vice versa. This model is inspired and built on from the works of Jim Vallandingham [26] and Michael Currie [27]. 
The data sets that we used in creating this model were taken from the provided clean data sheet. The data used in the model included many attributes such as common_stop_id_name, average_wait and time_received. This model was constructed using HTML, D3.js and JavaScript. This model consists of three interactive visualizations. 

In the “All Delays” section, the delays for the two buses are shown at each stop. By taking a glance at this visualization the user can quickly determine which bus to take by observing the delays in each bus. For further convenience a mouseover is placed, so the user can precisely know the bus, delay in seconds, the time the delay took place and the current location. This is shown in the following figure: 
 
 
Fig. 14: The “All Delays” part of the Bubble Chart

In the “Delay by Separate Bus”, the bubble chart is spilt which clearly shows the delays in the two buses. By this the user can easily compare which bus is having heavy delays, through which better time management can be applied. For further convenience a mouseover is placed, so the user can precisely know the bus, delay in seconds, the time the delay took place and the current location. This is shown in the following figure:
 
Fig. 15: The “Delay by Separate Bus” part of the Bubble Chart

The last aspect of this model consists of “The Delay at Peak Hours”, which is a scatter bubble plot. This model informs the user the times throughout the day where most delays take place. From this piece of information, the user can practice better time management by taking alternative bus route. For further convenience a mouseover is placed, so the user can precisely know the bus, delay in seconds, the time the delay took place and the current location. This is shown in the following figure:
 
Fig. 16: The “Delays at Peak Hours” part of the Bubble Chart

Line graph for a day delays

We also have a small visualization model that explores the historical bus delay patterns of arrival time delay at different time of the day and travel time delay for all route segments. Our approach uses clustering methods which allows the decision support system to provide typical delay information clustered based on time of day and eventually other features to users and city planners.

The data set that we used specifically for this visualization model was derived from the main data set provided, however, since this visualization focuses on few things so our emphasis was to includes Bus scheduling dataset: static transit data in Time point dataset, historical data of the buses at times, including bus ID, route ID, trip ID, actual departure and arrival time, dwell time. These data sets were then cleaned to get the desired results using the excel formulas. Bus delay at a single bus stop is the difference between the scheduled arrival time and the actual arrival time. A negative delay indicates that the bus is ahead of the schedule. There is a limitation to the accuracy of the delay since data are collected at discrete time intervals. We are more interested in the variance in delay than in the average delay. On average, buses arrive at this stop about 2.6 minutes ahead of schedule. The standard deviation is about 3.5 minutes. Similar analysis has been used for other stops. It should be noted that a large standard deviation of the actual arrival time would make the delay results of the arrival time more attractive to the passengers if the error range of the prediction is sufficiently small. Next, we select a pair of stops and examine the delay correlation of a bus at these stops. Delays at the stops are plotted for 100 bus ids of M100 and M101 combined, in which each line represents a record for a single stop. More than half of their route segments are shared by each other which makes the analysis easier. It is interesting to note that drivers tend to leave the first stop at a time later than the scheduled departure time, but are able to pick up some time on their way to the second stop so that they arrive at the second stop ahead of schedule. This may be attributed to a large built-in slack time embedded in the bus schedule.

This model of line graph is built using HTML and D3.js function. The purpose of building this visualization was to show the intensity of the delays and to visualize the delay time and compare them using different colors. This line graph showed the delays accurately down to 2 mins’ interval. Different colors were used from light to dark to show the intensity of the delays. The x-axis shows the time of the day with a drag able ruler to change the time, as shown in figure, and y axis shows the delay time in seconds. The stops with highest delays are shown on the top and then with darker colors and the stops with less delays are shown at the bottom with the lighter colors. In addition, the cursor on the line will change the delays time depending on which stop and what time of the day, the cursor is being pointed at.
 
Fig. 17 Timeline with the slider on it

The analysis of this visualization provided an overall outlook on delays at different stops at different time of the day and gave us an insight on how these delays are being changed during different times of the day. From our analysis of this visualization, we realized that the delays times show consistent behavior during the rush hours of the day and went down during the off-peak hours.
 
Fig. 17a Stops showing peak hour delay rises

 In addition, some of the stops like Broadway and 192nd street shows relatively higher delays throughout the day. In addition, we also observed that the performance increase began to taper out as the length of time window was further increased. If length of the time window was dragged smaller than 120 minutes, the curves of our model almost become flat lines, shown in figure 18. This indicates that only data greater than 120 minutes before the current time is important for delays. This is important because calculating and smoothing the delays from previous trips using Filters is exclusive, especially when the computation is done for all the stops in the transit network. Using a smaller time window reduced the overhead.
 
Fig. 18. A zoomed in view of the Line graph


Conclusion
In this paper, we introduced different visualizations for short-term prediction of bus delays. The system used bus position data, time of the day, bus ids and historical arrival and departure data - available for selected stops to show bus delay time. Our approach combined clustering analysis, T-test and P values analysis with a shared route segment model in order to produce more accurate delay time information. This information was successfully shown with the help of different visualizations, each showing a unique property. One aspect that our project does not cover and what we would may further work on is showing the delays for each individual day.

References
[1] P. Poudenx, “The effect of transportation policies on energy consumption and greenhouse gas emission from urban passenger transportation,” Transportation Research Part A: Policy and Practice, vol. 42, no. 6, pp. 901–909, 2008.
[2] “Top reasons people stop using public transit,” http://www.governing. com/blogs/view/gov-reasons-riders-abandon-public-transit.html. 
[3] M. Elhenawy, H. Chen, and H. A. Rakha, “Dynamic travel time prediction using data clustering and genetic programming,” Transportation Research Part C: Emerging Technologies, vol. 42, pp. 82–98, 2014. 
[4] J. Patnaik, S. Chien, and A. Bladikas, “Estimation of bus arrival times using apc data,” Journal of public transportation, vol. 7, no. 1, p. 1,2004.
[5] C.-H. Wu, J.-M. Ho, and D.-T. Lee, “Travel-time prediction with support vector regression,” Intelligent Transportation Systems, IEEE Transactions on, vol. 5, no. 4, pp. 276–281, 2004 
[9] M. D. Abkowitz and I. Engelstein, “Factors affecting running time on transit routes,” Transportation Research Part A: General, vol. 17, no. 2, pp. 107–113, 1983.
[10] T. Kimpel, “Time point-level analysis of transit service reliability and passenger demand, urban studies and planning,” Portland, OR: Portland State University, p. 154, 2001.
[11] J. Surprenant-Legault and A. El-Geneidy, “Introduction of reserved bus lane: Impact on bus running time and on-time performance,” Transportation Research Record: Journal of the Transportation Research Board, no. 2218, pp. 10–18, 2011.
[12] B. P. Sterman and J. L. Schofer, “Factors affecting reliability of urban bus services,” Journal of Transportation Engineering, vol. 102, no. ASCE# 11930, 1976.
[13] R. Camus, G. Longo, and C. Macorini, “Estimation of transit reliability level-of-service based on automatic vehicle location data,” Transportation Research Record: Journal of the Transportation Research Board, no. 1927, pp. 277–286, 2005.
[14] M. Saberi, K. Ali Zockaie, W. Feng, and A. El-Geneidy, “Definition and properties of alternative bus service reliability measures at the stop level,” Journal of Public Transportation, vol. 16, no. 1, 2013.
[15] J. Lin, P. Wang, and D. T. Barnum, “A quality control framework for bus schedule reliability,” Transportation Research Part E: Logistics and Transportation Review, vol. 44, no. 6, pp. 1086–1098, 2008.
[16] S. Gilmore, M. Tribastone, and A. Vandin, “An analysis pathway for the quantitative evaluation of public transport systems,” in Integrated Formal Methods. Springer, 2014, pp. 71–86.
[17] J. Bates, J. Polak, P. Jones, and A. Cook, “The valuation of reliability for personal travel,” Transportation Research Part E: Logistics and Transportation Review, vol. 37, no. 2, pp. 191–229, 2001.
[18] A. Abdelfattah and A. Khan, “Models for predicting bus delays,” Transportation Research Record: Journal of the Transportation Research Board, no. 1623, pp. 8–15, 1998.
 [19] B. M. Williams and L. A. Hoel, “Modeling and forecasting vehicular traffic flow as a seasonal arima process: Theoretical basis and empirical results,” Journal of transportation engineering, vol. 129, no. 6, pp. 664– 672, 2003.
[20] R. Jeong and L. R. Rilett, “Bus arrival time prediction using artificial neural network model,” in Intelligent Transportation Systems, 2004. Proceedings. The 7th International IEEE Conference on. IEEE, 2004, pp. 988–993.
[21] M. Chen, X. Liu, J. Xia, and S. I. Chien, “A dynamic bus-arrival time prediction model based on apc data,” Computer-Aided Civil and Infrastructure Engineering, vol. 19, no. 5, pp. 364–376, 2004.
[22] R. H. Jeong, “The prediction of bus arrival time using automatic vehicle location systems data,” Ph.D. dissertation, Texas A&M University, 2005.
[23] B. Yu, W. H. Lam, and M. L. Tam, “Bus arrival time prediction at bus stop with multiple routes,” Transportation Research Part C: Emerging Technologies, vol. 19, no. 6, pp. 1157–1170, 2011.
[24] Y. Bin, Y. Zhongzhen, and Y. Baozhen, “Bus arrival time prediction using support vector machines,” Journal of Intelligent Transportation
[25] C. Bai, Z.-R. Peng, Q.-C. Lu, and J. Sun, “Dynamic bus travel time prediction models on road with multiple bus routes,” Computational intelligence and neuroscience, vol. 2015, p. 63, 2015.
[26] Jim Vallandingham, “Jim Vallandingham,” A Data Driven Exploration of Kung Fu Films. [Online]. Available: http://vallandingham.me/bubble_charts_in_js.html. [Accessed: 15-Nov-2018].
[27] Michael Currie, “MichaelCurrie/bubble_chart,” GitHub, 21-Nov-2016. [Online]. Available: https://github.com/MichaelCurrie/bubble_chart. [Accessed: 19-Nov-2018].












Directions to run the project:
	Download Atom
	Go to File > Add project folder
	Add the folder(Senior_design_Archive) containing all the extracted file included with the project.
	When initialized correctly all the files will show on the left panel.
	Go to Packages for the menu bar and select atom-live-server and click start server
	The project will start in a default webpage.
	The extracted files can also be run on the browser without any software by simply selecting the file names Index.
	If Atom is unable, one can use Microsoft Edge/Firefox to run the project, simply by clicking on the index file, and selecting run on Firefox.



