import { Typography } from "@mui/material";
import { memo } from "react";
import { Trans } from "react-i18next";
import { useGroup } from "../hooks/useGroup";

const GroupNameSubHeaderBase = () => {
  const { currentGroup } = useGroup();
  return (
    <Typography variant="h5" color="text.secondary">
      <Trans
        i18nKey="group.groupName"
        values={{ name: currentGroup?.name }}
        components={{
          strong: (
            <Typography
              color="primary"
              component={"strong"}
              fontSize="inherit"
              fontWeight="bold"
            />
          ),
        }}
      />
    </Typography>
  );
};

export const GroupNameSubHeader = memo(GroupNameSubHeaderBase);
