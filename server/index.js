// Express server with MongoDB and JWT authentication
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Import models
import User from './models/User.js';
import Post from './models/Post.js';
import Community from './models/Community.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techverse');
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);

        if (error.message.includes('IP')) {
            console.log('\n🔧 SOLUTION: Add your IP address to MongoDB Atlas whitelist:');
            console.log('1. Go to https://cloud.mongodb.com/');
            console.log('2. Select your project > Security > Network Access');
            console.log('3. Click "Add IP Address" and add your current IP');
            console.log('4. Or add 0.0.0.0/0 for development (not recommended for production)');
        }

        console.log('\n⚠️  Server will continue without database connection');
        console.log('Some features may not work properly until database is connected.\n');
    }
};

// Connect to MongoDB
connectDB();

// Auth middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d',
    });
};

// AUTH ROUTES
// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, displayName } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email ? 'Email already exists' : 'Username already taken'
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            displayName: displayName || username,
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                display_name: user.displayName,
                avatar_url: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                display_name: user.displayName,
                avatar_url: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            display_name: req.user.displayName,
            avatar_url: req.user.avatar,
            role: req.user.role,
            bio: req.user.bio
        }
    });
});

// POST ROUTES
// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        const posts = await Post.find(query)
            .populate('author_id', 'username display_name avatar_url')
            .populate('community_id', 'name')
            .sort({ created_at: -1 })
            .limit(50);

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
});

// Create post
app.post('/api/posts', authenticateToken, async (req, res) => {
    try {
        const { title, content, excerpt, category, community_id } = req.body;

        const post = new Post({
            title,
            content,
            excerpt: excerpt || content.substring(0, 150) + '...',
            category,
            author_id: req.user._id,
            community_id: community_id || null,
        });

        await post.save();

        // Populate author info before sending response
        await post.populate('author_id', 'username display_name avatar_url');
        if (post.community_id) {
            await post.populate('community_id', 'name');
        }

        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post' });
    }
});

// Toggle like on post
app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike
            post.likes = post.likes.filter(id => !id.equals(userId));
        } else {
            // Like
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            liked: !isLiked,
            likes_count: post.likes.length,
            message: isLiked ? 'Post unliked' : 'Post liked'
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Failed to update like' });
    }
});

// COMMUNITY ROUTES
// Get all communities
app.get('/api/communities', async (req, res) => {
    try {
        const communities = await Community.find()
            .populate('created_by', 'username display_name')
            .sort({ created_at: -1 });

        // Add member and post counts
        const communitiesWithCounts = await Promise.all(
            communities.map(async (community) => {
                const member_count = community.members.length;
                const post_count = await Post.countDocuments({ community_id: community._id });

                return {
                    ...community.toObject(),
                    member_count,
                    post_count
                };
            })
        );

        res.json(communitiesWithCounts);
    } catch (error) {
        console.error('Error fetching communities:', error);
        res.status(500).json({ message: 'Failed to fetch communities' });
    }
});

// Create community
app.post('/api/communities', authenticateToken, async (req, res) => {
    try {
        const { name, description, slug } = req.body;

        // Check if community name or slug already exists
        const existingCommunity = await Community.findOne({
            $or: [{ name }, { slug }]
        });

        if (existingCommunity) {
            return res.status(400).json({
                message: 'Community with this name or slug already exists'
            });
        }

        const community = new Community({
            name,
            description,
            slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            created_by: req.user._id,
            members: [req.user._id] // Creator automatically joins
        });

        await community.save();
        await community.populate('created_by', 'username display_name');

        res.status(201).json({
            ...community.toObject(),
            member_count: 1,
            post_count: 0
        });
    } catch (error) {
        console.error('Error creating community:', error);
        res.status(500).json({ message: 'Failed to create community' });
    }
});

// Join/Leave community
app.post('/api/communities/:id/join', authenticateToken, async (req, res) => {
    try {
        const communityId = req.params.id;
        const userId = req.user._id;

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        const isMember = community.members.includes(userId);

        if (isMember) {
            // Leave community
            community.members = community.members.filter(id => !id.equals(userId));
        } else {
            // Join community
            community.members.push(userId);
        }

        await community.save();

        res.json({
            joined: !isMember,
            members_count: community.members.length,
            message: isMember ? 'Left community' : 'Joined community'
        });
    } catch (error) {
        console.error('Error toggling membership:', error);
        res.status(500).json({ message: 'Failed to update membership' });
    }
});

// Get user's communities
app.get('/api/user/communities', authenticateToken, async (req, res) => {
    try {
        const communities = await Community.find({
            members: req.user._id
        }).select('_id name');

        res.json(communities.map(c => c._id));
    } catch (error) {
        console.error('Error fetching user communities:', error);
        res.status(500).json({ message: 'Failed to fetch user communities' });
    }
});

// USER PROFILE ROUTES
// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const updates = req.body;

        // Remove sensitive fields
        delete updates.password;
        delete updates.email;
        delete updates.role;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// Newsletter subscription (placeholder)
app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        // Here you would integrate with your newsletter service
        // For now, we'll just return success

        res.json({ message: 'Successfully subscribed to newsletter' });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ message: 'Failed to subscribe to newsletter' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 API available at http://localhost:${PORT}/api`);
});

export default app;