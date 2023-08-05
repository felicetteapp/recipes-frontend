import {
  Alert,
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
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { memo, useCallback, useEffect, useState } from "react";
import { firebaseApp } from "../services/firebase";
import { useTranslation } from "react-i18next";
import { RegisterUserModal } from "./RegisterUserModal";
import felicetteRecipeLogo from "../assets/felicette_recipes_logo.png";
import { useMatch, useNavigate } from "react-router-dom";
const LoginFormBase = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const isRegisterUserRoute = useMatch("login/register");

  const handleOnSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setError(false);
        setSending(true);
        await signInWithEmailAndPassword(getAuth(firebaseApp), email, password);
      } catch (e) {
        // TODO handle each error type
        setError(true);
        setSending(false);
      }
    },
    [email, password]
  );

  useEffect(() => {
    if (isRegisterUserRoute) {
      setRegisterModal(true);
    } else {
      setRegisterModal(false);
    }
  }, [isRegisterUserRoute]);

  return (
    <>
      <Container>
        <Stack
          direction="row"
          spacing={1}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <LogoImg src={felicetteRecipeLogo} />
          <Stack>
            <Typography variant="h5" color="primary">
              {t("felicette.felicette")}
            </Typography>
            <Typography variant="h6" color="secondary">
              {t("felicette.recipes")}
            </Typography>
          </Stack>
        </Stack>
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
            {error && (
              <CardContent>
                <Alert severity="error" onClose={() => setError(false)}>
                  {t("common.genericError")}
                </Alert>
              </CardContent>
            )}
            <CardActions>
              {sending ? (
                <Button fullWidth disabled>
                  <CircularProgress />
                </Button>
              ) : (
                <Button type="submit" variant="contained" fullWidth>
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
          onClick={() => navigate("register")}
        >
          {t("actions.createUser")}
        </Button>
      </Container>
      <RegisterUserModal open={registerModal} onClose={() => navigate(-1)} />
    </>
  );
};

export const LoginForm = memo(LoginFormBase);

const LogoImg = styled("img")`
  height: auto;
  max-width: min(100%, 100px);
`;
