import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";
import AddAPhoto from "@material-ui/icons/AddAPhoto";

const NewPost = ({
  auth,
  classes,
  handleAddPost,
  handleChange,
  text,
  image,
  isAddingPost
}) => (
  <Card className={classes.card}>
    <CardHeader
      avatar={<Avatar src={auth.user.avatar} />}
      title={
        <Typography variant="h6" component="h2">
          {auth.user.name}
        </Typography>
      }
      className={classes.cardHeader}
    />
    <CardContent className={classes.cardContent}>
      <TextField
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
        name="image"
        onChange={handleChange}
        // className={classes.input}
        type="file"
      />
      {/* <IconButton
        color="secondary"
        className={classes.photoButton}
        component="span"
      >
        <AddAPhoto />
      </IconButton> */}
      <span className={classes.filename}>{image && image.name}</span>
    </CardContent>
    <CardActions className={classes.cardActions}>
      <Button
        color="primary"
        variant="contained"
        disabled={!text || isAddingPost}
        onClick={handleAddPost}
        className={classes.submit}
      >
        {isAddingPost ? "Sending" : "Post"}
      </Button>
    </CardActions>
  </Card>
);

const styles = theme => ({
  card: {
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: theme.palette.primary.light
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
