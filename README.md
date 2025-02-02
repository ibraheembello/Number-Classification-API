Number Classification API
A RESTful API that analyzes numbers and returns their mathematical properties along with interesting facts.
Features

Number classification (prime, perfect, Armstrong)
Mathematical properties analysis
Digit sum calculation
Integration with Numbers API for fun mathematical facts
CORS enabled
JSON response format

Prerequisites

Node.js (v14 or higher)
npm (Node Package Manager)

Installation

Clone the repository:

bashCopygit clone <your-repository-url>
cd number-classification-api

Install dependencies:

bashCopynpm install express cors axios

Start the server:

bashCopynpm start
For development with auto-reload:
bashCopynpm run dev
API Documentation
Classify Number
Returns mathematical properties and fun facts about a given number.

URL: /api/classify-number
Method: GET
URL Params:

Required: number=[integer]

Success Response

Code: 200 OK
Content Example:

jsonCopy{
"number": 371,
"is_prime": false,
"is_perfect": false,
"properties": ["armstrong", "odd"],
"digit_sum": 11,
"fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}
Error Response

Code: 400 BAD REQUEST
Content Example:

jsonCopy{
"number": "alphabet",
"error": true
}
Properties Explained

Armstrong Number: A number that equals the sum of its own digits raised to the power of the number of digits
Perfect Number: A positive integer that equals the sum of its proper divisors
Prime Number: A number greater than 1 that is only divisible by 1 and itself
Digit Sum: The sum of all digits in the number

Testing
You can test the API using tools like Postman or curl:
bashCopy# Test with valid number
curl http://localhost:3000/api/classify-number?number=371

# Test with invalid input

curl http://localhost:3000/api/classify-number?number=abc
Property Combinations
The API returns different combinations of properties based on the number:

["armstrong", "odd"] - Armstrong numbers that are odd
["armstrong", "even"] - Armstrong numbers that are even
["odd"] - Non-Armstrong odd numbers
["even"] - Non-Armstrong even numbers

Error Handling

The API validates input and returns appropriate error messages
Handles non-numeric inputs with 400 Bad Request
Manages external API failures gracefully

Dependencies

Express.js - Web framework
CORS - Cross-Origin Resource Sharing middleware
Axios - HTTP client for external API requests

License
This project is licensed under the MIT License - see the LICENSE file for details.
