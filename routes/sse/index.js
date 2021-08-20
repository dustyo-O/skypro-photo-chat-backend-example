const Router = require('koa-router');
const { streamEvents } = require('http-event-stream');
const { subscriptions } = require('../../db/db');

const router = new Router();

// TODO: write code here

router.get('/sse', async (ctx) => {
  streamEvents(ctx.req, ctx.res, {
    async fetch(lastEventId) {
      console.log(lastEventId);

      return [{
        data: 'hello fetch',
        id: +new Date(),
      }];
    },

    stream(sse) {
      subscriptions.listen((item => {
        console.log('handle');

        sse.sendEvent({
          data: JSON.stringify(item),
//          id: item.phone.slice(1),
        });
      }));

      return () => {};
    }
  });

  ctx.respond = false;
});

module.exports = router;
