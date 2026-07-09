import { DataProvider } from "@refinedev/core";
import { ng } from "@ng-org/web";
import { getObjects } from "@ng-org/orm";
import { session } from "../utils/initNg";
import { addIdToObject, isGraphKey, getSignalObject } from "./utils";
import { DataProviderConfig } from "./types";

const dataProvider = ({ dataModels }: DataProviderConfig) : DataProvider => ({
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    console.log('list', resource, pagination, sorters, filters, meta);

    const objects = await getObjects(dataModels[resource].shapeType, "");

    return {
      data: [...objects].map(addIdToObject) as any,
      total: 1,
    };
  },
  create: async ({ resource, variables, meta }) => {
    console.log("create", resource, variables, meta);

    const docNuri = await ng.doc_create(
      session!.session_id,
      "Graph",
      "data:graph",
      "store", // Private store
      undefined
    );

    const set = await getSignalObject(dataModels[resource].shapeType, [docNuri]);

    set.add({
      "@graph": docNuri,
      "@type": "https://www.w3.org/ns/activitystreams#Note",
      "@id": "",
      ...variables
    });

    const newData = set.first();

    return {
      data: addIdToObject({ ...newData }),
    };
  },
  update: async ({ resource, id, variables, meta }) => {
    console.log('update', resource, id, variables, meta);

    const set = await getSignalObject(dataModels[resource].shapeType, [`${id}`]);

    const oldData = set.first()!;

    const objectId = oldData["@id"];

    const newData = {
      "@graph": id,
      "@type": "https://www.w3.org/ns/activitystreams#Note",
      "@id": objectId,
      ...variables
    };

    // Delete old data and add new data to the set
    // Hopefully the ORM will handle this intelligently
    set.delete(oldData);
    set.add(newData);

    return {
      data: addIdToObject(newData)
    };
  },
  deleteOne: async ({ resource, id, variables, meta }) => {
    console.log('deleteOne', resource, id, variables, meta);

    const set = await getSignalObject(dataModels[resource].shapeType, [`${id}`]);

    const oldData = set.first()!;

    set.delete(oldData);

    return {
      data: addIdToObject({ ...oldData })
    };
  },
  getOne: async ({ resource, id, meta }) => {
    console.log('getOne', resource, id, meta);

    // The ID should be a graph URI, but if it's an object key, we can use the subjects filter to the the object
    const objects = await getObjects(dataModels[resource].shapeType, isGraphKey(id) ? `${id}` : { subjects: [`${id}`] });

    return {
      data: addIdToObject([...objects][0])
    }
  },
  getApiUrl: () => "",
  // optional methods
  // getMany: ({ resource, ids, meta }) => Promise,
  // createMany: ({ resource, variables, meta }) => Promise,
  // deleteMany: ({ resource, ids, variables, meta }) => Promise,
  // updateMany: ({ resource, ids, variables, meta }) => Promise,
  // custom: ({ url, method, filters, sorters, payload, query, headers, meta }) => Promise,
});

export default dataProvider;
