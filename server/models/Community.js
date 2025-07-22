import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creatorName: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    membersCount: {
        type: Number,
        default: 1
    },
    moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    category: {
        type: String,
        enum: ['technology', 'gaming', 'entertainment', 'sports', 'education', 'general'],
        default: 'general'
    },
    tags: [{
        type: String,
        trim: true
    }],
    avatar: {
        type: String,
        default: ''
    },
    banner: {
        type: String,
        default: ''
    },
    rules: [{
        type: String,
        maxlength: 200
    }],
    isPrivate: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    postCount: {
        type: Number,
        default: 0
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

// Update the updatedAt field and membersCount before saving
communitySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    this.membersCount = this.members.length;
    next();
});

// Create indexes for better query performance
communitySchema.index({ creator: 1 });
communitySchema.index({ category: 1 });
communitySchema.index({ createdAt: -1 });
communitySchema.index({ membersCount: -1 });

const Community = mongoose.model('Community', communitySchema);

export default Community;
