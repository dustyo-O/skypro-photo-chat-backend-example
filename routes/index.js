const combineRouters = require('koa-combine-routers');
const rootRoutes = require('./root');
const subscriptionRoutes = require('./subscriptions');
const sseRoutes = require('./sse');

const router = combineRouters(
  rootRoutes,
  subscriptionRoutes,
  sseRoutes,
);

module.exports = router;
