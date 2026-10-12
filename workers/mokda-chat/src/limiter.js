const bounded = (value, fallback, max) => Math.max(1, Math.min(max, Number(value) || fallback));

// One global SQLite-backed Durable Object makes this quota atomic across regions.
// It stores a UTC day, counts and daily IP hashes, never messages or raw IPs.
export class ChatLimiter {
  constructor(state, env) { this.state = state; this.env = env; }

  async fetch(request) {
    if (request.method !== 'POST') return Response.json({ allowed: false }, { status: 405 });
    let input;
    try { input = await request.json(); } catch { return Response.json({ allowed: false }, { status: 400 }); }
    if (!/^[a-f0-9]{64}$/.test(input.key || '')) return Response.json({ allowed: false }, { status: 400 });
    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const minute = Math.floor(now / 60000);
    const dailyLimit = bounded(this.env.DAILY_AI_LIMIT, 80, 80);
    const result = await this.state.storage.transaction(async transaction => {
      let counters = await transaction.get('usage');
      if (!counters || counters.day !== day) counters = { day, count: 0, visitors: {} };
      const visitor = counters.visitors[input.key] || { count: 0, minute, minuteCount: 0 };
      if (visitor.minute !== minute) { visitor.minute = minute; visitor.minuteCount = 0; }
      if (counters.count >= dailyLimit) return { allowed: false, reason: 'daily_limit', retryAfter: 3600 };
      if (visitor.count >= 20 || visitor.minuteCount >= 3) return { allowed: false, reason: 'visitor_limit', retryAfter: 60 };
      visitor.count += 1;
      visitor.minuteCount += 1;
      counters.count += 1;
      counters.visitors[input.key] = visitor;
      await transaction.put('usage', counters);
      return { allowed: true };
    });
    return Response.json(result);
  }
}
