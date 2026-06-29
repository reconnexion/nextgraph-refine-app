import { LiveProvider } from "@refinedev/core";

const liveProvider: LiveProvider = {
  subscribe: ({ channel, params: { ids }, types, callback, meta }) => {
    console.log('subscribe', channel, ids, types, callback, meta);
  },
  unsubscribe: (subscription) => {
    console.log('unsubscribe', subscription);
  }
};

export default liveProvider;
