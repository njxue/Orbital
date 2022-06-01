import { Button, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { ref } from "../../config/firebase";
import RequestItem from "./RequestItem";
import Loader from "../layout/Loader";

function Requests(props) {
  const { groupData } = props;
  const { groupId } = groupData;
  const [requests, setRequests] = useState();
  const [eventName, setEventName] = useState();

  useEffect(() => {
    ref.child(`notices/${groupId}`).on("value", async (snapshot) => {
      var tmp = [];
      if (snapshot.exists()) {
        const data = await snapshot.val();
        if (data.applicants) {
          tmp = Object.keys(data.applicants);
        }
        setEventName(data.event);
      }
      setRequests(tmp);
 
    });
  }, []);
 
  return requests == undefined || eventName == undefined ? (
    <Loader />
  ) : (
    <Menu>
      <MenuButton variant="ghost" as={Button} rightIcon={<ChevronRightIcon />}>
        Requests
      </MenuButton>

      <MenuList>
        {requests.length > 0 ? (
          requests.map((req) => (
            <RequestItem
              applicantUid={req}
              groupId={groupId}
              eventName={eventName}
            />
          ))
        ) : (
          <Text textAlign="center" color="gray">No requests</Text>
        )}
      </MenuList>
    </Menu>
  );
}

export default Requests;
