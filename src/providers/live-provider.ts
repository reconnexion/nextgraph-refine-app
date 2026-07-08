import { LiveProvider } from "@refinedev/core";
import { DeepPatch, watch } from "@ng-org/alien-deepsignals"
import { DataModels } from "../shapes/data-models";
import { getSignalObject } from "./utils";

type LiveProviderConfig = {
  dataModels: DataModels;
};

type UnwatchFn = () => void;

const parsePatches = (patches: DeepPatch[]) => {
  let modifiedIds : Record<string, 'created' | 'updated' | 'deleted'> = {};

  for( const patch of patches) {
    // The path property include the @id property first, then the modified field
    const [graphId] = (patch.path[0] as string).split('|');
    const modifiedField = patch.path[1] as string;

    // If a remove operation includes only the ID, this is a deletion
    if (patch.op === "remove" && !modifiedField) {
      modifiedIds[graphId] = 'deleted';
    }

    // If an add operation involves an @id, this is a creation
    if (patch.op === "add" && modifiedField === "@id") {
      if (modifiedIds[graphId] === 'deleted') {
        // If the object was previously marked as deleted, consider this an update instead
        modifiedIds[graphId] = 'updated';
      } else {
        modifiedIds[graphId] = 'created';
      }
    }

    if (modifiedIds[graphId] !== 'created' && modifiedIds[graphId] !== 'deleted') {
      modifiedIds[graphId] = 'updated';
    }
  };

  return modifiedIds;
}

const liveProvider = ({ dataModels }: LiveProviderConfig) : LiveProvider => ({
  subscribe: async ({ channel, params, types, callback, meta }) : Promise<UnwatchFn> => {
    console.log('subscribe', channel, params?.subscriptionType, params, types, meta);
    console.trace('subscribe trace', channel, params?.subscriptionType)

    const ids = params?.ids as string[];

    if (channel.startsWith("resources/")) {
      const resource = channel.split('/')[1];

      if (dataModels[resource]) {

        if (ids?.length > 0) {
          const set = await getSignalObject(dataModels[resource].shapeType, ids);

          const { stopListening } = watch(set, ({ newValue, patches }) => {
            console.log('object modified', newValue, patches);

            const modifiedIds = parsePatches(patches);

            console.log('modifiedIds', modifiedIds);

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
          const set = await getSignalObject(dataModels[resource].shapeType);

          console.log('set listening list', set);

          const { stopListening } = watch(set, ({ newValue, patches }) => {
            console.log('objects list modified', newValue, patches);

            const modifiedIds = parsePatches(patches);

            console.log('modifiedIds', modifiedIds);

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
