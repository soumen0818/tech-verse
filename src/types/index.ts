export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  location: string | null;
  twitter_handle: string | null;
  github_handle: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  avatar_url: string | null;
  banner_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  post_count?: number;
  community_members?: { id: string }[];
  posts?: { id: string }[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: 'news' | 'tutorial' | 'discussion' | 'meme' | 'quick_news';
  author_id: string;
  community_id: string | null;
  is_published: boolean;
  is_featured: boolean;
  featured_image_url: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  communities?: Community;
  likes?: Like[];
  comments?: Comment[];
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  user_id: string;
  community_id: string;
  role: string;
  joined_at: string;
}

export interface NotificationData {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}