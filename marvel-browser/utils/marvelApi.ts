import axios from 'axios';
import md5 from 'md5'; // Import md5 to generate the hash

const publicKey = 'a0c13a6039a6df3382792650725de692'; // Your actual public key
const privateKey = 'e22c202a871c9283f19e8c7ec7c6e8c825cd1d34'; // Your actual private key

const baseURL = 'https://gateway.marvel.com/v1/public'; // Marvel API base URL

export const fetchMarvelData = async <T>(
  endpoint: string,
  params = {}
): Promise<{ data: { results: T[] } }> => {
  const timestamp = new Date().getTime(); // Current timestamp
  const hash = md5(`${timestamp}${privateKey}${publicKey}`); // Generate hash with timestamp + private + public key

  try {
    const response = await axios.get(`${baseURL}/${endpoint}`, {
      params: {
        ts: timestamp, // Timestamp for the request
        apikey: publicKey, // Public key for authentication
        hash, // Generated hash for authentication
        ...params, // Additional query parameters like pagination, limit, etc.
      },
    });

    return response.data;
  } catch (error) {
    console.error('API Request Error:', error); // Log the error if request fails
    throw error; // Re-throw the error so it can be handled in the calling component
  }
};
