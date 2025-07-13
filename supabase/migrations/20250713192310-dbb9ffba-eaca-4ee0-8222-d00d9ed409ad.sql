-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create post categories enum
CREATE TYPE public.post_category AS ENUM ('news', 'tutorial', 'discussion', 'meme', 'quick_news');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  location TEXT,
  twitter_handle TEXT,
  github_handle TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create communities table
CREATE TABLE public.communities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  banner_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community members table
CREATE TABLE public.community_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  category post_category NOT NULL DEFAULT 'discussion',
  author_id UUID NOT NULL REFERENCES auth.users(id),
  community_id UUID REFERENCES public.communities(id),
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create likes table
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id),
  CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create follows table
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create indexes for better performance
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_community_id ON public.posts(community_id);
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_likes_post_id ON public.likes(post_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name')
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by everyone"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for communities
CREATE POLICY "Communities are viewable by everyone"
  ON public.communities FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create communities"
  ON public.communities FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Community creators and admins can update communities"
  ON public.communities FOR UPDATE
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for community_members
CREATE POLICY "Community members are viewable by everyone"
  ON public.community_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join communities"
  ON public.community_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities they joined"
  ON public.community_members FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for posts
CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authors can view their own posts"
  ON public.posts FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors and admins can delete posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors and admins can delete comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for likes
CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON public.likes FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bookmarks"
  ON public.bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for follows
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own follow relationships"
  ON public.follows FOR ALL
  USING (auth.uid() = follower_id);