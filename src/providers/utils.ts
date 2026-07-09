import { BaseKey } from "@refinedev/core";
import { OrmSubscription } from "@ng-org/orm";
import type { ShapeType } from "@ng-org/shex-orm";
import { DeepSignalSet, DeepPatch } from "@ng-org/alien-deepsignals"

export const getSignalObject = async (shapeType: ShapeType<any>, ids?: string[], closeSubscription: boolean = true) : Promise<DeepSignalSet<any>> => {
  const subscription = OrmSubscription.getOrCreate(shapeType, { graphs: ids || [''] });
  await subscription.readyPromise;
  const { signalObject } = subscription;
  if (closeSubscription) subscription.close();
  return signalObject;
}

export const isGraphKey = (key: BaseKey): boolean => {
  return key !== null && typeof key === "string" && key.includes(":v:");
}

export const addIdToObject = (obj: any) => {
  if (!obj["@graph"]) {
    throw new Error("Object is missing @graph property");
  }
  return { id: obj["@graph"], ...obj };
};

export const parsePatches = (patches: DeepPatch[]) => {
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
