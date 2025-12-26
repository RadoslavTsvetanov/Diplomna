import type { URecord } from "@blazyts/better-standard-library";

import type { allStatusCodes } from "../status-codes";

export type HttpSchemaResponse = { [x in allStatusCodes]?: URecord };

export type RawHttpResponse = { status: allStatusCodes; body: URecord };
