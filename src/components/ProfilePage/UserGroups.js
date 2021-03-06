import {
  Divider,
  Heading,
  Skeleton,
  VStack,
  StackDivider,
  Text,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ref } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import LoungeItem from "../Dashboard/LoungeItem";
import Loader from "../layout/Loader";

function UserGroups() {
  const { currUser } = useAuth();
  const [groupIds, setGroupIds] = useState();

  useEffect(() => {
    ref.child(`users/${currUser.uid}/groups`).on("value", async (snapshot) => {
      const tmp = [];
      const data = snapshot.val();
      for (const k in data) {
        tmp.push(k);
      }
      setGroupIds(tmp);
    });
  }, [currUser]);

  return groupIds == undefined ? (
    <Loader />
  ) : (
    <VStack
      divider={<StackDivider borderColor="gray" borderWidth={1} />}
      align="stretch"
      maxW="90vw"
      shadow="lg"
      borderWidth="2px"
      borderRadius="7px"
      padding={2}
      flexGrow={1}
    >
      <Heading size="md">STUDY LOUNGES</Heading>
      <VStack shouldWrapChildren overflow="auto" maxH="550px" align="stretch">
        {groupIds[0] ? (
          groupIds.map((groupId) => {
            return <LoungeItem groupId={groupId} key={groupId} />;
          })
        ) : (
          <Center>
            <VStack spacing={0}>
              <Text color="gray">No lounges</Text>
              <Text color="gray">¯\_(ツ)_/¯</Text>
            </VStack>
          </Center>
        )}
      </VStack>
    </VStack>
  );
}

export default UserGroups;
