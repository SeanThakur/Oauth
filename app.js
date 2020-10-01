const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();

const client_id = 'f42c347174804dfc5b30';
const client_secret = '76f91cf82ddb4e60da4fd13d50591f82c3e8d5c6';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/main.html'));
});

app.get("/auth", (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${client_id}`);
});

app.get('/callback', ({ query: { code } }, res) => {
    const body = {
      client_id: client_id,
      client_secret: client_secret,
      code,
    };
    const opts = { headers: { accept: 'application/json' } };
    axios
      .post('https://github.com/login/oauth/access_token', body, opts)
      .then((res) => res.data)
      .then((data) => {

        console.log('My token:', data.access_token);
        console.log('My token type:', data.token_type);
  
        res.redirect(`/?token=${data.access_token}`);
      })
      .catch((err) => res.status(500).json({ err: err.message }));
});

const port = process.env.PORT || 3000;

app.listen(port, () => `Server running on port ${port}`);