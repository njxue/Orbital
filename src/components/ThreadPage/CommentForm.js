import {
  FormControl,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  Input,
  FormLabel,
  VStack,
  Textarea,
} from "@chakra-ui/react";
import { ref } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useTime } from "../../utils/helper";

function CommentForm(props) {
  const { moduleCode, category, postId } = props;
  const commentsRef = ref.child("comments").child(postId);
  const postRef = ref
    .child("posts")
    .child(moduleCode + category)
    .child(postId)
    .child("post");

  const { currUser } = useAuth();
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const timeNow = useTime();

  async function handleSubmitComment(e) {
    setError("");
    setIsLoading(true);
    e.preventDefault();

    try {
      postRef.once("value", async (snapshot) => {
        const post = await snapshot.val();
        const { title, author } = post;
        
        const commentObj = {
          author: { displayName: currUser.displayName, uid: currUser.uid },
          createdAt: timeNow,
          body: comment,
          moduleCode: moduleCode,
          category: category,
          title: title,
          postId: postId,
          deleted: false
        };

        if (author.uid != currUser.uid) {
          ref.child("notifications").child(author.uid).push(commentObj);
        }

        await commentsRef.push(commentObj);
     
      });

      setComment("");
    } catch {
      setError("Unable to submit comment. Please try again!");
    }
  }

  return (
    <>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}
      <form onSubmit={handleSubmitComment}>
        {error && <Alert variant="danger">{error}</Alert>}
        <FormControl>
          <VStack alignItems="start" margin="4">
            <FormLabel>Add comment</FormLabel>
            <Textarea
              type="text"
              placeholder="Comment"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" colorScheme="green">
              Submit
            </Button>
          </VStack>
        </FormControl>
      </form>
    </>
  );
}

export default CommentForm;
