import React from "react";
import { useState } from "react";
import {
  FormControl,
  TextField,
  Box,
  Divider,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Fragment } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { arrayUnion } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { arrayRemove } from "firebase/firestore";
import { uid } from "uid";

const Comments = ({ order, orderState, setOrderState }) => {
  //comments logic
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState(orderState.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const commentData = {
      user: session.user ? session.user.name : "",
      image: session.user ? session.user.image : "",
      comment: newComment,
      id: uid(),
    };

    const docRef = doc(db, "orders", orderState.id);

    try {
      await updateDoc(docRef, {
        comments: arrayUnion(commentData),
      });

      // Update the order state to include the new comment
      setOrderState((prevState) => ({
        ...prevState,
        comments: [...prevState.comments, commentData],
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An error occurred while adding the comment.", {
        hideProgressBar: true,
      });
    } finally {
      setIsSubmitting(false);
    }

    setNewComment(""); // Clear the text field
  };

  const handleDeleteComment = async (item) => {
    const docRef = doc(db, "orders", orderState.id);

    try {
      await updateDoc(docRef, {
        comments: arrayRemove(item),
      });

      // Update the state by removing the deleted comment
      setOrderState((prevState) => ({
        ...prevState,
        comments: prevState.comments.filter(
          (comment) => comment.id !== item.id
        ),
      }));

      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <>
      {/* Comment test */}

      <Divider style={{ width: "100%", height: "100%" }}>
        <Chip label="COMMENTS" />
      </Divider>

      <FormControl
        variant="standard"
        onSubmit={handleCommentSubmit}
        component="form"
        sx={{ width: "100%", mt: 4 }}
        noValidate
        autoComplete="off"
      >
        <Box>
          <CommentIcon color="primary" />
          <TextField
            fullWidth
            label={"Type a Comment"}
            id="commentBox"
            value={newComment} // Bind the input value to the state variable
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: (
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              ),
            }}
          />
        </Box>
      </FormControl>

      <List sx={{ width: "100%" }}>
        {orderState?.comments?.map((item) => (
          <Fragment key={item.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={item.user || ""}
                  src={item.image || ""}
                  sx={{ bgcolor: "blue[700]" }}
                />
              </ListItemAvatar>
              <ListItemText
                sx={{ width: "100%" }}
                primary={<>{item.user.split(" ")[0]}</>}
                secondary={<>{item.comment}</>}
              />
              <ListItemText
                onClick={() => handleDeleteComment(item)}
                secondary={
                  <>
                    <IconButton aria-label="delete" size="small">
                      <DeleteForeverIcon />
                    </IconButton>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </Fragment>
        ))}
      </List>
    </>
  );
};

export default Comments;
