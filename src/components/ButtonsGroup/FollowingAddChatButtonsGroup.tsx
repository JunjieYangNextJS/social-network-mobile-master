import { StyleSheet, View } from "react-native";
import React from "react";
import FollowButton from "../Buttons/FollowButton";
import ChatButton from "../Buttons/ChatButton";
import AddFriendButton from "../Buttons/AddFriendButton";
import { Friend, OtherUser, User, WhoCanMessageMe } from "../../../types";

interface IFollowingAddChatButtonsGroup {
  wrapperStyle: any;
  noFriendButton?: boolean;
  user: User;
  otherUser: OtherUser | Friend;
}

export default function FollowingAddChatButtonsGroup({
  wrapperStyle,
  noFriendButton,
  user,
  otherUser,
}: IFollowingAddChatButtonsGroup) {
  const {
    friendList,
    whoCanMessageMe,
    allowFriending,
    allowFollowing,
    followers,
    username,
  } = otherUser;

  return (
    <View style={wrapperStyle}>
      <View style={styles.button}>
        {allowFollowing && (
          <FollowButton
            myId={user._id}
            otherUserId={otherUser._id}
            otherUserFollowers={followers}
            otherUserUsername={username}
          />
        )}
      </View>
      <View style={styles.button}>
        {(whoCanMessageMe === "anyone" ||
          (whoCanMessageMe === "friendsOnly" &&
            friendList.includes(user._id))) && <ChatButton />}
      </View>
      {!noFriendButton && (
        <View>
          {allowFriending && (
            <AddFriendButton user={user} otherUser={otherUser} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexWrap: "wrap",
  },
});