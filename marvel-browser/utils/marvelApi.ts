import axios from 'axios';
import md5 from 'md5';

const publicKey = 'a0c13a6039a6df3382792650725de692'; 
const privateKey = 'e22c202a871c9283f19e8c7ec7c6e8c825cd1d34'; 

const baseURL = 'https://gateway.marvel.com/v1/public'; 

export const fetchMarvelData = async <T>(
  endpoint: string,
  params = {}
): Promise<{ data: { results: T[] } }> => {
  const timestamp = new Date().getTime(); 
  const hash = md5(`${timestamp}${privateKey}${publicKey}`); 

  try {
    const response = await axios.get(`${baseURL}/${endpoint}`, {
      params: {
        ts: timestamp, 
        apikey: publicKey, 
        hash, 
        ...params, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('API Request Error:', error); 
    throw error; 
  }
};
