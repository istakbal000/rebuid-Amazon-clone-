import axios from 'axios';

axios.post('http://localhost:5000/api/ai/recommend', { query: 'laptop' })
  .then(res => console.log('SUCCESS:', res.data))
  .catch(err => {
    if (err.response) {
      console.error('ERROR RESPONSE:', err.response.data);
    } else {
      console.error('ERROR:', err.message);
    }
  });
