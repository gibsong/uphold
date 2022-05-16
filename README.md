# Uphold interview solution

This solution includes the implemenation of all three phases: mandatory, optional and bonus 

### Running the solution

1. [Install Docker Desktop](https://docs.docker.com/get-docker/)
2. Open Docker Desktop
3. Open terminal / command line
4. Clone project from github [uphold solution](https://github.com/gibsong/uphold)
5. Set environment variables:
    1.  export POSTGRES_HOST=postgres_c
    2.  export HISTORY_HOST=history
6. Change to projects top level directory, which is named `uphold` 
7. Run cmd: `docker-compose up`
    1.  Be patient this will take a few minutes.
    2.  The application with historical prices will be ready once you see 'inserted 436 rows' about 12 times.
    3.  Every five minutes you will also see a scavenger run which cleans up old records  
8. Open web browser and navigate to [http://localhost:3000/](http://localhost:3000/)
9. Shutdown options:
    1. Type `control c` from the terminal that is running the application
    2. From a different terminal run cmd: `docker-compose down`


## Using the application

There are 3 configuration options:
1. Price Threshold - change the value in the text box and it will automatically update on the graph.
2. Currency Pair - Select a currency pair from the drop down list and it will automatically update the linear chart.
3. Interval - select the desired time interval and then click the Update button and it will fetch at the new interval.

## Running the tests

1. Open terminal / command line 
2. Navigate to the projects top level folder named: `uphold`
3. Then change to the `server` folder
4. run command: `npm test`
