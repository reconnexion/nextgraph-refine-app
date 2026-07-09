import { OrmSubscription } from "@ng-org/orm";
import type { ShapeType } from "@ng-org/shex-orm";
import { DeepSignalSet } from "@ng-org/alien-deepsignals"

export const getSignalObject = async (shapeType: ShapeType<any>, ids?: string[], closeSubscription: boolean = true) : Promise<DeepSignalSet<any>> => {
  const subscription = OrmSubscription.getOrCreate(shapeType, { graphs: ids || [''] });
  await subscription.readyPromise;
  const { signalObject } = subscription;
  if (closeSubscription) subscription.close();
  return signalObject;
}

