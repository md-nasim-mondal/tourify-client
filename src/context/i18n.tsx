"use client";

import React, { createContext, useContext, useState } from "react";

type Lang = "en" | "bn";

const dict: Record<Lang, Record<string, string>> = {
  en: {
    nav_home: "Home",
    nav_explore: "Explore Tours",
    nav_become_guide: "Become a Guide",
    login: "Login",
    register: "Sign Up",
  },
  bn: {
    nav_home: "হোম",
    nav_explore: "এক্সপ্লোর ট্যুরস",
    nav_become_guide: "গাইড হোন",
    login: "লগইন",
    register: "সাইন আপ",
  },
};

const I18nCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
}>({ lang: "en", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lang") as Lang | null;
      return saved || "en";
    }
    return "en";
  });
  const set = (l: Lang) => {
    setLang(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (k: string) => dict[lang][k] || k;
  return (
    <I18nCtx.Provider value={{ lang, setLang: set, t }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}
