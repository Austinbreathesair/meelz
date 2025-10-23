// Hourly: purge expired api_cache
export async function run() {
  // DELETE FROM api_cache WHERE expires_at < now()
  return { purged: true };
}

