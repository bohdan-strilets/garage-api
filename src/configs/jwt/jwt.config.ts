import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          algorithm: 'HS256',
          issuer: configService.getOrThrow<string>('JWT_ISSUER'),
          audience: configService.getOrThrow<string>('JWT_AUDIENCE'),
        },
        verifyOptions: {
          algorithm: ['HS256'],
          issuer: configService.getOrThrow<string>('JWT_ISSUER'),
          audience: configService.getOrThrow<string>('JWT_AUDIENCE'),
          clockTolerance: parseInt(configService.get<string>('JWT_TOLERANCE')) || 0,
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}
