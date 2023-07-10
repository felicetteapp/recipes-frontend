import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGroup } from "../hooks/useGroup";
import { memo, useCallback, useEffect, useState } from "react";
import { useCreate } from "../hooks/useCreate";
import { deleteGroup, updateGroup } from "../services/api/groups";
import { FullScreenSpinner } from "./FullScreenSpinner";
import { useDelete } from "../hooks/useDelete";

interface Props {
  open: boolean;
  onClose: () => void;
}
const EditGroupModalBase = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const { currentGroup, updateGroupsData } = useGroup();
  const [name, setName] = useState("");

  const [editing, handleEditing, edited] = useCreate();
  const [deleting, handleDeleting, deleted] = useDelete();

  const handleSaveClick = useCallback(() => {
    if (!currentGroup) {
      return;
    }
    handleEditing(() => updateGroup(currentGroup?.id, "name", name));
  }, [currentGroup, handleEditing, name]);

  const handleOnClickDelete = useCallback(() => {
    if (!currentGroup) {
      return;
    }
    const confirmed = window.confirm(`actions.deleteConfirm`);

    if (confirmed) {
      handleDeleting(() => deleteGroup(currentGroup?.id));
    }
  }, [handleDeleting, currentGroup]);

  useEffect(() => {
    setName(currentGroup?.name || "");
  }, [currentGroup]);

  useEffect(() => {
    if (edited) {
      updateGroupsData();
      onClose();
    }
  }, [edited, updateGroupsData, onClose]);

  useEffect(() => {
    if (deleted) {
      onClose();
    }
  }, [deleted, onClose]);

  if (!currentGroup) {
    return null;
  }
  return (
    <>
      <Dialog fullWidth open={open} onClose={onClose}>
        <DialogTitle>{t("actions.editGroup")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder={t("common.name")}
              label={t("common.name")}
              sx={{ mt: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleSaveClick}
            >
              {t("actions.save")}
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={handleOnClickDelete}
            >
              {t("actions.delete")}
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button fullWidth color="inherit" onClick={onClose}>
            {t("common.ok")}
          </Button>
        </DialogActions>
      </Dialog>
      {(editing || deleting) && <FullScreenSpinner />}
    </>
  );
};

export const EditGroupModal = memo(EditGroupModalBase);
