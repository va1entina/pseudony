const fs = require("fs");
const csv = require("fast-csv");
const archiver = require("archiver");
const PassThrough = require("stream").PassThrough;

const helpers = require("./helpers");

// *TODO* Add a proper error handling
const anonymise = (res, files) => {
  console.log(files)
  const piiColumns = ["PID", "First name", "Last name", "Date of birth"];
  const healthColumns = ["PID", "Weight", "Blood group"];

  const uploadedFileReadStream = fs.createReadStream(files, "utf-8");
  const csvOptions = { headers: true };

  uploadedFileReadStream.on('open', () => {
    res.attachment('pseudonymised-patient-data.zip');

    // Preparing a stream for splitting our CSV on 2 files with generating PID for each row
    const occupiedPIDs = [];
    const patientDataEnrichedByPIDStream = csv.format(csvOptions).transform((row, next) => {
      const PID = helpers.generatePID(occupiedPIDs);
      // pull generated PID into memory in order to check uniqueness
      // during new PID generation process
      occupiedPIDs.push(PID);
      next(null, {["PID"]: PID, ...row});
    });

    uploadedFileReadStream.pipe(csv.parse(csvOptions)).pipe(patientDataEnrichedByPIDStream);

    // creating a new stream for formatting PII data for pii.csv
    const piiStream = new PassThrough();
    patientDataEnrichedByPIDStream.
      pipe(csv.parse(csvOptions)).
      pipe(csv.format(csvOptions)).
      transform(function(row, next){
        const result = {};
        piiColumns.forEach((column) => {
          result[column] = row[column]
        });
        next(null, result)
      }).
      pipe(piiStream);

    // creating a new stream for extracting health data for health.csv
    const healthStream = PassThrough()    
    patientDataEnrichedByPIDStream.
      pipe(csv.parse(csvOptions)).
      pipe(csv.format(csvOptions)).
      transform(function(row, next){
        const result = {}
        healthColumns.forEach((column) => {
          result[column] = row[column]
        })
        result["Age"] = helpers.calculateAge(row["Date of birth"]);
        next(null, result)
      }).
      pipe(healthStream);
    
    // As there are 2 files in the output - packing them into a zip to return in the response both
    const archive = archiver('zip', {
      gzip: true,
      zlib: { level: 9 }
    });

    archive.append(piiStream, { name: 'pii.csv' });
    archive.append(healthStream, { name: 'health.csv' });
    archive.finalize();
    archive.pipe(res);

    uploadedFileReadStream.on('error', err => {
      next(err);
    });
  });
};


module.exports = {
  anonymise,
}
