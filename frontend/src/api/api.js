import axios from 'axios';

const nodeAPI = axios.create({
  baseURL: 'http://localhost:3001', // URL do backend Node.js
});

const springAPI = axios.create({
  baseURL: 'http://localhost:8080', // URL do backend Spring Boot
});

export { nodeAPI, springAPI };