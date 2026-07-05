const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere');
    console.log('Connected to DB successfully.');

    const admin = await User.findOne({ email: 'admin@shopsphere.com' });
    if (!admin) {
      console.log('Admin user NOT found in database!');
      process.exit(0);
    }

    console.log('Admin user found:');
    console.log(`- Email: ${admin.email}`);
    console.log(`- Role: ${admin.role}`);
    console.log(`- Stored Password string: ${admin.password}`);

    const isBcrypt = admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$');
    console.log(`- Is stored password a bcrypt hash? ${isBcrypt}`);

    const matchPlain = admin.password === 'admin123';
    console.log(`- Is stored password equal to plain text "admin123"? ${matchPlain}`);

    const matchHash = await bcrypt.compare('admin123', admin.password);
    console.log(`- Does bcrypt.compare("admin123", hash) succeed? ${matchHash}`);

    process.exit(0);
  } catch (error) {
    console.error(`Check failed: ${error.message}`);
    process.exit(1);
  }
};

check();
