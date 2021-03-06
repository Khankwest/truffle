import { Load } from "@truffle/db/loaders/types";
import { toIdObject } from "@truffle/db/meta";

import { AddNameRecords } from "./add.graphql";
export { AddNameRecords };

interface Resource {
  id: string;
  name: string;
}

type ResolveFunc = (
  name: string,
  type: string
) => Load<DataModel.NameRecord | null>;

export function* generateNameRecordsLoad(
  resources: Resource[],
  type: string,
  getCurrent: ResolveFunc
): Load<DataModel.NameRecord[], "nameRecordsAdd"> {
  const nameRecords = [];
  for (const resource of resources) {
    const { name } = resource;
    const current: DataModel.NameRecord = yield* getCurrent(name, type);

    if (current) {
      nameRecords.push({
        name,
        type,
        resource: toIdObject(resource),
        previous: toIdObject(current)
      });
    } else {
      nameRecords.push({
        name,
        type,
        resource: toIdObject(resource)
      });
    }
  }

  const result = yield {
    request: AddNameRecords,
    variables: { nameRecords }
  };

  return result.data.nameRecordsAdd.nameRecords;
}
