const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
console.log(dotenv.config());
dotenv.config();

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
