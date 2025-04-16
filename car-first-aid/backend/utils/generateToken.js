import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.warn('Warning: JWT_SECRET is not set in environment variables');
    }

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'fallbacksecret',
      {
        expiresIn: process.env.JWT_EXPIRE || '30d'
      }
    );

    // Set secure cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(process.env.JWT_COOKIE_EXPIRE || '30') * 24 * 60 * 60 * 1000
    };

    // In development, allow non-secure cookies
    if (process.env.NODE_ENV === 'development') {
      delete cookieOptions.secure;
    }

    res.cookie('jwt', token, cookieOptions);

    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Could not generate authentication token');
  }
};

export default generateToken;
