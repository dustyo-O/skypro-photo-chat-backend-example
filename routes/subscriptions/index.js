const Router = require('koa-router');
const { subscriptions } = require('../../db/db');

const router = new Router({ prefix: '/subscriptions' });

router.post('/', (ctx) => {
  console.log('subscriptions');
  const { name, phone } = ctx.request.body;

  const exists = subscriptions.data.some(sub => sub.phone === phone);

  if (exists) {
    ctx.response.status = 400;
    ctx.response.body = { status: 'subscription exists'};

    return;
  }

  subscriptions.add({ phone, name });

  ctx.response.body = { status: 'ok' };
});

router.delete('/:phone', (ctx) => {
  const { phone } = ctx.params;

  const num = subscriptions.data.findIndex(sub => sub.phone === phone);

  if (num === -1) {
    ctx.response.status = 400;
    ctx.response.body = { status: 'subscription not exists'};

    return;
  }

  subscriptions.data.splice(num, 1);

  ctx.response.body = { status: 'ok' };
});

module.exports = router;
