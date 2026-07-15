export type TranslationValue = string | TranslationObject;
export type TranslationObject = { [key: string]: TranslationValue };

export type ModuleTranslations = Record<string, TranslationObject>;
