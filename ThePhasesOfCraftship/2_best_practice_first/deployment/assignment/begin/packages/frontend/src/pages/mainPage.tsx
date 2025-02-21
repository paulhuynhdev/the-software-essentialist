
import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { PostsList } from "../components/postsList";
import { PostsViewSwitcher } from "../components/postsViewSwitcher";
import { api } from "../App";

export const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const loadPosts = async () => {
    try {
      const response = await api.posts.getPosts('recent');
      setPosts(response.data as any)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [])

  return (
    <Layout>
      <PostsViewSwitcher />
      <PostsList
        posts={posts}
      />
    </Layout>
  );
};
