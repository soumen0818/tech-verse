import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Post, Community, Profile, UserRole } from '@/types';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Communities
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<string[]>([]);

  // User Profile
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  // Fetch posts
  const fetchPosts = async (category?: 'news' | 'tutorial' | 'discussion' | 'meme' | 'quick_news') => {
    try {
      console.log('Fetching posts, category:', category);

      let query = supabase
      .from('posts')
      .select(`
        id, created_at, title, content, category, is_published, author_id, community_id,
        author:profiles(username, display_name, avatar_url),  
        communities(name),
        likes:likes(user_id), 
        comments(count)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched posts:', data);

      // Transform data to include counts
      const transformedPosts = (data || []).map(post => ({
        ...post,
        likes: post.likes || [],
        comments: post.comments[0]?.count || 0
      })) as unknown as Post[];

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch communities
  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          community_members(count),
          posts(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include counts
      const transformedCommunities = (data || []).map(({ community_members, posts, ...community }) => ({
        ...community,
        member_count: community_members[0]?.count || 0,
        post_count: posts[0]?.count || 0
      }));

      setCommunities(transformedCommunities);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  // Fetch user communities
  const fetchUserCommunities = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserCommunities(data?.map(item => item.community_id) || []);
    } catch (error) {
      console.error('Error fetching user communities:', error);
    }
  };

  // Like/Unlike post
  const toggleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
        toast({ title: "Post unliked" });
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;
        toast({ title: "Post liked!" });
      }

      // Refresh posts
      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
      return false;
    }
  };

  // Join/Leave community
  const toggleCommunityMembership = async (communityId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join communities",
        variant: "destructive"
      });
      return;
    }

    try {
      const isJoined = userCommunities.includes(communityId);

      if (isJoined) {
        // Leave
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('user_id', user.id);

        if (error) throw error;
        toast({ title: "Left community" });
      } else {
        // Join
        const { error } = await supabase
          .from('community_members')
          .insert({ community_id: communityId, user_id: user.id });

        if (error) throw error;
        toast({ title: "Joined community!" });
      }

      fetchUserCommunities();
      fetchCommunities();
    } catch (error) {
      console.error('Error toggling community membership:', error);
      toast({
        title: "Error",
        description: "Failed to update membership",
        variant: "destructive"
      });
    }
  };

  // Create new post
  const createPost = async (postData: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          ...postData,
          author_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      toast({ title: "Post created successfully!" });
      fetchPosts();
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
      return null;
    }
  };

  // Create new community
  const createCommunity = async (communityData: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('communities')
        .insert({
          ...communityData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join the creator
      await supabase
        .from('community_members')
        .insert({
          community_id: data.id,
          user_id: user.id,
          role: 'admin'
        });

      toast({ title: "Community created successfully!" });
      fetchCommunities();
      fetchUserCommunities();
      return data;
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: "Error",
        description: "Failed to create community",
        variant: "destructive"
      });
      return null;
    }
  };

  // Search functionality
  const searchContent = async (query: string) => {
    if (!query.trim()) return [];

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, created_at, title, content, category, is_published, author_id, community_id,
          author_id:profiles(username, display_name, avatar_url),
          communities(name)
        `)
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    }
  };

  // Subscribe to newsletter
  const subscribeNewsletter = async (email: string) => {
    try {
      // In a real app, you'd integrate with an email service
      // For now, we'll just simulate the subscription
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our latest tech updates."
      });

      // TODO: Integrate with email service like Mailchimp, ConvertKit, etc.
      console.log('Newsletter subscription for:', email);
      return true;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe to newsletter",
        variant: "destructive"
      });
      return false;
    }
  };

  // Fetch user profile and roles
  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      setUserProfile(profileData);

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (rolesError) throw rolesError;
      setUserRoles(rolesData || []);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: any) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({ title: "Profile updated successfully!" });
      fetchUserProfile();
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      return false;
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchPosts(),
          fetchCommunities(),
          user ? fetchUserProfile() : Promise.resolve(),
          user ? fetchUserCommunities() : Promise.resolve()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast({
          title: "Error",
          description: "Failed to load application data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // Set up real-time subscriptions
    const postsChannel = supabase
      .channel('posts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => {
        fetchPosts();
      })
      .subscribe();

    const communitiesChannel = supabase
      .channel('communities_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'communities' }, () => {
        fetchCommunities();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_members' }, () => {
        fetchCommunities();
        if (user) fetchUserCommunities();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(communitiesChannel);
    };
  }, [user]);

  return {
    // Data
    posts,
    communities,
    userCommunities,
    userProfile,
    userRoles,
    loading,

    // Actions
    fetchPosts,
    toggleLike,
    toggleCommunityMembership,
    createPost,
    createCommunity,
    searchContent,
    subscribeNewsletter,
    updateUserProfile,

    // Utils
    isUserJoined: (communityId: string) => userCommunities.includes(communityId),
    isAdmin: userRoles.some(role => role.role === 'admin'),
    isModerator: userRoles.some(role => role.role === 'moderator' || role.role === 'admin'),

    // User likes check
    isPostLiked: (postId: string) => {
      if (!user) return false;
      const post = posts.find(p => p.id === postId);
      return post?.likes?.some((like: any) => like.user_id === user.id) || false;
    }
  };
};
