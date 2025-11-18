import { Body, Controller, Get, Patch } from '@nestjs/common';

import { Auth, CurrentUserId } from '@app/common/decorators';

import {
  UpdateAddressDto,
  UpdateDrivingLicenseDto,
  UpdateProfileDto,
  UpdateProfileSettingsDto,
  UpdateUnitsDto,
} from './dto';
import { UserSelf } from './types';
import { UserService } from './user.service';

@Auth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@CurrentUserId() userId: string): Promise<UserSelf> {
    return await this.userService.findSelfUserById(userId);
  }

  @Patch('me/profile')
  async updateProfile(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserSelf> {
    return await this.userService.updateProfile(userId, dto);
  }

  @Patch('me/settings')
  async updateProfileSettings(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateProfileSettingsDto,
  ): Promise<UserSelf> {
    return await this.userService.updateProfileSettings(userId, dto);
  }

  @Patch('me/profile/address')
  async updateProfileAddress(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateAddressDto,
  ): Promise<UserSelf> {
    return await this.userService.updateProfileAddress(userId, dto);
  }

  @Patch('me/profile/driving-license')
  async updateDrivingLicense(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateDrivingLicenseDto,
  ): Promise<UserSelf> {
    return await this.userService.updateDrivingLicense(userId, dto);
  }

  @Patch('me/settings/units')
  async updateUnits(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateUnitsDto,
  ): Promise<UserSelf> {
    return await this.userService.updateUnits(userId, dto);
  }
}
