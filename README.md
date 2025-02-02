# Number Classification API

[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A RESTful API that analyzes numbers and returns their mathematical properties along with interesting facts.

## Features

- ✨ Number classification (prime, perfect, Armstrong)
- 📊 Mathematical properties analysis
- 🔢 Digit sum calculation
- 🎯 Integration with Numbers API
- 🌐 CORS enabled
- 📝 JSON response format

## Quick Start

```bash
# Clone the repository
git clone https://github.com/ibraheembello/Number-Classification-API.git
cd number-classification-api

# Install dependencies
npm install

# Start the server
npm start

# Development mode with auto-reload
npm run dev
```

## API Usage

### Classify Number

```bash
GET /api/classify-number?number={integer}
```

#### Example Request

```bash
curl http://localhost:3000/api/classify-number?number=371
```

#### Example Response

```json
{
  "number": 371,
  "is_prime": false,
  "is_perfect": false,
  "properties": ["armstrong", "odd"],
  "digit_sum": 11,
  "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}
```

## Properties

| Property  | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| Armstrong | Sum of digits raised to power of number of digits equals the number |
| Perfect   | Sum of proper divisors equals the number                            |
| Prime     | Only divisible by 1 and itself                                      |
| Digit Sum | Sum of all digits in the number                                     |

## Error Handling

- Input validation with descriptive error messages
- 400 Bad Request for non-numeric inputs
- Graceful handling of external API failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
