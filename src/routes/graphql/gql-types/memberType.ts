import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';
import { ProfileType } from './profiles.js';
import { MemberTypeEntity } from '../ts-types/memberType.js';
import { Context } from '../ts-types/contextType.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export const MemberTypeIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: { value: MemberTypeId.BASIC },
    [MemberTypeId.BUSINESS]: { value: MemberTypeId.BUSINESS },
  },
});

export const MemberType: GraphQLObjectType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: MemberTypeIdType,
    },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (
        { id }: MemberTypeEntity,
        _args,
        { profilesLoaderByMemberType, profilesLoaderById }: Context,
      ) => {
        const profiles = await profilesLoaderByMemberType.load(id);
        for (const profile of profiles) {
          profilesLoaderById.prime(profile.id, profile);
        }
        return profiles;
      },
    },
  }),
});
