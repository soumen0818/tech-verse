import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['trending', 'memes', 'quicknews', 'general', 'news', 'tutorial', 'discussion', 'meme', 'quick_news'],
        default: 'general'
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    communityName: {
        type: String
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: ''
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field and likesCount before saving
postSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    this.likesCount = this.likes.length;
    next();
});

// Create indexes for better query performance
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });
postSchema.index({ community: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ likesCount: -1 });
postSchema.index({ views: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
