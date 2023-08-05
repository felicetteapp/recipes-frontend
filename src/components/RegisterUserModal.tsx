import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}
const RegisterUserModalBase = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

  const handleOnCreate = useCallback(async () => {
    setCreating(true);
    setError(false);
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
    } catch (e) {
      // TODO: handle each error type
      setError(true);
      setCreating(false);
    }
  }, [email, password]);
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>{t("actions.createUser")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            variant="outlined"
            fullWidth
            label={t("common.email")}
            placeholder={t("common.email")}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            type="email"
          />
          <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
            <InputLabel>{t("common.password")}</InputLabel>
            <OutlinedInput
              type={passwordVisible ? "text" : "password"}
              placeholder={t("common.password")}
              label={t("common.password")}
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
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
            error={password !== passwordConfirm}
          >
            <InputLabel>{t("common.passwordConfirm")}</InputLabel>
            <OutlinedInput
              type={passwordConfirmVisible ? "text" : "password"}
              placeholder={t("common.passwordConfirm")}
              label={t("common.passwordConfirm")}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setPasswordConfirmVisible((state) => !state)}
                    edge="end"
                  >
                    {passwordConfirmVisible ? (
                      <Icon>visibility_off</Icon>
                    ) : (
                      <Icon>visibility</Icon>
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
      </DialogContent>
      {error && (
        <DialogContent>
          <Alert severity="error" onClose={() => setError(false)}>
            {t("common.genericError")}
          </Alert>
        </DialogContent>
      )}
      <DialogActions>
        <Button fullWidth color="inherit" onClick={onClose}>
          {t("actions.cancel")}
        </Button>
        <Button fullWidth variant="contained" onClick={handleOnCreate}>
          {creating ? <CircularProgress /> : t("actions.createUser")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const RegisterUserModal = memo(RegisterUserModalBase);
