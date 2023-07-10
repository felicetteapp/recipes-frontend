import { List, ListItemButton, ListItemText } from "@mui/material";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelectorListBase = ({ onChange }: { onChange: () => void }) => {
  const {
    i18n: {
      changeLanguage,
      language,
      options: { supportedLngs },
    },
  } = useTranslation();

  const availableLanguages = useMemo(() => {
    if (!supportedLngs) {
      return [];
    }

    return supportedLngs.filter((lang) => lang !== "cimode");
  }, [supportedLngs]);

  const languagesNames = new Intl.DisplayNames([language], {
    type: "language",
  });

  return (
    <List sx={{ pt: 0 }}>
      {availableLanguages.map((lang) => {
        const originalName = new Intl.DisplayNames([lang], {
          type: "language",
        });
        return (
          <ListItemButton
            selected={lang === language}
            key={lang}
            onClick={() => {
              changeLanguage(lang);
              onChange();
            }}
          >
            <ListItemText
              primary={languagesNames.of(lang)}
              secondary={originalName.of(lang)}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};

export const LanguageSelectorList = memo(LanguageSelectorListBase);
