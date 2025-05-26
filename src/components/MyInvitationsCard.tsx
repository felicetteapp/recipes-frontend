import {
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  IconButton,
  Icon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetchQuery } from "../hooks/useFetchQuery";
import type { IInvite } from "../interfaces/IInvite";
import { queryInvites, acceptInvite } from "../services/api/invites.";
import { useAuthContext } from "../context/AuthContext";
import { FullScreenSpinner } from "./FullScreenSpinner";

const MyInvitationsCardBase = () => {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const query = useMemo(() => {
    if (!user) {
      return;
    }
    if (!user.email) {
      return;
    }
    return queryInvites({ to: user.email });
  }, [user]);
  const [acceptingInvite, setAcceptingInvite] = useState(false);
  const handleAcceptIniteButton = useCallback(async (inviteId: string) => {
    setAcceptingInvite(true);
    await acceptInvite(inviteId);
  }, []);
  const [fetchingInvites, invites] = useFetchQuery<IInvite>(query);

  return (
    <>
      <Card>
        <CardHeader
          title={t("common.invite", { count: invites.length })}
          subheader={t("invite.acceptInviteDescription")}
        />
        <CardContent>
          {fetchingInvites ? (
            <CircularProgress />
          ) : (
            <List disablePadding>
              {invites.length === 0 ? (
                <ListItemButton disabled disableGutters>
                  {t("invite.inviteCount", { count: 0 })}
                </ListItemButton>
              ) : (
                invites.map((invite) => (
                  <ListItem
                    key={invite.groupId}
                    disableGutters
                    secondaryAction={
                      <IconButton
                        color="success"
                        onClick={() => {
                          if (!invite.id) {
                            return;
                          }
                          handleAcceptIniteButton(invite.id);
                        }}
                      >
                        <Icon>check</Icon>
                      </IconButton>
                    }
                  >
                    <ListItemText primary={invite.from} secondary={invite.id} />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </CardContent>
      </Card>
      {acceptingInvite && <FullScreenSpinner />}
    </>
  );
};

export const MyInvitationsCard = memo(MyInvitationsCardBase);
