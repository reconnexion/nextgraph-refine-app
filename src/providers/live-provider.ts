import { LiveProvider } from "@refinedev/core";
import { OrmSubscription } from "@ng-org/orm";
import type { ShapeType } from "@ng-org/shex-orm";
import { DeepSignalSet, DeepPatch, watch } from "@ng-org/alien-deepsignals"
import { DataModels } from "../shapes/data-models";

type LiveProviderConfig = {
  dataModels: DataModels;
};

type UnwatchFn = () => void;

const getSignalObject = async (shapeType: ShapeType<any>, ids?: string[]) : Promise<DeepSignalSet<any>> => {
  const subscription = OrmSubscription.getOrCreate(shapeType, { graphs: ids || [] });
  await subscription.readyPromise;
  return subscription.signalObject;
}

const parsePatches = (patches: DeepPatch[]) => {
  let modifiedIds: string[] = [];
  let eventType = "updated";

  for( const patch of patches) {
    // The path property include the @id property first, then the modified field
    const id = (patch.path[0] as string).split('|')[0];
    const modifiedField = patch.path[1] as string;

    // If an add operation involves an @id, this is a creation
    if (patch.op === "add" && modifiedField === "@id") {
      eventType = "created";
    }

    // If a remove operation includes only the ID, this is a deletion
    if (patch.op === "remove" && !modifiedField) {
      eventType = "deleted";
    }

    // Avoid duplicates
    if (!modifiedIds.includes(id)) {
      modifiedIds.push(id);
    }
  };

  return { eventType, modifiedIds };
}

const liveProvider = ({ dataModels }: LiveProviderConfig) : LiveProvider => ({
  subscribe: async ({ channel, params, types, callback, meta }) : Promise<UnwatchFn> => {
    console.log('subscribe', channel, params, types, meta);

    const ids = params?.ids as string[];

    if (channel.startsWith("resources/")) {
      const resource = channel.split('/')[1];

      if (dataModels[resource]) {

        if (ids?.length > 0) {
          const set = await getSignalObject(dataModels[resource].shapeType, ids);

          const { stopListening } = watch(set, ({ newValue, patches }) => {
            console.log('object modified', newValue, patches);

            const { eventType, modifiedIds } = parsePatches(patches);

            if (modifiedIds.length > 0) {
              callback({
                channel,
                type: eventType,
                payload: { ids: modifiedIds },
                date: new Date(),
              });
            }
          });

          return stopListening;
        
        } else {
          const set = await getSignalObject(dataModels[resource].shapeType);

          const { stopListening } = watch(set, ({ newValue, patches }) => {
            console.log('objects list modified', newValue, patches);

            const { eventType, modifiedIds } = parsePatches(patches);

            if (modifiedIds.length > 0) {
              callback({
                channel,
                type: eventType,
                payload: { ids: modifiedIds },
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
  unsubscribe: async (unwatchFn: UnwatchFn) => {
    if (typeof unwatchFn === "function") {
      unwatchFn();
    }
  }
});

export default liveProvider;
