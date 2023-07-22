const express = require('express');
const axios = require('axios');

const app = express();

app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url || !Array.isArray(url)) {
    return res.status(400).json({ error: 'Invalid URL format. Please provide the "url" parameter correctly.' });
  }

  try {
    const numberArrays = await Promise.all(
      url.map(fetchNumbersFromUrl)
    );

    const mergedNumbers = mergeAndSortArrays(numberArrays);
    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error('Error fetching numbers:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

async function fetchNumbersFromUrl(url) {
  try {
    const response = await axios.get(url, { timeout: 500 });
    return response.data.numbers || [];
  } catch (error) {
    console.log(`Error fetching numbers from ${url}: ${error.message}`);
    return [];
  }
}

function mergeAndSortArrays(arrays) {
  const merged = [].concat(...arrays);
  const uniqueSortedNumbers = Array.from(new Set(merged)).sort((a, b) => a - b);
  return uniqueSortedNumbers;
}

module.exports = app;
