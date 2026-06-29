import {
  type AuthProvider,
} from "@refinedev/core";

import {
  ng,
  init as initNgWeb,
  type Session as NextGraphSession,
} from "@ng-org/web";
import { initNg as initNgSignals } from "@ng-org/orm";

export type NgAuthProvider = AuthProvider & {
  getSession: () => NextGraphSession | undefined;
};

/** The session with the NextGraph engine or undefined if not loaded. */
export let session: NextGraphSession | undefined;

export let resolveSessionPromise: (
  value: NextGraphSession | PromiseLike<NextGraphSession>,
) => void;
export let rejectSessionPromise: (reason?: any) => void;

/** Resolves to the current NextGraph session. */
export let sessionPromise: Promise<NextGraphSession> = new Promise(
  (resolve, reject) => {
    resolveSessionPromise = resolve;
    rejectSessionPromise = reject;
  },
);

const authProvider: NgAuthProvider = {
  login: async ({ brokerUrl }) => {
    // try {
    //   await initNgWeb(
    //     async (event: any) => {
    //       session = event.session;
    //       session!.ng ??= ng;
    //       localStorage.setItem("logged", "true");
    //       console.log('session', session);
    //       resolveSessionPromise(session!);

           
          
    //       initNgSignals(ng, session!);
    //     },
    //     true,
    //     [],
    //   );
     
      
    // } catch (error) {
    //   rejectSessionPromise(error);
    // }

    return {
      success: true
    };
  },
  register: async ({ brokerUrl }) => {
    console.log('brokerUrl', brokerUrl);

    return {
      success: true
    };
  },
  logout: async () => {
    localStorage.removeItem("logged");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    return ({ authenticated: localStorage.getItem("logged") === 'true' });
  },
  getPermissions: async (params) => params?.permissions,
  getIdentity: async () => ({
    id: 1,
    name: "Jane Doe",
    avatar:
      "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
  }),
  getSession : () => session
};

export default authProvider;
