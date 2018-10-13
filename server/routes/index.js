import users from './users';
import auth from './auth';

export default server => {
  server.use('/api/users', users);
  server.use('/api/auth', auth);
}