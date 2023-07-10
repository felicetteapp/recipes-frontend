import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

  const handleOnCreate = useCallback(async () => {
    setCreating(true);
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
    } catch (e) {
      window.alert("problem creating user");
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
          <TextField
            variant="outlined"
            fullWidth
            label={t("common.password")}
            placeholder={t("common.password")}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            type="password"
          />
          <TextField
            variant="outlined"
            fullWidth
            label={t("common.passwordConfirm")}
            placeholder={t("common.passwordConfirm")}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
            type="password"
            error={password !== passwordConfirm}
          />
        </Stack>
      </DialogContent>
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
