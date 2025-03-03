import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import plFlag from "../assets/pl.png";
import usFlag from "../assets/us.png";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(localStorage.getItem("language") || "pl");

    useEffect(() => {
        i18n.changeLanguage(language);
        localStorage.setItem("language", language);
    }, [language, i18n]);

    const toggleLanguage = () => {
        setLanguage((prevLang) => (prevLang === "pl" ? "en" : "pl"));
    };

    return (
        <IconButton onClick={toggleLanguage}>
            <img
                src={language === "pl" ? plFlag : usFlag}
                alt="Language flag"
                style={{ width: 25, height: 25, borderRadius: "50%" }}
            />
        </IconButton>
    );
};

export default LanguageSwitcher;
