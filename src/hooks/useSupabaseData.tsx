import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Communities
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);

  // User Profile
  const [userProfile, setUserProfile] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  // Fetch posts
  const fetchPosts = async (category?: 'news' | 'tutorial' | 'discussion' | 'meme' | 'quick_news') => {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles(username, display_name, avatar_url),
          communities(name),
          likes(count),
          comments(count)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
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
      setCommunities(data || []);
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
      return;
    }

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

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
      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
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
          *,
          profiles(username, display_name, avatar_url),
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
        .select('role')
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
      await Promise.all([
        fetchPosts(),
        fetchCommunities(),
        fetchUserProfile()
      ]);
      
      if (user) {
        await fetchUserCommunities();
      }
      
      setLoading(false);
    };

    loadInitialData();
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
    isModerator: userRoles.some(role => role.role === 'moderator' || role.role === 'admin')
  };
};