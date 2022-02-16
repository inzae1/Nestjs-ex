import {
  Body,
  Injectable,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
1;
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  // 회원가입 하기
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  // 로그인 하기
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성 (Secret + Payload)
      const payload = { username };
      const accessToken = await this.jwtService.sign(payload);

      this.logger.verbose(
        `User "${authCredentialsDto.username}" login success.
        accessToken : ${accessToken}`,
      );

      return { accessToken };
    } else {
      this.logger.verbose(`User "${authCredentialsDto.username}" login fail.`);
      throw new UnauthorizedException('로그인 실패');
    }
  }
}
