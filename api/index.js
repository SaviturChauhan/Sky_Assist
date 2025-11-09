// Vercel serverless function handler for Express app
// This is a deployment adapter - it's at root level because Vercel requires it here
// Your actual backend code is in Backend/ directory

const app = require("../Backend/server");

module.exports = app;

