import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    excerpt?: string;
    category: 'news' | 'tutorial' | 'discussion' | 'meme' | 'quick_news';
    author_id: mongoose.Types.ObjectId;
    community_id?: mongoose.Types.ObjectId;
    is_published: boolean;
    is_featured: boolean;
    featured_image_url?: string;
    view_count: number;
    likes: mongoose.Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
}

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    category: {
        type: String,
        enum: ['news', 'tutorial', 'discussion', 'meme', 'quick_news'],
        required: true
    },
    author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    community_id: { type: Schema.Types.ObjectId, ref: 'Community' },
    is_published: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
    featured_image_url: { type: String },
    view_count: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
