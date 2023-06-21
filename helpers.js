const moment = require("moment");

/**
 * Base Identifier Class, generates a string identifier
 * Format XXX-XXX-XXX where each X is a random character from [1-9A-Z].
 */
class Identifier {
  static availableCharacters = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  constructor(length) {
    let id = "";
    let characterInProcess = 0;

    while (characterInProcess < length) {
      const randomIdx = Math.floor(
        Math.random() * Identifier.availableCharacters.length
      );

      id += Identifier.availableCharacters[randomIdx]

      const nextCharacter = characterInProcess + 1
      if (nextCharacter%3 === 0 && nextCharacter !== length){
        id += "-"
      }

      characterInProcess++;
    }
    this.value = id;
  }
}

/**
 * 
 * @param {string[]} PIDs Array of the occupied IDs for csv
 * @returns {string} Unique identifier for the current csv
 */
const generatePID = (PIDs) => {
  //PIDs for patient have 9-characters length
  const PIDLength = 9;

  let isPIDUnique = true;
  let PID = new Identifier(PIDLength);
  while (isPIDUnique) {
    // There is a very small chance that generated id can be non-inique
    // in this case we want to create a new one
    if(PIDs.includes(PID.value)) {
      PID = new Identifier(PIDLength);
    } else {
      isPIDUnique = false
    }
  }
  return PID.value;
}
/**
 * Small helper to calculate the age from the date of birth
 * @param {str} dateOfBirthStr date of birth in "yyyy-mm-dd" format
 * @returns age
 */
const calculateAge = (dateOfBirthStr) => {
  if (!dateOfBirthStr) {
    return null;
  }
  const today = moment(new Date());
  const dateOfBirth = moment(dateOfBirthStr);

  if (dateOfBirth > today) {
    return null;
  }

  return today.diff(dateOfBirth, 'years');
}

module.exports = {
  calculateAge,
  generatePID,
}