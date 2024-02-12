import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { usePosts } from "../../react-query-hooks/usePosts/usePosts";
import { useCallback, useEffect, useMemo, useState } from "react";

import PostCard from "../Posts/PostCard";
import {
  OtherUser,
  Post,
  PostFilterAbout,
  SortByValue,
  User,
} from "../../../types";
import useUser from "../../react-query-hooks/useUser/useUser";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { FlashList } from "@shopify/flash-list";
import * as SplashScreen from "expo-splash-screen";
import { RootStackParamList } from "../../navigators/RootStackNavigator";
import { useOtherUserPosts } from "../../react-query-hooks/useOtherUsers/useOtherUserPosts";

type Props = NativeStackScreenProps<RootStackParamList, "Posts">;

SplashScreen.preventAutoHideAsync();

interface IOtherUserPosts {
  otherUser: OtherUser;
  user: User;
}

const OtherUserPosts = ({ otherUser, user }: IOtherUserPosts) => {
  const { data: posts, isSuccess } = useOtherUserPosts(otherUser.id);
  const { height } = useWindowDimensions();

  const shownPosts = useMemo(() => {
    if (!posts) return;
    const filtered = posts.filter(
      (post: Post) => !user.hiddenPosts.includes(post._id)
    );

    return filtered;
  }, [posts, user]);

  if (!posts || !shownPosts) {
    return <ActivityIndicator />;
  }

  if (posts.length < 1) {
    return null;
  }

  const renderPostItem = (itemData: any) => {
    const { item } = itemData;

    const postCardProps = {
      id: item._id,
      title: item.title,
      content: item.content,
      createdAt: item.createdAt,
      lastCommentedAt: item.lastCommentedAt,
      likes: item.likes,
      poll: item.poll,
      poster: item.poster,
      images: item.images,
      commentCount: item.commentCount,
      modFavored: item.modFavored,
      sticky: item.sticky,
      editedAt: item.editedAt,
      userId: user._id,
      userBookmarkedPosts: user.bookmarkedPosts,
    };

    return <PostCard {...postCardProps} />;
  };

  // console.log(shownPosts, "shown");

  // useEffect(() => {
  //   if (!shownPosts) {
  //     SplashScreen.preventAutoHideAsync();
  //   }

  //   SplashScreen.hideAsync();
  // }, [shownPosts]);

  return (
    <View
      style={{
        flex: 1,
        marginTop: 5,
        height: height - 210,
      }}
    >
      <FlashList
        data={shownPosts}
        keyExtractor={(item: Post) => item._id}
        renderItem={renderPostItem}
        estimatedItemSize={posts.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
});

export default OtherUserPosts;