import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Post, Community, Profile } from '@/types';

export const useMongoData = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    // State
    const [posts, setPosts] = useState<Post[]>([]);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [userCommunities, setUserCommunities] = useState<string[]>([]);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [userRoles, setUserRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // API Base URL
    const API_BASE = '/api';

    // Fetch user profile
    const fetchUserProfile = async () => {
        if (!user) return;

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setUserProfile(data.user);
            } else {
                console.error('Error fetching user profile:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    // Fetch user communities
    const fetchUserCommunities = async () => {
        if (!user) return;

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE}/user/communities`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setUserCommunities(data.communities || []);
                console.log('Fetched user communities:', data.communities); // Debug log
            } else {
                console.error('Error fetching user communities:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user communities:', error);
        }
    };

    // Fetch user roles
    const fetchUserRoles = async () => {
        if (!user) return;

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE}/user/roles`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setUserRoles(data.roles || []);
            } else {
                console.error('Error fetching user roles:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user roles:', error);
        }
    };

    // Fetch posts
    const fetchPosts = async (category?: string) => {
        try {
            const url = category ? `${API_BASE}/posts?category=${category}` : `${API_BASE}/posts`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setPosts(data);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast({
                title: "Error",
                description: "Failed to fetch posts",
                variant: "destructive"
            });
        }
    };

    // Fetch communities
    const fetchCommunities = async () => {
        try {
            const response = await fetch(`${API_BASE}/communities`);
            const data = await response.json();

            if (response.ok) {
                setCommunities(data);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching communities:', error);
            toast({
                title: "Error",
                description: "Failed to fetch communities",
                variant: "destructive"
            });
        }
    };

    // Helper to get auth token
    const getToken = () => localStorage.getItem('auth_token');

    // Create post
    const createPost = async (postData: any) => {
        if (!user) return false;

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            }); const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Post created successfully!"
                });
                await fetchPosts();
                return true;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast({
                title: "Error",
                description: "Failed to create post",
                variant: "destructive"
            });
            return false;
        }
    };

    // Create community
    const createCommunity = async (communityData: any) => {
        if (!user) return false;

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE}/communities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(communityData)
            }); const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Community created successfully!"
                });
                await fetchCommunities();
                return true;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error creating community:', error);
            toast({
                title: "Error",
                description: "Failed to create community",
                variant: "destructive"
            });
            return false;
        }
    };

    // Toggle like
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
            const token = getToken();
            const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); const data = await response.json();

            if (response.ok) {
                toast({
                    title: data.liked ? "Post liked!" : "Post unliked"
                });
                await fetchPosts();
                return true;
            } else {
                throw new Error(data.message);
            }
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

    // Toggle community membership
    const toggleCommunityMembership = async (communityId: string) => {
        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please log in to join communities",
                variant: "destructive"
            });
            return false;
        }

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE}/communities/${communityId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); const data = await response.json();

            if (response.ok) {
                toast({
                    title: data.joined ? "Joined community!" : "Left community"
                });
                console.log('Community membership toggled:', data); // Debug log
                await fetchCommunities();
                await fetchUserCommunities(); // Refresh user communities after joining/leaving
                return true;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error toggling membership:', error);
            toast({
                title: "Error",
                description: "Failed to update membership",
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
                    fetchCommunities()
                ]);

                // Fetch user-specific data if user is logged in
                if (user) {
                    await Promise.all([
                        fetchUserProfile(),
                        fetchUserCommunities(),
                        fetchUserRoles()
                    ]);
                }
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
    }, [user]);

    return {
        posts,
        communities,
        userCommunities,
        userProfile,
        loading,
        fetchPosts,
        toggleLike,
        toggleCommunityMembership,
        createPost,
        createCommunity,
        isUserJoined: (communityId: string) => userCommunities.includes(communityId),
        isPostLiked: (postId: string) => {
            const post = posts.find(p => p._id === postId);
            // Handle both string array (MongoDB) and Like objects (old structure)
            if (!post?.likes) return false;
            return post.likes.some((like: any) => {
                return typeof like === 'string' ? like === user?.id : like.user_id === user?.id;
            });
        },
        // Add missing properties for compatibility
        userRoles,
        fetchUserProfile,
        fetchUserCommunities,
        updateUserProfile: async (profileData: any) => {
            if (!user) {
                toast({
                    title: "Authentication required",
                    description: "Please log in to update your profile",
                    variant: "destructive"
                });
                return false;
            }

            try {
                const token = getToken();
                const response = await fetch(`${API_BASE}/user/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(profileData)
                });

                const data = await response.json();

                if (response.ok) {
                    setUserProfile(data.user);
                    toast({
                        title: "Success",
                        description: "Profile updated successfully!"
                    });
                    return true;
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                toast({
                    title: "Error",
                    description: "Failed to update profile",
                    variant: "destructive"
                });
                return false;
            }
        },
        isAdmin: userRoles.some((role: any) => role.role === 'admin')
    };
};
