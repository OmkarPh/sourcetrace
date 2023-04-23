import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { QRCode } from "react-qrcode-logo";

export default function LotQR(props: { text: string }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <div className="flex justify-center">
      <Button variant="outlined" onClick={handleClickOpen}>
        Lot QR code
      </Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle
          className="text-center"
          style={{ paddingBottom: 0 }}
        >
          Lot QR code
        </DialogTitle>
        <div className="p-4">
          <QRCode value={props.text} size={200} fgColor="#000" logoWidth={64} />
          {/* <div className="mt-2">{props.text}</div> */}
        </div>
      </Dialog>
    </div>
  );
}
