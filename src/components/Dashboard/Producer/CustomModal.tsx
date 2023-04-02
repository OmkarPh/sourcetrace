import React from "react";
import { Backdrop, Box, Fade, Modal } from "@mui/material";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const style = {
  position: "absolute" as "absolute",
  bgcolor: "background.paper",
  boxShadow: 24,
  border: "0",
};

const CustomModal = (
  props: React.PropsWithChildren<ModalProps> &
    React.HTMLAttributes<HTMLDivElement>
) => {
  const { isOpen, onClose, children, ...otherProps } = props;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Fade in>
        <Box
          sx={style}
          className="border-0 focus-visible:outline-none"
          {...otherProps}
        >
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};

export const CustomModalHeader = (
  props: React.PropsWithChildren<{}> & React.HTMLAttributes<HTMLDivElement>
) => {
  return (
    <div className="text-lg font-bold flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
      {props.children}
    </div>
  );
};

export const CustomModalFooter = (
  props: React.PropsWithChildren<{}> & React.HTMLAttributes<HTMLDivElement>
) => {
  return (
    <div
      className="flex items-center justify-end p-3 border-t border-solid border-slate-200 rounded-b"
      {...props}
    >
      {props.children}
    </div>
  );
};

export default CustomModal;
