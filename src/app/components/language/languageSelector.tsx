import React from "react";

import dynamic from "next/dynamic";
import LanguageSelectorUser from "@/components/language/languageSelectorUser";
const LanguageSelectorDev = dynamic(
  () => import("@/components/language/languageSelectorDev"),
  {
    ssr: false,
  }
);

const LanguageSelector = () => {
  const [devEnvironment, setDevEnvironment] = React.useState(true);

  return devEnvironment ? <LanguageSelectorDev /> : <LanguageSelectorUser />;
};

export default LanguageSelector;
