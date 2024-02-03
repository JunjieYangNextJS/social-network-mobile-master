import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import { usePosts } from "../../react-query-hooks/usePosts/usePosts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import PostCard from "./PostCard";
import { Post } from "../../../types";
import useUser from "../../react-query-hooks/useUser/useUser";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { FlashList } from "@shopify/flash-list";
import * as SplashScreen from "expo-splash-screen";
import { RootStackParamList } from "../../navigators/RootStackNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Posts">;

SplashScreen.preventAutoHideAsync();

const Posts = ({}: Props) => {
  const { data: posts, isSuccess } = usePosts();
  const { data: user } = useUser();

  const shownPosts = useMemo(() => {
    if (!user || !posts) return;
    const filtered = posts.filter(
      (post: Post) => !user.hiddenPosts.includes(post._id)
    );

    return filtered;
  }, [posts, user]);

  const onLayout = useCallback(async () => {
    if (shownPosts) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.

      await SplashScreen.hideAsync();
    }
  }, [shownPosts]);

  if (!shownPosts || !user) {
    return <ActivityIndicator />;
  }

  const renderPostItem = (itemData: any) => {
    // const onPress = () => {
    //   navigation.navigate("Post")
    // }
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
    <SafeAreaView style={styles.container} onLayout={onLayout}>
      <FlashList
        data={shownPosts}
        keyExtractor={(item: Post) => item._id}
        renderItem={renderPostItem}
        estimatedItemSize={posts?.length}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default Posts;
