import usersRoutes from './users';
import authRoutes from './auth';
import postRoutes from './posts';

export default server => {
  server.use('/api/users', usersRoutes);
  server.use('/api/auth', authRoutes);
  server.use('/api/posts', postRoutes);
}