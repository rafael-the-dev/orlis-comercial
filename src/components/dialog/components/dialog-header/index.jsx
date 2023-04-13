import { DialogTitle, IconButton } from "@mui/material";
import classNames from "classnames";

import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialogTitle = (props) => {
    const { children, classes, id, onClose, ...other } = props;
  
    return (
      <DialogTitle 
        id={id}
          className={classNames(classes?.root, "border-b border-solid border-slate-200 pb-3 dark:text-slate-300 dark:border-slate-400")} sx={{ m: 0, p: 2, paddingLeft: 0 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes?.button}
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon className={classes?.icon} />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
};

const DialogHeader = ({ classes, children, id, onClose }) => {
    
    return (
        <BootstrapDialogTitle classes={classes} id={id} onClose={onClose}>
            { children }
        </BootstrapDialogTitle>
    );
};

export default DialogHeader;