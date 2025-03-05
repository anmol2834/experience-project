import jwt from 'jsonwebtoken'


export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
};


export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
};