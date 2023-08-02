import { Dialog, DialogContent, styled } from "@mui/material";

import spinnerImg from "../assets/felicette_logo.gif";
import { useTranslation } from "react-i18next";

const Img = styled("img")`
  max-width: 100%;
  user-select: none;
  pointer-events: none;
`;

export const FullScreenSpinner = () => {
  const { t } = useTranslation();
  return (
    <>
      <Dialog open>
        <DialogContent>
          <Img src={spinnerImg} alt={t("common.loading")} />
        </DialogContent>
      </Dialog>
    </>
  );
};
