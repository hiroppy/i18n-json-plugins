import { join } from "node:path";
import { writeFile, readFile } from "node:fs/promises";
import objectPath from "object-path";

function createFilePath(basePath: string, filename: string) {
  return join(basePath, `${filename}.json`);
}

export async function createJson(
  basePath: string,
  filename: string,
  content = "{}"
) {
  await writeFile(createFilePath(basePath, filename), content, "utf-8");
}

export async function getContent(basePath: string, filename: string) {
  return await readFile(createFilePath(basePath, filename), "utf-8");
}

export async function addKey(basePath: string, filename: string, key: string) {
  const content = await readFile(createFilePath(basePath, filename), "utf-8");

  try {
    const res = JSON.parse(content);
    const value = objectPath.get(res, key);

    if (!value) {
      const parts = key.split(".");

      if (/* doesn't have the parent */ parts.length === 1) {
        objectPath.set(res, key, "");
      } else {
        const [current, ...parent] = parts.reverse();
        const parentPath = parent.reverse().join(".");
        const parentValue = objectPath.get(res, parentPath);

        if (parentValue === undefined) {
          // throw new Error(
          //   `${parentPath}(parent) doesn't exist on "${filename}"`
          // );
          return;
        } /* allow {} parent key */ else if (
          typeof parentValue === "object" &&
          Object.keys(parentValue).length === 0
        ) {
          objectPath.set(res, parentPath, "");
        } /* the parent has already had a value other than {}, "" */ else if (
          parentValue !== ""
        ) {
          throw new Error(`${parentPath}(parent) has already had a value`);
        }

        objectPath.set(res, parentPath, {});
        objectPath.set(res, key, "");
      }

      await createJson(basePath, filename, JSON.stringify(res, null, 2));
    }
  } catch (e) {
    throw e;
  }
}

export function removeEmptyKey(
  obj: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== "")
      .map(([k, v]) => [
        k,
        v === Object(v) ? removeEmptyKey(v as Record<string, unknown>) : v,
      ])
  );
}
