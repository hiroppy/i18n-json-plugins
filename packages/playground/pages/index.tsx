import type { FC } from "react";
import { useTranslation } from "react-i18next";

const TopPage: FC = () => {
  const { t, i18n } = useTranslation(["common"]);
  const langs = ["ja", "en"] as const;

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div
      style={{
        margin: "auto",
        width: "300px",
      }}
    >
      <p>{t("hello")}</p>
      <select defaultValue={i18n.language} onChange={onChange}>
        {langs.map((lang) => (
          <option value={lang} key={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TopPage;
