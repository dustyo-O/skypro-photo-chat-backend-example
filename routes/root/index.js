const Router = require('koa-router');

const router = new Router();

// TODO: write code here

router.get('/index', async (ctx) => {
  ctx.response.body = 'hello';
});

module.exports = router;
