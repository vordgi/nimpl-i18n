import React from "react";
import { I18nContext } from "./lib/I18nContext";
import I18nTransmitter, { type I18nTransmitterProps } from "./I18nTransmitter";

type I18nProviderProps = {
    lang: string;
    children: React.ReactNode;
    clientTerms?: I18nTransmitterProps["terms"];
};

const I18nProvider: React.FC<I18nProviderProps> = ({ children, lang, clientTerms = [] }) => {
    return (
        <I18nContext.Provider value={{ lang }}>
            <I18nTransmitter terms={clientTerms} cleanThread>
                {children}
            </I18nTransmitter>
        </I18nContext.Provider>
    );
};

export default I18nProvider;
