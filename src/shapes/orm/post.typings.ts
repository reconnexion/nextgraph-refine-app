export type IRI = string;

/**
 * =============================================================================
 * Typescript Typings for post
 * =============================================================================
 */

/**
 * Note Type
 */
export interface Note {
  /**
   * The graph NURI.
   */
  readonly "@graph": IRI;
  /**
   * The subject IRI.
   */
  readonly "@id": IRI;
  /**
   * Original IRI: http://www.w3.org/1999/02/22-rdf-syntax-ns#type
   */
  "@type": "https://www.w3.org/ns/activitystreams#Note";
  /**
   * The title of the post
   *
   * Original IRI: https://www.w3.org/ns/activitystreams#title
   */
  title: string;
  /**
   * The content of the post
   *
   * Original IRI: https://www.w3.org/ns/activitystreams#content
   */
  content?: string;
}
