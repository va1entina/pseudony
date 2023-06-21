## Acceptance criteria

- [x] Write a script that generates the two files as explained above from patients.csv (you can use any programming language & you may use any open source libraries you like)
- [x] Write at least 2 unit tests for relevant parts of your code, and include instructions for how to run the unit tests as well
- [x] Push your completed code to this GitHub repo and let us know you're done - we will set up a chat with you to discuss your code
#### Not finished
- [] Include instructions for running the script for somebody who knows nothing about the code


## Description

Pseudonymisator of the health data by splitting the CSV files with an expected structure into two separate CSV files:

- pii.csv: Contains only the PII columns from patients.csv (first name, last name, date of birth), plus a new column containing a pseudo-ID (PID) for each patient. A PID is string of the format XXX-XXX-XXX where each X is a random character from the class [1-9A-Z] (example PID: 4SK-SWY-2NW).
- health.csv: Contains only the health data columns (weight, blood group), plus a new columns of PIDs such that corresponding rows between the two CSV files have matching PIDs, plus a column for the patient's current age. The current age is calculated based on a patient's date of birth.

## Running the application
The app is written with NodeJS, we expect that the last versions of Node and npm should are installed for running the project. You can find a guide [here](https://nodejs.dev/en/learn/how-to-install-nodejs/).

```
// installing the dependencies 
npm install

// running the app
npm run devStart

```

The service will be run on http://localhost:3000 and returns a very basic html to upload your CSV.