import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { UpdateQuery } from 'mongoose';

import { buildFullName, getNowTimestamp, minutesToMs, objectIdToString } from '@app/common/utils';
import { CryptoConfig, cryptoConfig } from '@app/config/env/name-space';

import { CryptoService } from '../crypto';
import { EmailService } from '../email';

import {
  UpdateAddressDto,
  UpdateDrivingLicenseDto,
  UpdateEmailDto,
  UpdatePhoneDto,
  UpdateProfileDto,
  UpdateProfileSettingsDto,
  UpdateUnitsDto,
} from './dto';
import { userPublicProjection, userSecurityProjection, userSelfProjection } from './projections';
import { User } from './schemas';
import {
  CreateUserInput,
  GenerateEmailTokenInput,
  UserPublic,
  UserSecurity,
  UserSelf,
  UserSoftDelete,
} from './types';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(cryptoConfig.KEY) private readonly crypto: CryptoConfig,
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService,
  ) {}

  async createUser(input: CreateUserInput): Promise<UserSelf> {
    const user = await this.userRepository.create(input);
    const id = objectIdToString(user._id);

    return await this.findSelfUserById(id);
  }

  async findSelfUserById(userId: string): Promise<UserSelf> {
    const user: UserSelf = await this.userRepository.findById(userId, userSelfProjection);

    if (!user) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findPublicUserById(userId: string): Promise<UserPublic> {
    const user: UserPublic = await this.userRepository.findById(userId, userPublicProjection);

    if (!user) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findSecurityUserByEmail(email: string): Promise<UserSecurity> {
    const user: UserSecurity = await this.userRepository.findByEmail(email, userSecurityProjection);

    if (!user) {
      this.logger.debug(`User with email ${email} not found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findSecurityUserById(userId: string): Promise<UserSecurity> {
    const user: UserSecurity = await this.userRepository.findById(userId, userSecurityProjection);

    if (!user) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findSecurityUserByResetToken(resetTokenHash: string): Promise<UserSecurity> {
    const user: UserSecurity = await this.userRepository.findByResetToken(
      resetTokenHash,
      userSecurityProjection,
    );

    if (!user) {
      this.logger.debug('User by reset token not found');
      throw new BadRequestException('Invalid or expired reset token');
    }

    return user;
  }

  async softDeleteUserById(userId: string): Promise<boolean> {
    const deleted: UserSoftDelete = await this.userRepository.softDeleteById(userId);

    if (!deleted) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User with ID ${userId} has been soft deleted`);
    return true;
  }

  async existsActiveByEmail(email: string): Promise<boolean> {
    return await this.userRepository.existsActiveByEmail(email);
  }

  async existsActiveByPhone(phone: string): Promise<boolean> {
    return await this.userRepository.existsActiveByPhone(phone);
  }

  async incrementFailedLogin(userId: string): Promise<boolean> {
    return await this.userRepository.incrementFailedLogin(userId);
  }

  async lockAccount(userId: string, minutes: number): Promise<boolean> {
    return await this.userRepository.lockAccount(userId, minutes);
  }

  async resetFailures(userId: string): Promise<boolean> {
    return await this.userRepository.resetFailures(userId);
  }

  async isLockedById(userId: string): Promise<boolean> {
    return await this.userRepository.isLockedById(userId);
  }

  async bumpFailuresAndLockIfNeeded(userId: string): Promise<boolean> {
    return await this.userRepository.bumpFailuresAndLockIfNeeded(userId);
  }

  async setPasswordResetToken(userId: string, tokenHash: string): Promise<boolean> {
    return await this.userRepository.setPasswordResetToken(userId, tokenHash);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<boolean> {
    return await this.userRepository.updatePassword(userId, passwordHash);
  }

  async clearPasswordResetToken(userId: string): Promise<boolean> {
    return await this.userRepository.clearPasswordResetToken(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserSelf> {
    const update: UpdateQuery<User> = { $set: {} };

    if (dto.firstName !== undefined) {
      update.$set['profile.firstName'] = dto.firstName;
    }

    if (dto.lastName !== undefined) {
      update.$set['profile.lastName'] = dto.lastName;
    }

    if (dto.nickname !== undefined) {
      update.$set['profile.nickname'] = dto.nickname;
    }

    if (dto.dateBirth !== undefined) {
      update.$set['profile.dateBirth'] = dto.dateBirth;
    }

    if (dto.gender !== undefined) {
      update.$set['profile.gender'] = dto.gender;
    }

    const updated = await this.userRepository.updateById(userId, update);

    if (!updated) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return await this.findSelfUserById(userId);
  }

  async updateProfileSettings(userId: string, dto: UpdateProfileSettingsDto): Promise<UserSelf> {
    const update: UpdateQuery<User> = { $set: {} };

    if (dto.locale !== undefined) {
      update.$set['settings.locale'] = dto.locale;
    }

    if (dto.timezone !== undefined) {
      update.$set['settings.timezone'] = dto.timezone;
    }

    if (dto.theme !== undefined) {
      update.$set['settings.theme'] = dto.theme;
    }

    if (dto.currency !== undefined) {
      update.$set['settings.currency'] = dto.currency;
    }

    if (dto.notificationsEmail !== undefined) {
      update.$set['settings.notifications.email'] = dto.notificationsEmail;
    }

    if (dto.notificationsInApp !== undefined) {
      update.$set['settings.notifications.inApp'] = dto.notificationsInApp;
    }

    if (dto.notificationsPush !== undefined) {
      update.$set['settings.notifications.push'] = dto.notificationsPush;
    }

    const updated = await this.userRepository.updateById(userId, update);

    if (!updated) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return await this.findSelfUserById(userId);
  }

  async updateProfileAddress(userId: string, dto: UpdateAddressDto): Promise<UserSelf> {
    const update: UpdateQuery<User> = { $set: {} };

    if (dto.street !== undefined) {
      update.$set['profile.address.street'] = dto.street;
    }

    if (dto.city !== undefined) {
      update.$set['profile.address.city'] = dto.city;
    }

    if (dto.postalCode !== undefined) {
      update.$set['profile.address.postalCode'] = dto.postalCode;
    }

    if (dto.country !== undefined) {
      update.$set['profile.address.country'] = dto.country;
    }

    if (dto.numberStreet !== undefined) {
      update.$set['profile.address.numberStreet'] = dto.numberStreet;
    }

    const updated = await this.userRepository.updateById(userId, update);

    if (!updated) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return await this.findSelfUserById(userId);
  }

  async updateDrivingLicense(userId: string, dto: UpdateDrivingLicenseDto): Promise<UserSelf> {
    const update: UpdateQuery<User> = { $set: {} };

    if (dto.number !== undefined) {
      update.$set['profile.drivingLicense.number'] = dto.number;
    }

    if (dto.categories !== undefined) {
      update.$set['profile.drivingLicense.categories'] = dto.categories;
    }

    if (dto.issuedAt !== undefined) {
      update.$set['profile.drivingLicense.issuedAt'] = dto.issuedAt;
    }

    if (dto.expiresAt !== undefined) {
      update.$set['profile.drivingLicense.expiresAt'] = dto.expiresAt;
    }

    if (dto.documentUrl !== undefined) {
      update.$set['profile.drivingLicense.documentUrl'] = dto.documentUrl;
    }

    const updated = await this.userRepository.updateById(userId, update);

    if (!updated) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return await this.findSelfUserById(userId);
  }

  async updateUnits(userId: string, dto: UpdateUnitsDto): Promise<UserSelf> {
    const update: UpdateQuery<User> = { $set: {} };

    if (dto.distance !== undefined) {
      update.$set['settings.units.distance'] = dto.distance;
    }

    if (dto.volume !== undefined) {
      update.$set['settings.units.volume'] = dto.volume;
    }

    if (dto.speed !== undefined) {
      update.$set['settings.units.speed'] = dto.speed;
    }

    if (dto.fuelEconomy !== undefined) {
      update.$set['settings.units.fuelEconomy'] = dto.fuelEconomy;
    }

    if (dto.temperature !== undefined) {
      update.$set['settings.units.temperature'] = dto.temperature;
    }

    if (dto.pressure !== undefined) {
      update.$set['settings.units.pressure'] = dto.pressure;
    }

    const updated = await this.userRepository.updateById(userId, update);

    if (!updated) {
      this.logger.debug(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    return await this.findSelfUserById(userId);
  }

  generateEmailVerifyToken(): GenerateEmailTokenInput {
    const token = this.cryptoService.randomToken();
    const hash = this.cryptoService.hmacSign(token);
    const nowMs = getNowTimestamp();

    const tokenTtlMs = minutesToMs(this.crypto.email.verifyTokenTtlMinutes);
    const expiresAt = new Date(nowMs + tokenTtlMs);

    return {
      plain: token,
      hash,
      expiresAt,
    };
  }

  async verifyEmail(plainToken: string): Promise<boolean> {
    return await this.userRepository.verifyEmail(plainToken);
  }

  async updateEmail(userId: string, dto: UpdateEmailDto): Promise<UserSelf> {
    const { email: newEmail } = dto;
    const existing = await this.userRepository.existsActiveByEmail(newEmail, userId);

    const securityUser = await this.findSecurityUserById(userId);
    const { profile, email: oldEmail } = securityUser;
    const userName = buildFullName(profile.firstName, profile.lastName);

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    if (newEmail === oldEmail) {
      return await this.findSelfUserById(userId);
    }

    const emailVerifyToken = this.generateEmailVerifyToken();

    const update: UpdateQuery<User> = {
      $set: {
        email: newEmail,
        'verification.isEmailVerified': false,
        'verification.emailVerifyTokenHash': emailVerifyToken.hash,
        'verification.emailVerifyExpiresAt': emailVerifyToken.expiresAt,
      },
    };

    await this.userRepository.updateById(userId, update);

    await this.emailService.sendChangedEmail({
      to: oldEmail,
      userName,
      newEmail,
      oldEmail: oldEmail,
    });
    await this.emailService.sendVerificationEmail({
      to: newEmail,
      token: emailVerifyToken.plain,
      userName,
    });

    return await this.findSelfUserById(userId);
  }

  async updatePhone(userId: string, dto: UpdatePhoneDto): Promise<UserSelf> {
    const { phone } = dto;
    const existing = await this.userRepository.existsActiveByPhone(phone);

    if (existing) {
      throw new ConflictException('Phone number already in use');
    }

    const update: UpdateQuery<User> = { phone };
    await this.userRepository.updateById(userId, update);

    // Відправити SMS для підтвердження нового номера телефону можна тут

    return await this.findSelfUserById(userId);
  }
}
