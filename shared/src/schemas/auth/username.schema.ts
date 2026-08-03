import { z } from 'zod';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
} from '../../constants/validation.constants.js';

export const usernameSchema = z
  .string()
  .min(USERNAME_MIN_LENGTH, {
    message: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
  })
  .max(USERNAME_MAX_LENGTH, {
    message: `Username cannot exceed ${USERNAME_MAX_LENGTH} characters`,
  });
