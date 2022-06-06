import {
  VStack,
  Text,
  Avatar,
  HStack,
  Flex,
  Box,
  Heading,
} from "@chakra-ui/react";
import { ref } from "../../config/firebase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "../layout/Loader";
import MajorBadge from "../ProfilePage/MajorBadge";
import UserPosts from "../ProfilePage/UserPosts";

function UsersProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState();
  const [uid, setUid] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    ref
      .child("usernames")
      .child(username)
      .once("value", async (snapshot) => {
        if (!snapshot.exists()) {
          navigate("/dne");
        }
        const data = await snapshot.val();
        setUid(data);
        ref
          .child("users")
          .child(data)
          .child("profile")
          .once("value", (snapshot) => {
            setUserData(snapshot.val());
          });
      });
  }, [username]);

  console.log(userData);
  return userData == undefined ? (
    <Loader />
  ) : (
    <VStack w="100%" alignItems="start" padding={3}>
      <Flex
        direction="row"
        alignItems="center"
        wrap="wrap"
        justifyContent="space-between"
        gap={10}
      >
        <HStack maxW="50vw" id="attributes">
          <Avatar src={userData.photoURL} size="2xl" />
          <Box>
            <Flex direction="column" alignItems="start" wrap="wrap">
              <Heading noOfLines={2}>{username}</Heading>
              <MajorBadge major={userData.major} />
            </Flex>
          </Box>
        </HStack>
        {userData.bio && (
          <Box maxH="10vh">
            <Heading>
              <i>"{userData.bio}"</i>
            </Heading>
          </Box>
        )}
      </Flex>
      <UserPosts uid={uid} />
    </VStack>
  );
}

export default UsersProfile;
