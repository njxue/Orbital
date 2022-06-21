import { Heading, Box, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import MembersAvatar from "../NoticeBoard/MembersAvatar";

function LoungeItem(props) {
  const { groupId } = props;
  const groupNameRef = ref.child(`groups/${groupId}/name`);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    groupNameRef.on("value", (snapshot) => {
      setName(snapshot.val());
    });
  }, [groupId]);

  return (
    <Box
      shadow="md"
      padding={3}
      borderWidth="1px"
      cursor="pointer"
      onClick={() => navigate(`/group/${groupId}`)}
    >
      <HStack justifyContent="space-between">
        <Heading size="sm">{name}</Heading>
        <MembersAvatar groupId={groupId} />
      </HStack>
    </Box>
  );
}

export default LoungeItem;