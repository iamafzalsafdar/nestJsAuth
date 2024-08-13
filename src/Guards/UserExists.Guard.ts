import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Model } from 'mongoose';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class DoesUserExist implements CanActivate {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request.body);
  }

  async validateRequest({ email }: { email: string }) {
    const userExist = await this.userModel
      .findOne({ email })
      .select('email')
      .lean()
      .exec();
    if (userExist?._id || userExist?.email) {
      throw new ForbiddenException('This email already exist');
    }
    return true;
  }
}
