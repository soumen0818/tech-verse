import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useMongoData } from '@/hooks/useMongoData';
import { useAuth } from '@/hooks/useAuth';
import { Plus } from 'lucide-react';

interface CreatePostDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultCategory?: string;
  postToEdit?: any;
}

const CreatePostDialog = ({ trigger, open: externalOpen, onOpenChange, defaultCategory, postToEdit }: CreatePostDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [title, setTitle] = useState(postToEdit ? postToEdit.title : '');
  const [content, setContent] = useState(postToEdit ? postToEdit.content : '');
  const [excerpt, setExcerpt] = useState(postToEdit ? postToEdit.excerpt : '');
  const [category, setCategory] = useState(postToEdit ? postToEdit.category : defaultCategory || 'discussion');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createPost, updatePost } = useMongoData();
  const { user } = useAuth();

  // Prefill fields when editing
  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title || '');
      setContent(postToEdit.content || '');
      setExcerpt(postToEdit.excerpt || '');
      setCategory(postToEdit.category || defaultCategory || 'discussion');
    } else {
      setTitle('');
      setContent('');
      setExcerpt('');
      setCategory(defaultCategory || 'discussion');
    }
  }, [postToEdit, defaultCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    const postData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.substring(0, 150) + '...',
      category
    };
    let result;
    if (postToEdit && postToEdit._id) {
      result = await updatePost(postToEdit._id, postData);
    } else {
      result = await createPost(postData);
    }
    if (result) {
      setTitle('');
      setContent('');
      setExcerpt('');
      setCategory(defaultCategory || 'discussion');
      setOpen(false);
    }
    setIsSubmitting(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            {postToEdit ? 'Edit Post' : 'Create Post'}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{postToEdit ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          <DialogDescription>
            {postToEdit ? 'Update your post details below.' : 'Share your thoughts, insights, or questions with the tech community.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (Optional)</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of your post..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="discussion">Discussion</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="memes">Memes</SelectItem>
                <SelectItem value="quicknews">Quick News</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
              {isSubmitting ? (postToEdit ? 'Updating...' : 'Creating...') : (postToEdit ? 'Update Post' : 'Create Post')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;