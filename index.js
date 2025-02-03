import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

const factCache = new Map();
const TIMEOUT_MS = 5000;
axios.defaults.timeout = TIMEOUT_MS;

app.use(cors());
app.use(express.json());

const isArmstrong = (num) => {
    if (num < 0) return false;
    const digits = String(num).split('');
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(parseInt(digit), power), 0);
    return sum === num;
};

const isPrime = (num) => {
    if (num <= 1) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
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
    if (num < 0 || !Number.isInteger(num)) return 0;
    return String(Math.abs(num))
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit), 0);
};

const getProperties = (num) => {
    const properties = [];
    
    if (isArmstrong(num)) {
        properties.push('armstrong');
    }
    
    properties.push(num % 2 === 0 ? 'even' : 'odd');
    
    return properties;
};

async function getNumberFact(number) {
    try {
        if (factCache.has(number)) {
            return factCache.get(number);
        }

        const response = await axios.get(`http://numbersapi.com/${number}/math`);
        const fact = response.data;
        factCache.set(number, fact);
        return fact;
    } catch (error) {
        let fact = `${number} `;
        const properties = [];
        
        if (isPrime(number)) properties.push('is a prime number');
        if (isPerfect(number)) properties.push('is a perfect number');
        if (isArmstrong(number)) properties.push('is an Armstrong number');
        
        fact += properties.length > 0 ? 
            properties.join(' and ') : 
            `is ${number % 2 === 0 ? 'an even' : 'an odd'} number`;
            
        return fact;
    }
}

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Number Classification API",
        usage: {
            endpoint: "/api/classify-number",
            method: "GET",
            parameter: "number",
            example: "/api/classify-number?number=371"
        },
        examples: {
            prime_numbers: [2, 3, 5, 7, 11, 13, 17, 19],
            perfect_numbers: [6, 28, 496, 8128],
            armstrong_numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 153, 370, 371, 407]
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
    });
});

app.get('/api/classify-number', async (req, res) => {
    const numberStr = req.query.number;
    
    if (!numberStr || isNaN(numberStr)) {
        return res.status(400).json({
            number: numberStr,
            error: true
        });
    }

    const number = parseInt(numberStr);

    try {
        const response = {
            number,
            is_prime: isPrime(number),
            is_perfect: isPerfect(number),
            properties: getProperties(number),
            digit_sum: getDigitSum(number),
            fun_fact: await getNumberFact(number)
        };

        res.json(response);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            number: number,
            error: true,
            message: 'Error processing request'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});