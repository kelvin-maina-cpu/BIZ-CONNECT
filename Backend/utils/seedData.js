const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Gig = require('../models/Gig');
const dotenv = require('dotenv');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-biz')
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch(err => console.error(err));

// 5 Freelancer Accounts with Detailed Profiles
const freelancers = [
  {
    email: 'alex.chen@university.edu',
    password: 'password123',
    role: 'student',
    profile: {
      firstName: 'Alex',
      lastName: 'Chen',
      bio: 'Full-stack developer passionate about building scalable web applications. Winner of 2024 University Hackathon. Open source contributor with 500+ GitHub stars.',
      university: 'Stanford University',
      major: 'Computer Science',
      graduationYear: 2025,
      location: 'Palo Alto, CA',
      skills: ['React', 'Node.js', 'Python', 'MongoDB', 'AWS', 'Docker', 'TypeScript', 'GraphQL'],
      hourlyRate: 45,
      portfolio: [
        {
          title: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce platform with React, Node.js, and Stripe integration. Handles 10k+ daily users.',
          link: 'https://github.com/alexchen/ecommerce-platform',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
        },
        {
          title: 'AI Task Manager',
          description: 'Smart task management app using OpenAI API for automatic prioritization and scheduling.',
          link: 'https://github.com/alexchen/ai-task-manager',
          image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400'
        },
        {
          title: 'Real-time Chat App',
          description: 'WebSocket-based chat application with end-to-end encryption and file sharing.',
          link: 'https://github.com/alexchen/chat-app',
          image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400'
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
    },
    rating: { average: 4.9, count: 23 }
  },
  {
    email: 'sarah.johnson@university.edu',
    password: 'password123',
    role: 'student',
    profile: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      bio: 'UI/UX Designer with a keen eye for detail. Specializing in mobile app design and design systems. Former intern at Google and Figma.',
      university: 'Rhode Island School of Design',
      major: 'Graphic Design',
      graduationYear: 2024,
      location: 'Providence, RI',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Design Systems', 'Motion Design', 'Illustration'],
      hourlyRate: 40,
      portfolio: [
        {
          title: 'Fitness App Redesign',
          description: 'Complete UX overhaul of a popular fitness tracking app, increasing user retention by 40%.',
          link: 'https://behance.net/sarahj/fitness-redesign',
          image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400'
        },
        {
          title: 'Banking Dashboard',
          description: 'Modern banking interface design with focus on accessibility and ease of use.',
          link: 'https://behance.net/sarahj/banking-dashboard',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400'
        },
        {
          title: 'E-learning Platform',
          description: 'Gamified learning experience design for K-12 students.',
          link: 'https://behance.net/sarahj/elearning',
          image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400'
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
    },
    rating: { average: 4.8, count: 18 }
  },
  {
    email: 'marcus.williams@university.edu',
    password: 'password123',
    role: 'student',
    profile: {
      firstName: 'Marcus',
      lastName: 'Williams',
      bio: 'Data Science enthusiast with expertise in machine learning and data visualization. Published research on predictive analytics in healthcare.',
      university: 'MIT',
      major: 'Data Science',
      graduationYear: 2025,
      location: 'Cambridge, MA',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Tableau', 'R', 'Machine Learning', 'Deep Learning', 'NLP'],
      hourlyRate: 50,
      portfolio: [
        {
          title: 'Stock Price Predictor',
          description: 'LSTM-based neural network for predicting stock prices with 85% accuracy.',
          link: 'https://github.com/marcusw/stock-predictor',
          image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=400'
        },
        {
          title: 'Healthcare Analytics Dashboard',
          description: 'Interactive dashboard for hospital resource allocation using predictive modeling.',
          link: 'https://github.com/marcusw/healthcare-dashboard',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400'
        },
        {
          title: 'Sentiment Analysis Tool',
          description: 'NLP-based tool for analyzing customer reviews and social media sentiment.',
          link: 'https://github.com/marcusw/sentiment-analysis',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
    },
    rating: { average: 5.0, count: 15 }
  },
  {
    email: 'emma.davis@university.edu',
    password: 'password123',
    role: 'student',
    profile: {
      firstName: 'Emma',
      lastName: 'Davis',
      bio: 'Creative content writer and digital marketer. Helped 20+ startups grow their online presence. SEO specialist with proven track record.',
      university: 'Northwestern University',
      major: 'Journalism',
      graduationYear: 2024,
      location: 'Evanston, IL',
      skills: ['Content Writing', 'SEO', 'Social Media Marketing', 'Copywriting', 'Email Marketing', 'WordPress', 'Google Analytics', 'Brand Strategy'],
      hourlyRate: 35,
      portfolio: [
        {
          title: 'Tech Startup Blog Strategy',
          description: 'Developed content strategy that increased organic traffic by 300% in 6 months.',
          link: 'https://medium.com/@emmadavis/case-study',
          image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400'
        },
        {
          title: 'E-book: Digital Marketing Guide',
          description: 'Comprehensive guide on digital marketing for small businesses, downloaded 10k+ times.',
          link: 'https://emmadavis.com/ebook',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'
        },
        {
          title: 'Social Media Campaign',
          description: 'Viral marketing campaign for sustainable fashion brand, reaching 2M+ impressions.',
          link: 'https://instagram.com/ecofashion',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
    },
    rating: { average: 4.7, count: 31 }
  },
  {
    email: 'james.rodriguez@university.edu',
    password: 'password123',
    role: 'student',
    profile: {
      firstName: 'James',
      lastName: 'Rodriguez',
      bio: 'Mobile app developer specializing in React Native and Flutter. Built apps with 1M+ combined downloads. Passionate about clean code and performance.',
      university: 'UC Berkeley',
      major: 'Electrical Engineering & Computer Science',
      graduationYear: 2025,
      location: 'Berkeley, CA',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Redux', 'Mobile UI Design', 'App Store Optimization'],
      hourlyRate: 42,
      portfolio: [
        {
          title: 'Fitness Tracker App',
          description: 'Cross-platform fitness app with social features, 500k+ downloads on App Store.',
          link: 'https://apps.apple.com/fittrack',
          image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400'
        },
        {
          title: 'Food Delivery App',
          description: 'UberEats clone with real-time tracking and payment integration.',
          link: 'https://github.com/jamesr/food-delivery',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
        },
        {
          title: 'Meditation & Mindfulness App',
          description: 'Mental wellness app featured on App Store, 200k+ active users.',
          link: 'https://mindfulapp.com',
          image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
    },
    rating: { average: 4.9, count: 27 }
  }
];

// 10 Sample Jobs
const sampleJobs = [
  {
    title: 'Full-Stack Developer for SaaS Dashboard',
    description: `We're building a comprehensive analytics dashboard for our B2B SaaS platform and need a skilled full-stack developer.

Key Responsibilities:
- Develop responsive frontend using React and TypeScript
- Build RESTful APIs with Node.js and Express
- Implement real-time data visualization using D3.js
- Integrate with PostgreSQL database
- Set up CI/CD pipeline with GitHub Actions

Requirements:
- 2+ years experience with React and Node.js
- Strong understanding of database design
- Experience with cloud platforms (AWS/GCP)
- Good communication skills

This is a 3-month project with potential for extension.`,
    category: 'Web Development',
    skillsRequired: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'D3.js'],
    budget: { min: 3000, max: 5000, type: 'fixed' },
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    location: 'Remote',
    status: 'open',
    applicationsCount: 8
  },
  {
    title: 'Mobile App UI/UX Design for Fintech Startup',
    description: `Design a modern, intuitive mobile banking app for Gen Z users. We need a complete design system from scratch.

Deliverables:
- User research and personas
- Wireframes and user flows
- High-fidelity mockups for 20+ screens
- Interactive prototype
- Design system documentation
- Developer handoff files

Style: Minimalist, bold colors, crypto-friendly aesthetic

Timeline: 4 weeks`,
    category: 'Design',
    skillsRequired: ['Figma', 'Prototyping', 'User Research', 'Mobile Design', 'Design Systems'],
    budget: { min: 2500, max: 4000, type: 'fixed' },
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    location: 'Remote',
    status: 'open',
    applicationsCount: 12
  },
  {
    title: 'Machine Learning Model for Customer Churn Prediction',
    description: `We need a data scientist to build a predictive model to identify customers at risk of churning.

Project Scope:
- Analyze customer behavior dataset (50k+ records)
- Feature engineering and selection
- Build and compare multiple ML models (Random Forest, XGBoost, Neural Networks)
- Create actionable insights dashboard
- Deploy model to production environment

Data includes: usage patterns, support tickets, payment history, demographics

Deliverable: Production-ready model with 85%+ accuracy`,
    category: 'Data Science',
    skillsRequired: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Visualization', 'Scikit-learn'],
    budget: { min: 2000, max: 3500, type: 'fixed' },
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    location: 'Remote',
    status: 'open',
    applicationsCount: 5
  },
  {
    title: 'Content Strategy & Blog Writing for Tech Company',
    description: `Looking for a talented content writer to establish our company blog and create engaging technical content.

Monthly Deliverables:
- 8 long-form technical blog posts (1500+ words each)
- 4 case studies
- Social media content calendar
- Email newsletter copy
- SEO optimization for all content

Topics: Cloud computing, DevOps, cybersecurity, AI/ML
Tone: Professional yet accessible, thought leadership style

Ongoing monthly retainer preferred.`,
    category: 'Writing',
    skillsRequired: ['Content Writing', 'SEO', 'Technical Writing', 'WordPress', 'Social Media'],
    budget: { min: 1500, max: 2500, type: 'monthly' },
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    location: 'Remote',
    status: 'open',
    applicationsCount: 15
  },
  {
    title: 'React Native Developer for Social Media App',
    description: `Join our team to build the next big social media platform focused on creative professionals.

Features to Implement:
- User authentication and profiles
- Photo/video sharing with filters
- Real-time messaging system
- Push notifications
- Social feed with algorithmic sorting
- In-app purchases for premium features

Tech Stack: React Native, Firebase, Redux, Gifted Chat

Looking for someone who can start immediately and commit 20+ hours/week.`,
    category: 'Mobile App',
    skillsRequired: ['React Native', 'Firebase', 'Redux', 'Mobile Development', 'iOS', 'Android'],
    budget: { min: 4000, max: 7000, type: 'fixed' },
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    location: 'Remote',
    status: 'open',
    applicationsCount: 6
  },
  {
    title: 'Brand Identity Design for Sustainable Fashion Brand',
    description: `Create a complete brand identity for our eco-friendly fashion startup launching next quarter.

Deliverables:
- Logo design (primary, secondary, icon)
- Color palette and typography system
- Brand guidelines document
- Business card and stationery design
- Social media templates (Instagram, TikTok, Pinterest)
- Packaging design concepts
- Brand voice and messaging guide

Aesthetic: Earthy, modern, luxury sustainable fashion
Target: Millennial and Gen Z conscious consumers

Must have portfolio of similar lifestyle/fashion brands.`,
    category: 'Design',
    skillsRequired: ['Brand Identity', 'Logo Design', 'Adobe Illustrator', 'Adobe Photoshop', 'Typography', 'Packaging Design'],
    budget: { min: 1800, max: 3000, type: 'fixed' },
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    location: 'Remote',
    status: 'open',
    applicationsCount: 9
  },
  {
    title: 'E-commerce Website Development with Shopify',
    description: `Build a custom Shopify store for our handmade jewelry business with unique features.

Requirements:
- Custom Shopify theme development
- Product configurator for custom jewelry
- Integration with Instagram shopping
- Email marketing automation setup
- SEO optimization
- Payment gateway integration (Stripe, PayPal)
- Inventory management system
- Mobile-responsive design

We have 200+ SKUs and process 100+ orders monthly.
Looking for ongoing maintenance contract as well.`,
    category: 'Web Development',
    skillsRequired: ['Shopify', 'Liquid', 'JavaScript', 'HTML/CSS', 'E-commerce', 'SEO'],
    budget: { min: 2000, max: 3500, type: 'fixed' },
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    location: 'Remote',
    status: 'open',
    applicationsCount: 11
  },
  {
    title: 'Data Pipeline Engineer for Healthcare Analytics',
    description: `Build a robust data pipeline to process and analyze electronic health records (EHR) for our hospital network.

Technical Requirements:
- Extract data from multiple EHR systems (Epic, Cerner)
- Build ETL pipelines using Apache Airflow
- Data warehousing with Snowflake
- Real-time streaming with Apache Kafka
- HIPAA compliance and data security
- Automated data quality checks
- Dashboard integration with Tableau

Scale: Processing 1M+ patient records daily
Experience with healthcare data standards (HL7, FHIR) preferred.`,
    category: 'Data Science',
    skillsRequired: ['Python', 'Apache Airflow', 'SQL', 'Snowflake', 'ETL', 'Data Engineering', 'AWS'],
    budget: { min: 5000, max: 8000, type: 'fixed' },
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    location: 'Remote',
    status: 'open',
    applicationsCount: 3
  },
  {
    title: 'Video Editor for YouTube Content Creator',
    description: `Edit engaging YouTube videos for a tech review channel with 500k+ subscribers.

Per Video Requirements:
- Raw footage: 2-3 hours → Final: 10-15 minutes
- Color correction and grading
- Motion graphics and lower thirds
- Sound design and music selection
- Thumbnail creation
- SEO-optimized titles and descriptions

Style: Fast-paced, energetic, Linus Tech Tips / MKBHD inspired
Posting Schedule: 2 videos per week

Must be familiar with tech/gadget content.`,
    category: 'Video Editing',
    skillsRequired: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Motion Graphics', 'Color Grading'],
    budget: { min: 300, max: 500, type: 'per video' },
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    location: 'Remote',
    status: 'open',
    applicationsCount: 22
  },
  {
    title: 'Blockchain Smart Contract Developer for DeFi Project',
    description: `Develop secure smart contracts for our decentralized finance (DeFi) lending platform.

Smart Contracts Needed:
- ERC-20 token contract with vesting
- Lending/borrowing pool contract
- Collateral management system
- Interest rate model
- Liquidation mechanism
- Governance token and voting system

Requirements:
- Solidity expertise
- Experience with OpenZeppelin libraries
- Knowledge of DeFi protocols (Aave, Compound)
- Security audit preparation
- Gas optimization

Must have deployed contracts to mainnet with $1M+ TVL.`,
    category: 'Web Development',
    skillsRequired: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js', 'DeFi', 'Blockchain'],
    budget: { min: 6000, max: 10000, type: 'fixed' },
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    location: 'Remote',
    status: 'open',
    applicationsCount: 4
  }
];

// Client account for posting jobs
const clientAccount = {
  email: 'hiring@techstartups.com',
  password: 'password123',
  role: 'client',
  profile: {
    firstName: 'Michael',
    lastName: 'Thompson',
    companyName: 'TechStartups Inc.',
    companyWebsite: 'https://techstartups.com',
    bio: 'We help early-stage startups build their technical teams and products.',
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200'
  },
  isVerified: true
};

async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({ role: { $in: ['student', 'client'] } });
    await Gig.deleteMany({});
    
    console.log('Cleared existing data');

    // Create freelancers
    const createdFreelancers = [];
    for (const freelancer of freelancers) {
      const hashedPassword = await bcrypt.hash(freelancer.password, 10);
      const user = await User.create({
        ...freelancer,
        password: hashedPassword
      });
      createdFreelancers.push(user);
      console.log(`Created freelancer: ${user.profile.firstName} ${user.profile.lastName}`);
    }

    // Create client
    const hashedClientPassword = await bcrypt.hash(clientAccount.password, 10);
    const client = await User.create({
      ...clientAccount,
      password: hashedClientPassword
    });
    console.log(`Created client: ${client.profile.companyName}`);

    // Create sample jobs
    for (let i = 0; i < sampleJobs.length; i++) {
      const job = sampleJobs[i];
      const gig = await Gig.create({
        ...job,
        client: client._id,
        // Randomly assign some applications from freelancers
        applicationsCount: Math.floor(Math.random() * 5) + 1
      });
      console.log(`Created job: ${gig.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Freelancers:');
    freelancers.forEach(f => {
      console.log(`  ${f.email} / password123 (${f.profile.firstName} ${f.profile.lastName})`);
    });
    console.log(`\nClient: ${clientAccount.email} / password123`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
