// prettier-ignore
import { Card, Typography, CardHeader, CardContent, CardActions, Button, TextField, Avatar, IconButton, withStyles } from '@material-ui/core';
import { AddAPhoto } from "@material-ui/icons";

const NewPost = ({
  auth,
  classes,
  addPost,
  handleChange,
  text,
  photo,
  loading
}) => (
  <Card className={classes.card}>
    <CardHeader
      avatar={<Avatar src={`/api/users/photo/${auth.user._id}`} />}
      title={
        <Typography variant="h6" component="h2">
          {auth.user.name}
        </Typography>
      }
      className={classes.cardHeader}
    />
    <CardContent className={classes.cardContent}>
      <TextField
        id="outlined-full-width"
        label="Add a status"
        value={text}
        name="text"
        multiline
        rows="2"
        placeholder={`What's on your mind, ${auth.user.name}?`}
        fullWidth
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          shrink: true
        }}
      />
      <input
        accept="image/*"
        name="photo"
        onChange={handleChange}
        className={classes.input}
        id="icon-button-file"
        type="file"
      />
      <label htmlFor="icon-button-file">
        <IconButton
          color="secondary"
          className={classes.photoButton}
          component="span"
        >
          <AddAPhoto />
        </IconButton>
      </label>{" "}
      <span className={classes.filename}>{photo && photo.name}</span>
    </CardContent>
    <CardActions className={classes.cardActions}>
      <Button
        color="primary"
        variant="contained"
        disabled={!text || loading}
        onClick={addPost}
        className={classes.submit}
      >
        POST
      </Button>
    </CardActions>
  </Card>
);

const styles = theme => ({
  card: {
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: "rgba(22, 214, 87, 0.2)"
  },
  cardContent: {
    backgroundColor: "white"
  },
  input: {
    display: "none"
  },
  cardActions: {
    display: "flex",
    flexDirection: "row-reverse"
  }
});

export default withStyles(styles)(NewPost);
