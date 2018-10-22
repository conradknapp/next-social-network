// prettier-ignore
import { Paper, Card, CardHeader, CardContent, CardActions, Button, TextField, Avatar, IconButton, withStyles } from '@material-ui/core';
import { PhotoCamera } from "@material-ui/icons";

const NewPost = ({
  auth,
  classes,
  addPost,
  handleChange,
  text,
  photo,
  loading
}) => (
  <Paper className={classes.root}>
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar src={`/api/users/photo/${auth.user._id}`} />}
        title={auth.user.name}
        className={classes.cardHeader}
      />
      <CardContent className={classes.cardContent}>
        <TextField
          placeholder="Share your thoughts"
          multiline
          rows="3"
          value={text}
          name="text"
          onChange={handleChange}
          className={classes.textField}
          margin="normal"
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
            <PhotoCamera />
          </IconButton>
        </label>{" "}
        <span className={classes.filename}>{photo ? photo.name : ""}</span>
      </CardContent>
      <CardActions>
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
  </Paper>
);

const styles = theme => ({
  root: {
    backgroundColor: "#fafafa"
  },
  card: {
    maxWidth: 600,
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: "rgba(65, 150, 136, 0.09)"
  },
  cardContent: {
    backgroundColor: "white"
  },
  input: {
    display: "none"
  },
  textField: {
    width: "100%"
  }
});

export default withStyles(styles)(NewPost);
