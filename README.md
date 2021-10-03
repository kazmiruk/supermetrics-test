# supermetrics-test

## Configuration

All required configurations variables are in `.env` file. It already contains defaults to run server without additional changes 

## Commands

- `docker-compose up dev` - start dev environment with exposing PORT (by default 8080). It uses nodemon to make development process easier
- `docker-compose run test` - run unit tests

**No production setup is provided**

## How it works

Since one of the requirements for the task was to make code maintainable, extensible and remember about performance I chose map-reduce-combine approach to implement flexible logic. Additionally it allows to process all pages simultaniously and reduce results later (and it's quite easy to scale map stage horizontally).

Main class for the logic is `StatsAggregator` which performs requesting of pages and iterating over responses.

This class can be configured with different processors (class which implements `Processor` interface).

`StatsAggregator` has 3 stages. During the first stage (`map`) it calls `map` method of each processor to map post information into some raw statistic information which is ready for post-processing.

After the `map` stage we have raw statistic object for each page which contains all required information for the last stage. But before this we need to merge all result into one object.

For this `StatsAggregator` calls `reduce` method of processors and merges results (processors know how to merge different raw data: take maximum from both, or multiply them, or something else) of all pages into one object.

At the moment we have all require data in one object (relatively small because raw stats aggregated data for each page already) and now we just need to convert the object from raw data into some more readable for user format.

`StatsAggregator` calls combine method of processors, and these methods know how to convert raw data into something else (amount of posts and amount of users into average number of posts per user for example).

**If you want to add one more processor and gather some more stat from the list of post - just implement new processor which will follow `Processor` interface.**

## TODO

During the implementation I decided not to focus on not too important things and the code still has a lot of places need to be improved:

- Error handling
- Not a strict type validation for dynamic stats objects
- Failover logic for tokens (I suppose that nothing can happen with it during 1 hour)
- e2e tests to check the whole pipeline
- ...

**These still can be implemented but unfortunately then it will take more time than test assigment suposes. But let's discuss if you think something was missed by me.** 
