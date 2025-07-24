// Express server with MongoDB and JWT authentication
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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

// Email transporter configuration
let emailTransporter = null;

const setupEmailTransporter = async () => {
    try {
        // Check if email configuration exists
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS &&
            process.env.EMAIL_USER !== 'your-email@gmail.com' &&
            process.env.EMAIL_PASS !== 'your-gmail-app-password-here') {

            emailTransporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Verify transporter
            emailTransporter.verify((error, success) => {
                if (error) {
                    console.log('❌ Email configuration error:', error.message);
                    console.log('📧 Email functionality will use mock mode');
                    emailTransporter = null;
                } else {
                    console.log('✅ Email transporter ready');
                }
            });
        } else {
            // Create test account for development
            console.log('📧 Setting up test email account...');
            try {
                const testAccount = await nodemailer.createTestAccount();

                emailTransporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass
                    }
                });

                console.log('✅ Test email account created');
                console.log('� Test emails will be viewable at: https://ethereal.email/');
                console.log('💡 To use real Gmail, update EMAIL_USER and EMAIL_PASS in .env');
            } catch (testError) {
                console.log('❌ Failed to create test account, using mock mode');
                console.log('💡 To enable emails, update .env with real Gmail credentials');
                emailTransporter = null;
            }
        }
    } catch (error) {
        console.error('❌ Error setting up email transporter:', error);
        emailTransporter = null;
    }
};

(async () => {
    await setupEmailTransporter();
})();

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

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if email exists for security reasons
            return res.json({
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to user (you might want to add these fields to the User model)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        console.log(`Password reset requested for: ${email}`);
        console.log(`Reset token generated: ${resetToken}`);

        // Prepare reset URL (in production, this would be your frontend URL)
        const resetUrl = `http://localhost:8081/reset-password?token=${resetToken}`;

        // Send email
        if (emailTransporter) {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                    to: user.email,
                    subject: 'Password Reset Request - TechVerse',
                    html: `
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                            <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                            <p>Hello ${user.displayName || user.username},</p>
                            <p>You have requested to reset your password for TechVerse. Click the button below to reset your password:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                            </div>
                            <p>Or copy and paste this link in your browser:</p>
                            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                            <p><strong>This link will expire in 1 hour.</strong></p>
                            <p>If you didn't request this password reset, please ignore this email.</p>
                            <hr style="margin: 30px 0;">
                            <p style="color: #666; font-size: 12px;">TechVerse - Your Tech Community</p>
                        </div>
                    `
                };

                const info = await emailTransporter.sendMail(mailOptions);
                console.log(`✅ Password reset email sent to: ${user.email}`);

                // If using Ethereal test account, show preview URL
                const previewUrl = nodemailer.getTestMessageUrl(info);
                if (previewUrl) {
                    console.log(`📧 Preview email at: ${previewUrl}`);
                }

                res.json({
                    message: 'If an account with that email exists, a password reset link has been sent.',
                    ...(process.env.NODE_ENV === 'development' && {
                        debug: 'Email sent successfully',
                        resetUrl: resetUrl,
                        ...(previewUrl && { emailPreview: previewUrl })
                    })
                });

            } catch (emailError) {
                console.error('❌ Error sending email:', emailError);

                // Fallback: still return success but log the error
                res.json({
                    message: 'If an account with that email exists, a password reset link has been sent.',
                    ...(process.env.NODE_ENV === 'development' && {
                        debug: 'Email sending failed, using mock mode',
                        resetUrl: resetUrl,
                        error: emailError.message
                    })
                });
            }
        } else {
            // Mock mode - just log the reset URL
            console.log(`📧 MOCK EMAIL MODE - Reset URL: ${resetUrl}`);

            res.json({
                message: 'If an account with that email exists, a password reset link has been sent.',
                ...(process.env.NODE_ENV === 'development' && {
                    debug: 'Mock email mode - check console for reset URL',
                    resetUrl: resetUrl
                })
            });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error processing password reset request' });
    }
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
            .populate('author', 'username displayName avatar')
            .populate('community', 'name')
            .sort({ createdAt: -1 })
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
        const { title, content, category, community } = req.body;

        const post = new Post({
            title,
            content,
            category,
            author: req.user._id,
            authorName: req.user.displayName,
            community: community || null,
        });

        await post.save();

        // Populate author info before sending response
        await post.populate('author', 'username displayName avatar');
        if (post.community) {
            await post.populate('community', 'name');
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
            .populate('creator', 'username displayName')
            .sort({ createdAt: -1 });

        // Add member and post counts
        const communitiesWithCounts = await Promise.all(
            communities.map(async (community) => {
                const member_count = community.members.length;
                const post_count = await Post.countDocuments({ community: community._id });

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
        const { name, description } = req.body;

        // Check if community name already exists
        const existingCommunity = await Community.findOne({ name });

        if (existingCommunity) {
            return res.status(400).json({
                message: 'Community with this name already exists'
            });
        }

        const community = new Community({
            name,
            description,
            creator: req.user._id,
            creatorName: req.user.displayName,
            members: [req.user._id], // Creator automatically joins
            category: 'technology'
        });

        await community.save();
        await community.populate('creator', 'username displayName');

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

        res.json({ communities: communities.map(c => c._id) });
    } catch (error) {
        console.error('Error fetching user communities:', error);
        res.status(500).json({ message: 'Failed to fetch user communities' });
    }
});

// USER PROFILE ROUTES
// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
});

