import type { ShapeType } from "@ng-org/shex-orm";
import { postSchema } from "./post.schema";
import type { Note } from "./post.typings";

// ShapeTypes for post
export const NoteShapeType = {
  schema: postSchema,
  shape: "https://www.w3.org/ns/activitystreams#Note",
} as const satisfies ShapeType<Note>;
