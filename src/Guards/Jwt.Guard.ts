import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.Authorization?.split(' ')?.[1] || '';
    if (token) {
      try {
        const payload = this.jwtService.verify(token);
        request.user = payload;
        return true;
      } catch (err) {
        throw new ForbiddenException('Invalid token');
      }
    }
    throw new NotFoundException('Token not found');
  }
}
