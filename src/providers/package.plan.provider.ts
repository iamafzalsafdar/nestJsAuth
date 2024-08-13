import { Mongoose } from 'mongoose';
import { userSchema } from '../models/user.model';

export const userProviders = [
  {
    provide: 'PACKAGE_PLAN_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Package_plan', userSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
