import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  FormControl,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { memo, useCallback, useState } from "react";
import { firebaseApp } from "../services/firebase";
import { useTranslation } from "react-i18next";
import { RegisterUserModal } from "./RegisterUserModal";

const LoginFormBase = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const { t } = useTranslation();

  const handleOnSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setSending(true);
        await signInWithEmailAndPassword(getAuth(firebaseApp), email, password);
      } catch (e) {
        window.alert("ops!");
        setSending(false);
      }
    },
    [email, password]
  );

  return (
    <>
      <Container>
        <form onSubmit={handleOnSubmit}>
          <Card>
            <CardHeader title={t("actions.login")} />
            <CardContent>
              <TextField
                fullWidth
                type="email"
                placeholder={t("common.email")}
                label={t("common.email")}
                autoComplete="username"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
                <InputLabel>{t("common.password")}</InputLabel>
                <OutlinedInput
                  type={passwordVisible ? "text" : "password"}
                  placeholder={t("common.password")}
                  label={t("common.password")}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setPasswordVisible((state) => !state)}
                        edge="end"
                      >
                        {passwordVisible ? (
                          <Icon>visibility_off</Icon>
                        ) : (
                          <Icon>visibility</Icon>
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </CardContent>
            <CardActions>
              {sending ? (
                <Button fullWidth disabled>
                  <CircularProgress />
                </Button>
              ) : (
                <Button type="submit" fullWidth>
                  {t("actions.login")}
                </Button>
              )}
            </CardActions>
          </Card>
        </form>

        <Button
          color="secondary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={() => setRegisterModal(true)}
        >
          {t("actions.createUser")}
        </Button>
      </Container>
      <RegisterUserModal
        open={registerModal}
        onClose={() => setRegisterModal(false)}
      />
    </>
  );
};

export const LoginForm = memo(LoginFormBase);
