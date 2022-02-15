import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  // 영어랑 숙자만 가능한 유효성 체크
  @Matches(/^[a-zA-Z0-9]*$/, { message: '영어나 숫자로 입력해주세요' })
  password: string;
}
