import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CircularProgress,
  Container,
  Stack,
} from "@mui/material";
import { memo } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useCreate } from "../hooks/useCreate";
import { createGroup } from "../services/api/groups";
import { MyInvitationsCard } from "./MyInvitationsCard";

const GroupRegisterPageBase = () => {
  const { user } = useAuthContext();
  const [creating, handleCreation, createdGroupRef] = useCreate();
  const { t } = useTranslation();

  return (
    <>
      <Container>
        <Box sx={{ marginBottom: "75px", marginTop: "2rem" }}>
          <Stack spacing={2}>
            <Card>
              <CardActionArea
                onClick={() => {
                  if (!user) {
                    return;
                  }
                  handleCreation(() =>
                    createGroup({
                      creatorUid: user.uid,
                      name: t("group.myFirstGroup"),
                    })
                  );
                }}
              >
                {creating || createdGroupRef ? (
                  <CircularProgress />
                ) : (
                  <CardHeader
                    title={t("actions.createGroup")}
                    subheader={t("group.createGroupDescription")}
                  />
                )}
              </CardActionArea>
            </Card>
            <MyInvitationsCard />
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export const GroupRegisterPage = memo(GroupRegisterPageBase);
