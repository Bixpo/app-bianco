import axios from 'axios';

export const instance = axios.create({
  baseURL: process.env.REACT_APP_AXIOS_API,
  timeout: 10000, // Tempo limite de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    // Adicione quaisquer outros cabeçalhos que você precisa aqui
  },
});

export const instanceCND = axios.create({
  baseURL: process.env.REACT_APP_AXIOS_CDN,
});


