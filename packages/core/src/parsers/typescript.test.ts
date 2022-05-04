import { parse } from "./typescript";

describe("parse", () => {
  test("should collect keys from a common file", () => {
    const res = parse(
      `
const { t } = useTranslation();

console.log(t('foo.bar'));
console.log(t('foo.bar'));
console.log(t('foo.bar.baz'));
    `,
      "common"
    );

    expect(res).toMatchSnapshot();
  });

  test("should collect keys from 1 file", () => {
    const res = parse(`
const { t } = useTranslation('test');

console.log(t('foo.bar'));
console.log(t('foo.bar'));
console.log(t('test:foo.bar.baz'));
console.log(t('test:foo.bar.baz'));
    `);

    expect(res).toMatchSnapshot();
  });

  test("should collect keys from multiple files", () => {
    const res = parse(`
  const { t } = useTranslation(['test', 'test1']);

  console.log(t('test:foo'));
  console.log(t('test:foo.bar'));
  console.log(t('test:foo.bar'));
  console.log(t('test1:foo.bar'));
  console.log(t('test1:foo.bar.baz'));
  console.log(t('test1:foo.bar.baz'));
      `);

    expect(res).toMatchSnapshot();
  });

  test("should collect keys from jsx", () => {
    const res = parse(`
const Component = () => {
    const { t } = useTranslation(['test', 'test1']);

  return (
    <div>
      <p>{t('test:foo')}</p>
      <p>{t('test1:bar')}</p>
    </div>
  );
}
      `);

    expect(res).toMatchSnapshot();
  });
});
