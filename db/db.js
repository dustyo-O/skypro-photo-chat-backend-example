module.exports = {
  subscriptions: {
    data: [],
    add: function (item) {
      this.data.push(item);

      this.handlers.forEach(h => h(item));
    },
    handlers: [],
    listen: function (handler) {
      this.handlers.push(handler);
    }
  }
};
