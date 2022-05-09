# Uphold interview solution

## Prerequisites

1. Clone project from github [uphold solution](https://github.com/gibsong/uphold)


##Options
The solution can be run via Docker or as stand alone processes.

### Docker

1. [Install Docker Desktop](https://docs.docker.com/get-docker/)
2. Open Docker Desktop
3. Open terminal / command line
4. Change to projects top level directory, which is named `uphold` 
5. run cmd: `docker-compose up`
6. open web browser and navigate to [http://localhost:3000/](http://localhost:3000/)
7. Shutdown options:
    1. Type `control c` from the terminal that is running application
    2. From a different terminal run cmd: `docker-compose down`

### Stand Alone

#### Backend Server
   
1. Open terminal / command line 
2. Navigate to the projects top level folder named: `uphold`
3. Then change to the `server` folder
4. Get dependencies, run command: `npm install`
5. run command: `npm start`
6. The server will startup listening for requests on port 9000
7. Use `control c` to shutdown

#### Front End React
    
1. Open terminal / command line 
2. Navigate to the projects top level folder named: `uphold`
3. Get dependencies, run command: `npm install`
4. run command: `npm start`
5. Open web browser and go to url: http://localhost:3000/

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