// Get user roles
app.get('/api/user/roles', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('role');
        const roles = [{ role: user.role || 'user' }];
        res.json({ roles });
    } catch (error) {
        console.error('Error fetching user roles:', error);
        res.status(500).json({ message: 'Failed to fetch user roles' });
    }
});

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

// Debug route to check database status
app.get('/api/debug/database', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const communityCount = await Community.countDocuments();

        const sampleUsers = await User.find().select('username displayName email').limit(5);
        const samplePosts = await Post.find().select('title author_id category').limit(5);
        const sampleCommunities = await Community.find().select('name created_by').limit(5);

        res.json({
            database: 'techverse',
            connectionStatus: 'connected',
            counts: {
                users: userCount,
                posts: postCount,
                communities: communityCount
            },
            samples: {
                users: sampleUsers,
                posts: samplePosts,
                communities: sampleCommunities
            }
        });
    } catch (error) {
        console.error('Database debug error:', error);
        res.status(500).json({ message: 'Database debug failed', error: error.message });
    }
});

// Debug route to seed sample data
app.post('/api/debug/seed', async (req, res) => {
    try {
        let created = { users: 0, communities: 0, posts: 0 };

        // Get existing user or create one
        let existingUser = await User.findOne();
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            existingUser = new User({
                username: 'testuser',
                email: 'test@example.com',
                password: hashedPassword,
                displayName: 'Test User',
                bio: 'This is a test user for development'
            });
            await existingUser.save();
            created.users = 1;
        }

        // Create sample community if none exist
        let sampleCommunity = await Community.findOne();
        if (!sampleCommunity) {
            sampleCommunity = new Community({
                name: 'Tech Discussions',
                description: 'A place to discuss technology trends and innovations',
                creator: existingUser._id,
                creatorName: existingUser.displayName,
                members: [existingUser._id],
                category: 'technology'
            });
            await sampleCommunity.save();
            created.communities = 1;
        }

        // Create sample posts if none exist
        const existingPosts = await Post.countDocuments();
        if (existingPosts === 0) {
            const samplePosts = [
                {
                    title: 'Welcome to Tech Verse!',
                    content: 'This is a sample post to get you started. Explore the amazing world of technology with our community! Share your thoughts, ask questions, and connect with fellow tech enthusiasts.',
                    author: existingUser._id,
                    authorName: existingUser.displayName,
                    category: 'general',
                    community: sampleCommunity._id
                },
                {
                    title: 'Latest AI Trends in 2025',
                    content: 'Artificial Intelligence continues to evolve rapidly. Here are the key trends shaping 2025: Machine Learning democratization, Edge AI, Ethical AI frameworks, and more.',
                    author: existingUser._id,
                    authorName: existingUser.displayName,
                    category: 'trending',
                    community: sampleCommunity._id
                },
                {
                    title: 'Building Modern Web Applications',
                    content: 'Learn about the latest web development technologies including React, Next.js, TypeScript, and modern deployment strategies.',
                    author: existingUser._id,
                    authorName: existingUser.displayName,
                    category: 'general',
                    community: null
                },
                {
                    title: 'Tech Meme Monday',
                    content: 'When you finally fix that bug that has been haunting you for weeks... 🎉',
                    author: existingUser._id,
                    authorName: existingUser.displayName,
                    category: 'memes',
                    community: null
                }
            ];

            for (const postData of samplePosts) {
                const post = new Post(postData);
                await post.save();
                created.posts++;
            }
        }

        res.json({
            message: 'Sample data check completed!',
            created,
            totalCounts: {
                users: await User.countDocuments(),
                communities: await Community.countDocuments(),
                posts: await Post.countDocuments()
            }
        });
    } catch (error) {
        console.error('Seed data error:', error);
        res.status(500).json({ message: 'Failed to create sample data', error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 API available at http://localhost:${PORT}/api`);
});

export default app;