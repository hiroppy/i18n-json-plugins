import {
  CallExpression,
  createSourceFile,
  forEachChild,
  ScriptTarget,
  SyntaxKind,
} from "typescript";
import type { Node } from "typescript";
import { Res } from "./types";

export function parse(
  code: string,
  defaultI18nFilename: string = "common"
): Res {
  const src = createSourceFile("code.tsx", code, ScriptTarget.Latest, true);
  const res: Res = {};

  walk(src);

  function initI18nFileField(path: string) {
    if (res[path] === undefined) {
      res[path] = {
        keys: [],
      };
    }
  }

  function pushKeyToRes(path: string, key: string) {
    const target = res[path];

    if (!target) {
      throw new Error("not found the key");
    }

    if (target.keys.includes(key)) {
      return;
    }

    target.keys.push(key);
  }

  function walk(node: Node) {
    if (node.kind === SyntaxKind.CallExpression) {
      const methodName: string =
        // @ts-expect-error
        (node as CallExpression).expression.escapedText;

      if (methodName === "useTranslation") {
        // @ts-expect-error
        if (node.arguments.length === 0) {
          // common
          initI18nFileField(defaultI18nFilename);
        } else {
          // @ts-expect-error
          const i18nPaths = node.arguments[0];

          if (i18nPaths.elements === undefined) {
            // useTranslation('foo')
            initI18nFileField(i18nPaths.text);
          } else {
            // useTranslation(['foo', 'bar'])
            for (const path of i18nPaths.elements) {
              initI18nFileField(path.text);
            }
          }
        }
      }

      // TODO: support an aliased variable
      if (methodName === "t") {
        // @ts-expect-error
        const key: string | undefined = node.arguments?.[0].text;

        if (!key) {
          throw new Error("not found the key");
        }

        const hasNamespace = key.includes(":");

        if (hasNamespace) {
          const [k, v] = key.split(":");

          pushKeyToRes(k, v);
        } else {
          if (Object.keys(res).length !== 1) {
            throw new Error();
          }

          pushKeyToRes(Object.keys(res)[0], key);
        }
      }
    }

    forEachChild(node, walk);
  }

  return res;
}
