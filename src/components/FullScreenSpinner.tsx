import { CircularProgress, Dialog, DialogContent } from "@mui/material";

export const FullScreenSpinner = () => {
  return (
    <>
      <Dialog open>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    </>
  );
};
