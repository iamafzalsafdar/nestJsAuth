import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { CreateUserDto, LoginUserDto } from 'src/DTOs/auth.dto';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  generatePassword(password: string, hash: string): string {
    const password_hash = pbkdf2Sync(
      password,
      hash,
      10000,
      64,
      'sha512',
    ).toString('hex');
    return password_hash;
  }

  private generatePasswordWithHash(plain_password: string): {
    password: string;
    password_hash: string;
  } {
    const password_hash = randomBytes(16).toString('hex');
    const password = this.generatePassword(plain_password, password_hash);
    return { password_hash, password };
  }

  private comparePasswordWithHash(
    password: string,
    hash: string,
    user_password: string,
  ): boolean {
    const passwordHash = this.generatePassword(password, hash);
    return passwordHash === user_password;
  }

  async create(
    createUser: CreateUserDto,
  ): Promise<
    Omit<User, 'password' | 'password_hash' | 'reset_password_token'>
  > {
    const { password, password_hash } = this.generatePasswordWithHash(
      createUser.password,
    );
    const user = {
      password,
      password_hash,
      email: createUser.email,
      username: createUser.username || '',
    };
    const userDocument = await this.userModel.create(user);
    const payload = { email: userDocument.email, sub: userDocument._id };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    await this.userModel.updateOne(
      { email: userDocument.email },
      { $set: { access_token } },
    );
    let {
      password: pass,
      password_hash: hash,
      ...rest
    } = userDocument.toJSON();
    return { ...rest, access_token };
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    if (!user) {
      return false;
    }
    const isPasswordValid = this.comparePasswordWithHash(
      password,
      user.password_hash,
      user.password,
    );
    return isPasswordValid;
  }

  async login(
    body: LoginUserDto,
  ): Promise<
    Omit<User, 'password' | 'password_hash' | 'reset_password_token'>
  > {
    const is_valid = await this.validateUser(body.email, body.password);
    if (!is_valid) {
      throw new ConflictException('Invalid credentials');
    }
    const user = await this.userModel.findOne({ email: body.email }).exec();
    if (!user) {
      throw new ConflictException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    const { password, password_hash, ...rest } = user.toJSON();
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    await this.userModel.updateOne(
      { email: body.email },
      { $set: { access_token } },
    );

    return {
      ...rest,
      access_token,
    };
  }
}
