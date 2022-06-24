import { redisClient } from '../db/index.js';
import { ulid } from 'ulid';

const createAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, password, displayName } = req.body;

    const userId = ulid(); // Generate id for the user which will be used as the key in Redis

    // Check if user with that email already exists
    const userEmail = await redisClient.hgetall(`user:${email}`);

    if (userEmail.email === email) {
      return res.status(409).send({
        error: true,
        message: 'Account with that email already exists',
        data: '',
      });
    }

    const createUser = await redisClient.execute([
      'HSET',
      `user:${email}`,
      'id',
      `${userId}`,
      'firstName',
      `${firstName}`,
      'lastName',
      `${lastName}`,
      'email',
      `${email}`,
      'password',
      `${password}`,
      'displayName',
      `${displayName}`,
    ]);

    if (createUser && typeof createUser === 'number') {
      return res.status(201).send({
        error: false,
        message: 'Account succesfully created',
        data: '',
      });
    }
  } catch (error) {
    return `Server error, please try again later. ${error}`;
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get the user details from Redis
    const user = await redisClient.hgetall(`user:${email}`);

    console.log(user);

    if (!user.email || user.password !== password) {
      return res.status(401).send({
        error: true,
        message: 'Invlaid email or password',
      });
    }

    // Generate a token for the user to perform other operations
    
    return res.status(200).send({
      error: false,
      message: 'Login successfully',
      data: user,
    });
  } catch (error) {
    return `Server error, please try again later. ${error}`;
  }
};

export { createAccount, login };