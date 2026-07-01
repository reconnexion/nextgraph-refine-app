import type { Schema } from "@ng-org/shex-orm";

/**
 * =============================================================================
 * postSchema: Schema for post
 * =============================================================================
 */
export const postSchema = {
  "https://www.w3.org/ns/activitystreams#Note": {
    iri: "https://www.w3.org/ns/activitystreams#Note",
    predicates: [
      {
        dataTypes: [
          {
            valType: "iri",
            literals: ["https://www.w3.org/ns/activitystreams#Note"],
          },
        ],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        readablePredicate: "@type",
      },
      {
        dataTypes: [
          {
            valType: "string",
          },
        ],
        maxCardinality: 1,
        minCardinality: 1,
        iri: "https://www.w3.org/ns/activitystreams#title",
        readablePredicate: "title",
      },
      {
        dataTypes: [
          {
            valType: "string",
          },
        ],
        maxCardinality: 1,
        minCardinality: 0,
        iri: "https://www.w3.org/ns/activitystreams#content",
        readablePredicate: "content",
      },
    ],
  },
} as const satisfies Schema;
