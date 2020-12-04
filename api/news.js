const https = require('https');
const url = require('url');
const qs = require('querystring');
const writeFile = require('../utils/writeFile');
const getStringHash = require('../utils/getStringHash');
const readFile = require('../utils/readFIle');
const checkFileExists = require('../utils/checkFileExists');
const getFileCreateTime = require('../utils/getFileCreateTime');

const newsHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const searchQuery = parsedUrl.query;

  if (!searchQuery.query) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(
      JSON.stringify({
        error: 'missing required query parameter',
      })
    );
    return res.end();
  }

  const params = {
    apiKey: process.env.NEWS_API_KEY,
    sortBy: 'publishedAt',
    q: searchQuery.query,
  };
  if (searchQuery.from) {
    params['from'] = searchQuery.from;
  }
  if (searchQuery.limit) {
    params['pageSize'] = searchQuery.limit;
  }
  const rawParams = qs.stringify(params);

  https.get(
    {
      host: process.env.NEWS_API_HOST,
      path: `${process.env.NEWS_API_ROUTE}?${rawParams}`,
    },
    (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('error', (err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(err);
        res.end();
      });

      response.on('end', async () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const newsResponse = JSON.parse(data);
        if (newsResponse.status === 'error') {
          res.write(JSON.stringify(newsResponse));
          return res.end();
        }
        const savedNewsHashes = await saveNews(newsResponse.articles);
        const newsContent = await readNews(savedNewsHashes);
        res.write(JSON.stringify(newsContent));
        res.end();
      });
    }
  );
};

function readNews(savedNewsHashes) {
  return Promise.all(
    savedNewsHashes.map(async (fileHash) => {
      const filePath = getFilePath(fileHash);
      const [fileCreateDate, fileContent] = await Promise.all([
        getFileCreateTime(filePath),
        readFile(filePath),
      ]);
      return {
        timestamp: fileCreateDate,
        content: fileContent,
      };
    })
  );
}

async function saveNews(newsList) {
  const news = await Promise.all(
    newsList
      .filter(({ content }) => content)
      .map(async (newsItem) => {
        const contentHash = getStringHash(newsItem.content);
        const filePath = getFilePath(contentHash);
        const isExists = await checkFileExists(filePath);
        return {
          contentHash,
          content: newsItem.content,
          isExists,
        };
      })
  );

  const notExistingNews = news.filter(({ isExists }) => !isExists);

  await Promise.all(
    notExistingNews.map(async (newsItem) => {
      const fileName = getFilePath(newsItem.contentHash);
      return writeFile(fileName, newsItem.content);
    })
  );

  return news.map(({ contentHash }) => contentHash);
}

function getFilePath(fileName) {
  const newsSaveFolder = process.env.NEWS_SAVE_FOLDER;
  return `${newsSaveFolder}${fileName}.txt`;
}

module.exports = {
  newsHandler,
};
