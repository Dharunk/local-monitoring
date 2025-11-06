const express = require('express');
const client = require('prom-client');


const app = express();
const register = client.register;


// Create custom metrics
const requestCounter = new client.Counter({
name: 'sampleapp_requests_total',
help: 'Total number of requests received'
});


const processingGauge = new client.Gauge({
name: 'sampleapp_processing_time_seconds',
help: 'Simulated processing time in seconds'
});


// Simulate some workload updates
setInterval(() => {
requestCounter.inc(Math.floor(Math.random() * 5));
processingGauge.set(Math.random() * 2);
}, 5000);


app.get('/metrics', async (req, res) => {
try {
res.set('Content-Type', register.contentType);
res.end(await register.metrics());
} catch (ex) {
res.status(500).end(ex);
}
});


app.get('/', (req, res) => {
requestCounter.inc();
res.send('Hello from sample app — visit /metrics for Prometheus metrics');
});


const port = 3001;
app.listen(port, () => console.log(`App listening on :${port}`));