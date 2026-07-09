import { LiveProvider } from "@refinedev/core";
import { watch } from "@ng-org/alien-deepsignals"
import { getSignalObject } from "./utils";
import { parsePatches } from "./utils";
import { LiveProviderConfig, UnwatchFn } from "./types";

const liveProvider = ({ dataModels }: LiveProviderConfig) : LiveProvider => ({
  subscribe: async ({ channel, params, types, callback, meta }) : Promise<UnwatchFn> => {
    console.log('subscribe', channel, params?.subscriptionType, params, types, meta);

    const ids = params?.ids as string[];

    if (channel.startsWith("resources/")) {
      const resource = channel.split('/')[1];

      if (dataModels[resource]) {

        if (ids?.length > 0) {
          // We don't close the subscription because we want to keep listening for changes
          const set = await getSignalObject(dataModels[resource].shapeType, ids, false);

          const { stopListening } = watch(set, ({ newValue, patches }) => {
            console.log('object modified', newValue, patches);

            const modifiedIds = parsePatches(patches);

            for( const [graphId, eventType] of Object.entries(modifiedIds)) {
              callback({
                channel,
                type: eventType,
                payload: { ids: [graphId] },
                date: new Date(),
              });
            }
          });

          return stopListening;
        
        } else {
          // We don't close the subscription because we want to keep listening for changes
          const set = await getSignalObject(dataModels[resource].shapeType, undefined, false);

          console.log('set listening list', set);

          const { stopListening } = watch(set, ({ newValue, patches }) => {
            console.log('objects list modified', newValue, patches);

            const modifiedIds = parsePatches(patches);

            for( const [graphId, eventType] of Object.entries(modifiedIds)) {
              callback({
                channel,
                type: eventType,
                payload: { ids: [graphId] },
                date: new Date(),
              });
            }
          });

          return stopListening;
        }
      }
    }

    return () => undefined;
  },
  unsubscribe: async (unwatchFn: UnwatchFn | Promise<UnwatchFn>) => {
    console.log('unsubscribe', typeof unwatchFn, unwatchFn);
    const fn = await Promise.resolve(unwatchFn);
    if (typeof fn === "function") {
      fn();
    }
  }
});

export default liveProvider;
