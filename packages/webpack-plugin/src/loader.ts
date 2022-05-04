import { join } from "node:path";
import type { LoaderContext } from "webpack";
import { validate } from "schema-utils";
import { parse, addKey } from "@hiroppy/i18n-json-core";

type Schema = {
  langs: string[];
  basePath: string;
};

const schema = <const>{
  type: "object",
  properties: {
    basePath: {
      type: "string",
    },
    langs: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
};

export default async function (this: LoaderContext<Schema>, source: string) {
  const options = this.getOptions();

  validate(schema, options, {
    name: "i18n json loader",
  });

  const res = parse(source);

  for (const [ns, value] of Object.entries(res)) {
    for (const lang of options.langs) {
      for (const field of value.keys) {
        await addKey(join(process.cwd(), options.basePath, lang), ns, field);
      }
    }
  }

  return source;
}
