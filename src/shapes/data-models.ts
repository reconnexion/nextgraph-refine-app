import type { ShapeType } from "@ng-org/shex-orm";
import { NoteShapeType } from "./orm/post.shapeTypes";

export type DataModel = {
  shapeType: ShapeType<any>; 
}

export type DataModels = Record<string, DataModel>;

const dataModels : DataModels = {
  posts: {
    shapeType: NoteShapeType
  }
}

export default dataModels;
