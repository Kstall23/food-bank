import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Auth from '../modules/Auth';

class DeleteStatusAlert extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
    
    let foundEmail = this.props.users.filter((element) => {
      if (element.email === this.props.email) {
        return element
        }
      })

    if (foundEmail.length === 1) {
      let searchUrl='/admin/user-collect/' + foundEmail[0]._id

      const value = {
        role: "user"
      }

      fetch(searchUrl, {
         method: 'PUT',
         headers: {
           'Content-Type' : 'application/json',
           'Accept' : 'application/json',
           Authorization: `bearer ${Auth.getToken()}`
         },
         body:JSON.stringify(value)
       })
       .then ( res   => res.json())
       .then ( data  => console.log(data))
     }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Button color="primary" onClick={this.handleClickOpen}>Delete admin</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This user no longer has adminstrative access.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary" autoFocus>
              Okay!
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteStatusAlert;