import { NoteShapeType } from "./orm/post.shapeTypes";
import { DataModels } from "../providers/types";

const dataModels : DataModels = {
  posts: {
    shapeType: NoteShapeType
  }
}

export default dataModels;
