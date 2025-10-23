import http from 'k6/http';
import { sleep } from 'k6';

export const options = { vus: 10, duration: '10s' };

export default function () {
  http.post('http://localhost:3000/api/share', JSON.stringify({ action: 'search' }));
  sleep(1);
}

