import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions
const isArmstrong = (num) => {
    const digits = String(num).split('');
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), power), 0);
    return sum === num;
};

const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const isPerfect = (num) => {
    if (num <= 1) return false;
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num;
};

const getDigitSum = (num) => {
    return String(num)
        .split('')
        .reduce((acc, digit) => acc + Number(digit), 0);
};

const getProperties = (num) => {
    const properties = [];
    
    if (isArmstrong(num)) {
        properties.push('armstrong');
    }
    
    properties.push(num % 2 === 0 ? 'even' : 'odd');
    
    return properties;
};

// Main route
app.get('/api/classify-number', async (req, res) => {
    const numberStr = req.query.number;
    
    // Input validation
    if (!numberStr || isNaN(numberStr)) {
        return res.status(400).json({
            number: numberStr,
            error: true
        });
    }

    const number = parseInt(numberStr);

    try {
        // Fetch fun fact from Numbers API
        const factResponse = await axios.get(`http://numbersapi.com/${number}/math`);
        const funFact = factResponse.data;

        const response = {
            number,
            is_prime: isPrime(number),
            is_perfect: isPerfect(number),
            properties: getProperties(number),
            digit_sum: getDigitSum(number),
            fun_fact: funFact
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching fun fact:', error);
        res.status(500).json({
            number: number,
            error: true,
            message: 'Error fetching number facts'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});