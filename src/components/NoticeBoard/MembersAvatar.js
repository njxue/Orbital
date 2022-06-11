import { AvatarGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ref } from "../../config/firebase";
import MemberAvatar from "./MemberAvatar";

function MembersAvatar(props) {
  const { groupId, isExpanded, leader } = props;
  const groupMembersRef = ref.child(`groupMembers/${groupId}`);
  const [members, setMembers] = useState([]);
  console.log(members);
  useEffect(() => {
    groupMembersRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const tmp = [];
      for (const k in data) {
        tmp.push(k);
      }
      setMembers(tmp);
    });
  }, [groupId]);

  return (
    <AvatarGroup size="sm" spacing={-2} max={isExpanded ? 10 : 3}>
      {members.map((memberUid) => (
        <MemberAvatar memberUid={memberUid} isExpanded={isExpanded} />
      ))}
    </AvatarGroup>
  );
}

export default MembersAvatar;
