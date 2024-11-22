const User = require('../Models/Users.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {

  // Helper functions
  isValidBase64 = (base64String) => {
    try {
      const buffer = Buffer.from(base64String, 'base64');
      return buffer.toString('base64') === base64String;
    } catch {
      return false;
    }
  };

  getFileDetails = (base64String) => {
    if (!base64String || !isValidBase64(base64String)) {
      return { file_valid: false, file_mime_type: null, file_size_kb: null };
    }

    const buffer = Buffer.from(base64String, 'base64');
    return {
      file_valid: true,
      file_mime_type: 'application/octet-stream', // Default MIME type (adjust as needed)
      file_size_kb: (buffer.length / 1024).toFixed(2), // File size in KB
    };
  };

  isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  extractNumbers = (arr) => arr.filter((item) => !isNaN(Number(item))).map(Number);
  extractAlphabets = (arr) => arr.filter((item) => /^[a-zA-Z]$/.test(item));
  highestLowercaseAlphabet = (arr) => {
    const lowercases = arr.filter((item) => /^[a-z]$/.test(item));
    return lowercases.length ? [lowercases.sort().reverse()[0]] : [];
  };

  // POST route
  postReq = (req, res) => {
    const { fullName, dob, collegeEmailId, collegeRollNumber, inputArray, base64File } = req.body;

    // Validate mandatory fields
    if (!fullName || !dob || !collegeEmailId || !collegeRollNumber || !Array.isArray(inputArray)) {
      return res.status(400).json({
        is_success: false,
        message: 'Missing required fields: fullName, dob, collegeEmailId, collegeRollNumber, or inputArray.',
      });
    }

    // Generate user_id
    const userId = `${fullName.toLowerCase().replace(/\s+/g, '_')}_${dob.replace(/-/g, '')}`;

    // Process inputArray
    const numbersArray = extractNumbers(inputArray);
    const alphabetsArray = extractAlphabets(inputArray);
    const highestLowercase = highestLowercaseAlphabet(inputArray);
    const hasPrimeNumber = numbersArray.some((num) => isPrime(num));

    // Handle file
    const fileDetails = getFileDetails(base64File);

    // Response
    res.json({
      is_success: true,
      user_id: userId,
      college_email_id: collegeEmailId,
      college_roll_number: collegeRollNumber,
      numbers_array: numbersArray,
      alphabets_array: alphabetsArray,
      highest_lowercase_alphabet: highestLowercase,
      contains_prime_number: hasPrimeNumber,
      file_details: fileDetails,
    });
  }

  getReq = (req, res) => {
    // Response with hardcoded JSON
    res.status(200).json({
      operation_code: 1,
    });
  }
}
module.exports = new AuthController();
