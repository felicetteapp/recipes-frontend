import { Menu, MenuItem, Dialog, DialogTitle } from "@mui/material";
import {
  type ComponentProps,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { LanguageSelectorList } from "./LanguageSelectorList";
import { useTranslation } from "react-i18next";
import { signOut, getAuth } from "firebase/auth";
import { firebaseApp } from "../services/firebase";
import { InvitesModal } from "./InvitesModal";
import { useGroup } from "../hooks/useGroup";
import { ChangeGroupModal } from "./ChangeGroupModal";
import { EditGroupModal } from "./EditGroupModal";
import { useCreate } from "../hooks/useCreate";
import { createGroup } from "../services/api/groups";
import { useAuthContext } from "../context/AuthContext";
import { FullScreenSpinner } from "./FullScreenSpinner";

interface Props {
  open: boolean;
  anchorEl: ComponentProps<typeof Menu>["anchorEl"];
  handleClose: () => void;
}
const MainMenuBase = ({ open, anchorEl, handleClose }: Props) => {
  const [openLanguageSelector, setOpenLanguageSelector] = useState(false);
  const [openInvitesModal, setOpenInvitesModal] = useState(false);
  const [openChangeGroupModal, setOpenChangeGroupModal] = useState(false);
  const [openEditGroupModal, setOpenEditGroupModal] = useState(false);
  const { t } = useTranslation();
  const { availableGroups, changeGroup } = useGroup();
  const { user } = useAuthContext();

  const handleLogoutClick = useCallback(() => {
    const doLogout = window.confirm(t("actions.logoutConfirm"));
    if (!doLogout) {
      return;
    }
    signOut(getAuth(firebaseApp));
  }, [t]);

  const [creatingGroup, handleCreateGroup, createdGroup] = useCreate();

  const handleOpenLanguageSelector = useCallback(() => {
    handleClose();
    setOpenLanguageSelector(true);
  }, [handleClose]);

  const handleCloseLanguageSelector = useCallback(() => {
    setOpenLanguageSelector(false);
  }, []);

  const handleOpenInvitesModal = useCallback(() => {
    handleClose();
    setOpenInvitesModal(true);
  }, [handleClose]);

  const handleCloseInvitesModal = useCallback(() => {
    setOpenInvitesModal(false);
  }, []);

  const handleOpenChangeGroupModal = useCallback(() => {
    handleClose();
    setOpenChangeGroupModal(true);
  }, [handleClose]);

  const handleCloseChangeGroupModal = useCallback(() => {
    setOpenChangeGroupModal(false);
  }, []);

  const handleOpenEditGroupModal = useCallback(() => {
    handleClose();
    setOpenEditGroupModal(true);
  }, [handleClose]);

  const handleCloseEditGroupModal = useCallback(() => {
    setOpenEditGroupModal(false);
  }, []);

  const handleCreateGroupClick = useCallback(() => {
    if (!user) {
      return;
    }
    handleCreateGroup(() =>
      createGroup({ creatorUid: user.uid, name: t("group.myFirstGroup") })
    );
  }, [handleCreateGroup, t, user]);

  useEffect(() => {
    if (createdGroup) {
      changeGroup(createdGroup?.id);
      handleClose();
    }
  }, [createdGroup, changeGroup, handleClose]);
  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleOpenLanguageSelector}>
          {t("actions.changeLanguage")}
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>{t("actions.logout")}</MenuItem>
        <MenuItem onClick={handleOpenInvitesModal}>
          {t("common.invite", { count: Number.POSITIVE_INFINITY })}
        </MenuItem>
        {availableGroups.length > 1 && (
          <MenuItem onClick={handleOpenChangeGroupModal}>
            {t("actions.changeGroup")}
          </MenuItem>
        )}
        <MenuItem onClick={handleOpenEditGroupModal}>
          {t("actions.editGroup")}
        </MenuItem>
        <MenuItem onClick={handleCreateGroupClick}>
          {t("actions.createGroup")}
        </MenuItem>
      </Menu>
      <Dialog
        fullWidth
        onClose={handleCloseLanguageSelector}
        open={openLanguageSelector}
      >
        <DialogTitle>{t("actions.changeLanguage")}</DialogTitle>
        <LanguageSelectorList onChange={handleCloseLanguageSelector} />
      </Dialog>
      <InvitesModal
        open={openInvitesModal}
        handleOnClose={handleCloseInvitesModal}
      />
      <ChangeGroupModal
        open={openChangeGroupModal}
        onClose={handleCloseChangeGroupModal}
      />
      <EditGroupModal
        open={openEditGroupModal}
        onClose={handleCloseEditGroupModal}
      />
      {creatingGroup && <FullScreenSpinner />}
    </>
  );
};

export const MainMenu = memo(MainMenuBase);
