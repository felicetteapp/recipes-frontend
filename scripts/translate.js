const { readFileSync, writeFileSync } = require("fs");
const path = require("path");
const originalFile = require("../public/locales/en/translation.json");
const _ = require("underscore");

const translator = require("@parvineyvazov/json-translator");

global.source = translator.Sources.BingTranslate;

const availableLanguages = [
  translator.languages.Portuguese,
  translator.languages.Spanish,
  translator.languages.French,
];

const currentTranslations = availableLanguages.map((thisLang) => {
  try {
    const redFile = readFileSync(
      path.resolve(
        __dirname,
        "..",
        `public/locales/${thisLang}/translation.json`
      )
    );

    const parsedDAta = JSON.parse(redFile);
    return [thisLang, parsedDAta];
  } catch (e) {
    return [thisLang, {}];
  }
});

const getKeysComparision = (obj, otherObj) => {
  const response = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (_.isObject(obj[key])) {
      response[key] = getKeysComparision(obj[key] || {}, otherObj[key] || {});
    } else {
      response[key] = otherObj[key];
    }
  });
  return response;
};

const fillObject = (obj, otherObj) => {
  const response = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (_.isObject(obj[key])) {
      response[key] = fillObject(obj[key] || {}, otherObj[key] || {});
    } else {
      response[key] = obj[key] || otherObj[key];
    }
  });
  return response;
};

const filledData = currentTranslations.map(async ([thisLang, thisLangData]) => {
  const comparision = getKeysComparision(originalFile, thisLangData);
  const translated = await translator.translateObject(
    originalFile,
    translator.languages.English,
    thisLang
  );

  const final = fillObject(comparision, translated);

  writeFileSync(
    path.resolve(
      __dirname,
      "..",
      `public/locales/${thisLang}/translation.json`
    ),
    JSON.stringify(final, undefined, 1)
  );
  return final;
});

Promise.all(filledData).then((data) => {
  console.log(JSON.stringify(data));
});
