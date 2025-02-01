// pages/api/ping.ts
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Simple ping endpoint that returns an empty 200 response.
 * Used for network speed testing and health checks.
 * 
 * The endpoint is intentionally lightweight to minimize
 * overhead when measuring network latency.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET');
  
  // Return empty response with 200 status
  res.status(200).end();
}

// Example usage for speed testing:
//
// async function measureSpeed() {
//   const startTime = performance.now();
//   
//   await fetch('/api/ping', {
//     method: 'HEAD',  // Use HEAD to minimize data transfer
//     cache: 'no-cache'  // Prevent caching
//   });
//   
//   const endTime = performance.now();
//   const duration = endTime - startTime;
//   
//   // Convert to Mbps (rough approximation)
//   const speedMbps = 1000 / duration;
//   return speedMbps;
// }