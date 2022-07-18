import Votes from "./Votes";

import { useState } from "react";
import EditPost from "./EditPost";
import { VStack, Box, Text, Flex, Spacer, HStack } from "@chakra-ui/react";
import PinButton from "./PinButton";
import EditButton from "./EditButton";
import { useEditRights } from "../../utils/helper";
import AuthorDetails from "./AuthorDetails";
import { ref } from "../../config/firebase";
import parse from "html-react-parser";
import { updateCurrentUser } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";

function Post(props) {
  const { post } = props;
  const { currUser } = useAuth();
  const votesRef = ref.child(`votes/${post.postId}`);
  const { author, title, body, createdAt, postId } = post;

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {post && (
        <VStack align="stretch">
          <Flex
            width="100%"
            bg="#E9E9E9"
            alignItems="center"
            gap={2}
            padding={4}
          >
            <AuthorDetails author={author} createdAt={createdAt} />
            <Spacer />

            <HStack spacing={5}>
              <PinButton postId={postId} />
              {currUser && currUser.uid == author && (
                <EditButton setIsEditing={setIsEditing} />
              )}
              <Votes votesRef={votesRef} />
            </HStack>
          </Flex>
          {isEditing ? (
            <EditPost post={post} setIsEditing={setIsEditing} />
          ) : (
            <Box paddingLeft="4" paddingBottom="2">
              <Text data-testId="title">
                <strong>{title}</strong>
              </Text>
              <Box data-testId="body">{parse(body)}</Box>
            </Box>
          )}
        </VStack>
      )}
    </>
  );
}

export default Post;
