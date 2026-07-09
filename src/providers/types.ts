import type { ShapeType } from "@ng-org/shex-orm";

export type DataModel = {
  shapeType: ShapeType<any>; 
}

export type DataModels = Record<string, DataModel>;

export type DataProviderConfig = {
  dataModels: DataModels;
};

export type LiveProviderConfig = {
  dataModels: DataModels;
};

export type UnwatchFn = () => void;
