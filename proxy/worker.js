// 豪然形象手册 · AI 请求转发（Cloudflare Workers）
// 作用：有些服务商（OpenAI、通义、Kimi 等）不允许网页直接调用接口，这个 Worker 帮忙转发并加上跨域头。
// 密钥由网页随请求带过来，Worker 不保存任何东西。
// 用法：网页设置里「代理地址」填 https://<你的 worker>.workers.dev，请求会发到 /<服务商>/<原路径>。

// 只允许你自己的网页使用；本地调试可以加上 http://localhost:8765
const ALLOWED_ORIGINS = ['https://yongranliu.github.io'];

const UPSTREAM = {
  anthropic: 'https://api.anthropic.com',
  openai: 'https://api.openai.com',
  gemini: 'https://generativelanguage.googleapis.com',
  deepseek: 'https://api.deepseek.com',
  qwen: 'https://dashscope.aliyuncs.com',
  kimi: 'https://api.moonshot.cn',
  zhipu: 'https://open.bigmodel.cn',
  openrouter: 'https://openrouter.ai'
};

export default {
  async fetch(req) {
    const origin = req.headers.get('origin') || '';
    const cors = {
      'access-control-allow-origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': req.headers.get('access-control-request-headers') || '*',
      'access-control-max-age': '86400',
      vary: 'origin'
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!ALLOWED_ORIGINS.includes(origin)) return new Response('origin not allowed', { status: 403, headers: cors });
    if (req.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });

    const url = new URL(req.url);
    const [, name, ...rest] = url.pathname.split('/');
    const base = UPSTREAM[name];
    if (!base) return new Response('unknown provider', { status: 404, headers: cors });

    const headers = new Headers(req.headers);
    ['origin', 'referer', 'cookie', 'host'].forEach(h => headers.delete(h));
    const res = await fetch(`${base}/${rest.join('/')}${url.search}`, { method: 'POST', headers, body: req.body });

    const out = new Response(res.body, res);
    Object.entries(cors).forEach(([k, v]) => out.headers.set(k, v));
    return out;
  }
};
