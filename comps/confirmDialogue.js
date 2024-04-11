import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


   const ConfirmDialog = ({ open, setOpen, onConfirm }) => {
    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton
           onClick={() => setOpen(false)}
           sx={{mr:3, mt:1}}
           >
            x
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>Are You Sure You Want to Delete This Order?</Typography>
        </DialogContent>

        <DialogActions>

          <Button color="primary" variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button color="error" variant="outlined" onClick={onConfirm}>
            <DeleteForeverIcon sx={{mr:0.4}} />Delete
          </Button>

        </DialogActions>
      </Dialog>
    );
   };
   
   export default ConfirmDialog;
   