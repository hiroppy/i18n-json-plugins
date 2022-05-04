import { tmpdir } from "node:os";
import { mkdtemp, rmdir } from "node:fs/promises";
import { join } from "node:path";
import {
  createJson,
  addKey,
  getContent,
  removeEmptyKey,
} from "./handleI18nJson";

describe("handleI18nJson", () => {
  let tmpPath = "";

  beforeEach(async () => {
    tmpPath = await mkdtemp(join(tmpdir(), "i18n-json-plugins"));
  });

  afterEach(async () => {
    await rmdir(tmpPath, { recursive: true });
  });

  test("should create a JSON file", async () => {
    await createJson(tmpPath, "test");

    expect(await getContent(tmpPath, "test")).toMatchSnapshot();
  });

  test("should add keys to a nested object", async () => {
    await createJson(
      tmpPath,
      "test",
      JSON.stringify({
        components: {},
      })
    );
    await addKey(tmpPath, "test", "foo");
    await addKey(tmpPath, "test", "foo.bar");
    await addKey(tmpPath, "test", "foo.bar.baz");
    await addKey(tmpPath, "test", "components.foo");

    expect(await getContent(tmpPath, "test")).toMatchSnapshot();
  });

  test("should throw an error when a parent has already had a value", async () => {
    await createJson(
      tmpPath,
      "test",
      JSON.stringify({
        components: "components",
      })
    );
    await expect(
      addKey(tmpPath, "test", "components.foo")
    ).rejects.toThrowError("components(parent) has already had a value");
  });

  test("should throw an error when a parent doesn't exist", async () => {
    await createJson(tmpPath, "test", JSON.stringify({}));
    await expect(
      addKey(tmpPath, "test", "components.foo")
    ).rejects.toThrowError('components(parent) doesn\'t exist on "test"');
  });

  test("should remove empty keys from an object", () => {
    expect(
      removeEmptyKey({
        foo: "",
        bar: {},
        nested: {
          foo: "",
          bar: {
            baz: "",
          },
        },
      })
    ).toMatchSnapshot();
  });
});
