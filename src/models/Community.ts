import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunity extends Document {
    name: string;
    description?: string;
    slug: string;
    avatar_url?: string;
    banner_url?: string;
    created_by: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
}

const CommunitySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true },
    avatar_url: { type: String },
    banner_url: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.models.Community || mongoose.model<ICommunity>('Community', CommunitySchema);
