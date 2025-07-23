import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    website_url?: string;
    location?: string;
    twitter_handle?: string;
    github_handle?: string;
    role: 'admin' | 'moderator' | 'user';
    password: string;
    created_at: Date;
    updated_at: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    display_name: { type: String },
    bio: { type: String },
    avatar_url: { type: String },
    website_url: { type: String },
    location: { type: String },
    twitter_handle: { type: String },
    github_handle: { type: String },
    role: { type: String, enum: ['admin', 'moderator', 'user'], default: 'user' },
    password: { type: String, required: true },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
