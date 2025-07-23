export interface Profile {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  bio: string;
  avatar: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  joinedCommunities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

export interface Community {
  _id: string;
  name: string;
  description: string;
  creator: {
    _id: string;
    username: string;
    displayName: string;
  };
  creatorName: string;
  members: string[];
  membersCount: number;
  moderators: string[];
  category: 'technology' | 'gaming' | 'entertainment' | 'sports' | 'education' | 'general';
  tags: string[];
  avatar: string;
  banner: string;
  rules: string[];
  isPrivate: boolean;
  isVerified: boolean;
  postCount: number;
  createdAt: string;
  updatedAt: string;
  member_count?: number;
  post_count?: number;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  authorName: string;
  category: 'trending' | 'memes' | 'quicknews' | 'general' | 'news' | 'tutorial' | 'discussion' | 'meme' | 'quick_news';
  community: {
    _id: string;
    name: string;
  } | null;
  tags: string[];
  likes: string[];
  likesCount: number;
  views: number;
  image: string;
  isPublished: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
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