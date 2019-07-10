const express = require('express');
const postsRoutes = require('./posts/posts-routes');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRoutes);

server.get('/', (req, res) => {
  res.send(`
    <h2>Posts and comments API</h>
    
  `);
});

server.listen(3000, () => {
  console.log('Server Running on http://localhost:3000');
});
