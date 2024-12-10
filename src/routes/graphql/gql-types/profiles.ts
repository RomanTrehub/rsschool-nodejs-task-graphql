import {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './users.js';
import { Context } from '../ts-types/contextType.js';
import { ProfileEntity } from '../ts-types/profilesType.js';
import { MemberType, MemberTypeIdType } from './memberType.js';

export const ChangeInputProfileType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: { type: MemberTypeIdType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});

export const CreateInputProfileType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    memberTypeId: { type: MemberTypeIdType },
    isMale: { type: GraphQLBoolean },
    userId: { type: UUIDType },
    yearOfBirth: { type: GraphQLInt },
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: UUIDType },
    user: {
      type: UserType,
      resolve: ({ userId }: ProfileEntity, _, { usersLoader }: Context) => {
        return usersLoader.load(userId);
      },
    },
    memberType: {
      type: MemberType,
      resolve: ({ memberTypeId }: ProfileEntity, _, { memberTypesLoader }: Context) => {
        return memberTypesLoader.load(memberTypeId);
      },
    },
  }),
});
