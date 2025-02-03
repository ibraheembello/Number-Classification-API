import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Add caching for Numbers API responses
const factCache = new Map();

// Add timeout for external API calls
const TIMEOUT_MS = 5000;
axios.defaults.timeout = TIMEOUT_MS;

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

// Optimized number fact fetching with caching and fallback
async function getNumberFact(number) {
    try {
        // Check cache first
        if (factCache.has(number)) {
            return factCache.get(number);
        }

        const response = await axios.get(`http://numbersapi.com/${number}/math`);
        const fact = response.data;
        
        // Cache the result
        factCache.set(number, fact);
        
        return fact;
    } catch (error) {
        // Fallback fact if API fails or times out
        return `${number} is ${isPrime(number) ? 'a prime number' : 'not a prime number'} and ${number % 2 === 0 ? 'is even' : 'is odd'}`;
    }
}

// Root route
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Number Classification API",
        usage: {
            endpoint: "/api/classify-number",
            method: "GET",
            parameter: "number",
            example: "/api/classify-number?number=371"
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main route with optimizations
app.get('/api/classify-number', async (req, res) => {
    const start = Date.now(); // Track response time
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
        // Calculate properties first (synchronous operations)
        const properties = getProperties(number);
        const isPrimeNumber = isPrime(number);
        const isPerfectNumber = isPerfect(number);
        const digitSum = getDigitSum(number);

        // Then fetch fact (asynchronous operation)
        const funFact = await getNumberFact(number);

        const response = {
            number,
            is_prime: isPrimeNumber,
            is_perfect: isPerfectNumber,
            properties,
            digit_sum: digitSum,
            fun_fact: funFact,
            response_time_ms: Date.now() - start
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