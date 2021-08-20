const http = require('http');
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const router = require('./routes');
const json = require('koa-json');
const WS = require('ws');

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use(json());

app.use(async (ctx, next) => {
  console.log('Origin');
  const origin = ctx.request.get('Origin');
  if (!origin) {
    console.log('! Origin');
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    console.log('! OPTIONS');
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app
  .use(router());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({
  server
});

const chat = [];

wsServer.on('connection', (ws) => {
  ws.on('message', (e) => {
    console.log(e);

    chat.push(e);

    Array.from(wsServer.clients)
      .filter(client => client.readyState === WS.OPEN)
      .forEach(client => client.send(JSON.stringify({ message: e })));
  });

  ws.send(JSON.stringify({ chat }), () => {});
});

server.listen(port);
