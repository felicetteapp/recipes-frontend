import {
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGroup } from "../hooks/useGroup";
import { memo } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}
const ChangeGroupModalBase = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const { id: groupId, availableGroups, changeGroup } = useGroup();
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>{t("actions.changeGroup")}</DialogTitle>
      <List disablePadding>
        {availableGroups.map(({ id, name }) => (
          <ListItemButton
            key={id}
            selected={id === groupId}
            onClick={() => {
              changeGroup(id);
              onClose();
            }}
          >
            <ListItemText primary={name} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
};

export const ChangeGroupModal = memo(ChangeGroupModalBase);
