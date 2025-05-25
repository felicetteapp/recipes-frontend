import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreate } from "../hooks/useCreate";
import {
  createInvite,
  deleteInvite,
  queryInvites,
} from "../services/api/invites.";
import { useGroup } from "../hooks/useGroup";
import { useFetchQuery } from "../hooks/useFetchQuery";
import { IInvite } from "../interfaces/IInvite";
import { useDelete } from "../hooks/useDelete";
import { FullScreenSpinner } from "./FullScreenSpinner";
import { useAuthContext } from "../context/AuthContext";
import { MyInvitationsCard } from "./MyInvitationsCard";

interface Props {
  open: boolean;
  handleOnClose: () => void;
}

const InvitesModalBase = ({ open, handleOnClose }: Props) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const { id } = useGroup();

  const invitesQuery = useMemo(() => {
    if (!id) {
      return;
    }
    return queryInvites({ groupId: id });
  }, [id]);

  const [fetchingInvites, invites] = useFetchQuery<IInvite>(invitesQuery);
  const [creating, handleCreation] = useCreate();

  const [deleting, handleDeletion] = useDelete();
  const { user } = useAuthContext();

  const handleOnCreationClick = useCallback(() => {
    if (!id) {
      throw new Error("missing group id");
    }
    if (!user) {
      throw new Error("missing user");
    }

    const userEmail = user.email;
    if (!userEmail) {
      throw new Error("missing email");
    }

    handleCreation(() =>
      createInvite({ to: email, groupId: id, from: userEmail })
    );
  }, [id, handleCreation, email, user]);

  return (
    <Dialog fullScreen open={open}>
      <DialogTitle>
        <IconButton
          edge="start"
          onClick={handleOnClose}
          sx={{ marginRight: 2 }}
        >
          <Icon>arrow_back</Icon>
        </IconButton>
        {t("common.invite", { count: Number.POSITIVE_INFINITY })}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <MyInvitationsCard />
          <Divider />
          <Card>
            <CardHeader
              title={t("invite.newInvite")}
              subheader={t("invite.inviteUserDescription")}
            />
            <CardContent>
              <TextField
                fullWidth
                variant="outlined"
                label={t("common.email")}
                placeholder={t("common.email")}
                value={email}
                type="email"
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                color="success"
                onClick={handleOnCreationClick}
                disabled={creating}
              >
                {creating ? <CircularProgress /> : t("actions.send")}
              </Button>
            </CardActions>
          </Card>
          <Card>
            <CardHeader
              title={t("invite.sentInvite", { count: invites.length })}
            />
            <CardContent>
              <List disablePadding>
                {fetchingInvites ? (
                  <ListItemButton disabled disableGutters>
                    <CircularProgress />
                  </ListItemButton>
                ) : (
                  invites.map(({ to, from, id }) => (
                    <ListItem
                      disableGutters
                      key={to}
                      secondaryAction={
                        <IconButton
                          color="error"
                          onClick={() => {
                            if (!id) {
                              return;
                            }
                            const confirmed = window.confirm(
                              t("action.deleteConfirm")
                            );
                            if (confirmed) {
                              handleDeletion(() => deleteInvite(id));
                            }
                          }}
                        >
                          <Icon>delete</Icon>
                        </IconButton>
                      }
                    >
                      <ListItemText primary={to} secondary={from} />
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: "25px" }}>
        <Button onClick={handleOnClose} fullWidth variant="contained">
          {t("common.ok")}
        </Button>
      </DialogActions>
      {deleting && <FullScreenSpinner />}
    </Dialog>
  );
};

export const InvitesModal = memo(InvitesModalBase);
