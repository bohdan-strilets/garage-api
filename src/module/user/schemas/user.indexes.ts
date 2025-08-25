import type { Schema } from 'mongoose';

export const UserIndexesPlugin = (schema: Schema) => {
  schema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { deletedAt: null } },
  );

  schema.index(
    { phone: 1 },
    {
      unique: true,
      partialFilterExpression: {
        phone: { $exists: true, $ne: null },
        deletedAt: null,
      },
    },
  );

  schema.index({
    'profile.firstName': 'text',
    'profile.lastName': 'text',
    'profile.nickName': 'text',
    email: 'text',
  });
};
