import { ng, init, Session } from "@ng-org/web";
import { initNg } from "@ng-org/orm";

export let session: Session | undefined;

init(
  async (event: any) => {
    session = event.session;
    // The ORM needs to have access to ng,
    // the interface to the engine running in WASM.
    initNg(ng, session!);
  },
  true,
  [],
);
