import { useParams } from "react-router-dom";
import { Divider } from "@chakra-ui/react";
import Comments from "./Comments";
import Post from "./Post";
import NavBack from "../layout/NavBack";
import { ref } from "../../config/firebase";
import CommentForm from "./CommentForm";
import { useState, useEffect } from "react";
import Loader from "../layout/Loader";

function Thread() {
  const { moduleCode, category, postId } = useParams();
  const [post, setPost] = useState();
  const postRef = ref
    .child("posts")
    .child(moduleCode + category)
    .child(postId)
    .child("post");

  useEffect(() => {
    postRef.on("value", async (snapshot) => {
      const post = await snapshot.val();
      setPost(post);
    });
  }, []);

  const routeHistory = [
    {
      route: "/",
      text: "Dashboard",
    },
    {
      route: `/${moduleCode}`,
      text: `${moduleCode}`,
    },
    {
      route: `/${moduleCode}/${category}`,
      text: `${category}`,
    },
  ];
  return post == undefined ? (
    <Loader />
  ) : (
    <div>
      <NavBack routeHistory={routeHistory} />
      <Post post={post} postRef={postRef} />
      <Divider orientation="horizontal" />
      <Comments postId={postId} />
      <CommentForm
        moduleCode={moduleCode}
        category={category}
        postId={postId}
      />
    </div>
  );
}

export default Thread;
