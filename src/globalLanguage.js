import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import baseURL from "./config";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("english");
  const [translations, setTranslations] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); // trigger full app re-render

  const switchLanguage = (lang) => {
    setLanguage(lang);
    setRefreshKey((prev) => prev + 1);
  };

  const translateText = async (text) => {
    if (language === "english") return text;
    try {
      const response = await axios.get(`${baseURL}/translate`, {
        params: { text, target_language: language },
      });
      return response.data.translated_text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  const translateBulk = async (textsObj) => {
    const newTranslations = {};
    for (const [key, value] of Object.entries(textsObj)) {
      newTranslations[key] = await translateText(value);
    }
    setTranslations(newTranslations);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        switchLanguage,
        translations,
        translateText,
        translateBulk,
        refreshKey,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
