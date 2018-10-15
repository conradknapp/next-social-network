import usersRoutes from './users';
import authRoutes from './auth';

export default server => {
  server.use('/api/users', usersRoutes);
  server.use('/api/auth', authRoutes);
}