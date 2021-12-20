const cors = require('cors');
const request = require('request');
const express = require('express');


const CLIENT = 'AQX9vJhSkyNrGasUCsyw4jyHB5QhIEY84f6qZw0qxUOYBF69EQfs5bU8l5HwgZc9lGnqwgbmuFezv8hX'
const SECRET = 'EOQ1eS7AeMqPBtvYhh0GfUFQwEYn_bJHbveTn3OLrEfV-qdppwH3nR-jdkGCaFZf8ygzjRVmTrk-dIBe'
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'


const auth = {user: CLIENT, pass: SECRET}

