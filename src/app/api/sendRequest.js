// pages/api/sendRequest.js
export default async function handler(req, res) {
  const response = await fetch('http://localhost:8000/generate_email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: "client@example.com",
      purpose: "following up on Q2 contract renewal"
    })
  });
  const data = await response.json();
  res.status(200).json(data);
}