import { createAuthClient } from "better-auth/react";
import { anonymousClient, inferAdditionalFields } from "better-auth/client/plugins";

// Explicit field schema instead of inferAdditionalFields<typeof auth>: importing
// the worker's auth type would drag workerd globals into the DOM program.
export const authClient = createAuthClient({
  plugins: [
    anonymousClient(),
    inferAdditionalFields({
      user: {
        forename: { type: "string", required: false },
        surname: { type: "string", required: false },
        grade: { type: "string", required: false },
        hcpId: { type: "string", required: false, input: false },
      },
    }),
  ],
});

export const { useSession } = authClient;
