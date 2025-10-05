import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Session } from './schemas/session.schema';

@Injectable()
export class SessionRepository {
  constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) {}
}
