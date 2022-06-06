import { VStack, Heading, StackDivider, Divider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ref } from "../../config/firebase";
import { useProfile } from "../../utils/helper";
import ThreadBox from "../Dashboard/ThreadBox";
import Loader from "../layout/Loader";

function UserPosts(props) {
  const [posts, setPosts] = useState();
  const { uid, personal } = props;
  const { username } = useProfile(uid);
  const userPostsRef = ref.child("postsByUsers").child(uid); // postIds
  useEffect(() => {
    userPostsRef.on("value", async (snapshot) => {
      const tmp = [];
      const data = await snapshot.val();
      for (const k in data) {
        tmp.push(k);
      }

      setPosts(tmp);
    });
  }, [uid]);

  return posts == undefined ? (
    <Loader />
  ) : (
    <VStack alignItems="start" maxH="60vh" padding={3}>
      <Heading fontSize="lg" fontFamily="arial">
        {personal ? "MY POSTS" : username + "'s posts"}
      </Heading>
      <Divider />
      <VStack
        overflowY="scroll"
        align="start"
        shouldWrapChildren
        divider={<StackDivider borderColor="gray.200" />}
      >
        {posts.map((postId) => (
          <>
            <ThreadBox postId={postId} key={postId} />
          </>
        ))}
      </VStack>
    </VStack>
  );
}

export default UserPosts;
