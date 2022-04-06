const express = require('express');
const app = express();

function limitRequests(perSecond, maxBurst) {
    const bucket = new TokenBucket(maxBurst, perSecond);

    // Return an Express middleware function
    return function limitRequestsMiddleware(req, res, next) {
        if (bucket.take()) {
            next();
        } else {
            res.status(429).send('Rate limit exceeded');
        }
    }
}


app.get('/',
    limitRequests(5, 10), // Apply rate limiting middleware
    (req, res) => {
        res.send('Hello from the rate limited API');
    }
);

app.listen(3000, () => console.log('Server is running'));