const http = require('http');
const url = require('url');
const { newsHandler } = require('./api/news');

require('dotenv').config();

const port = process.env.PORT || 3000;

http
  .createServer(function (req, res) {
    const parsedUrl = url.parse(req.url);
    if (req.method === 'GET' && parsedUrl.pathname === '/') {
      newsHandler(req, res);
      return;
    }
    res.end();
  })
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
