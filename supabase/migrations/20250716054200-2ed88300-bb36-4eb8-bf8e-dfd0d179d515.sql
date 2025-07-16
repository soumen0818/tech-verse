-- Add foreign key constraint between posts and profiles
ALTER TABLE public.posts 
ADD CONSTRAINT posts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) 
ON DELETE CASCADE;

-- Add foreign key constraint between comments and profiles  
ALTER TABLE public.comments 
ADD CONSTRAINT comments_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) 
ON DELETE CASCADE;