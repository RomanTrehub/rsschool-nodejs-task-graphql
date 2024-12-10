import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profiles.js';
import { Context } from '../ts-types/contextType.js';
import { UserEntity } from '../ts-types/userType.js';
import { PostType } from './post.js';

export const CreateInputUserType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const ChangeInputUserType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    profile: {
      type: ProfileType,
      resolve: (source: UserEntity, _args, { profilesLoaderById }: Context) => {
        return profilesLoaderById.load(source.id);
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: ({ id }: UserEntity, _args, { postsLoader }: Context) => {
        return postsLoader.load(id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: ({ userSubscribedTo }: UserEntity, _args, { usersLoader }: Context) => {
        if (!userSubscribedTo) {
          return [];
        }

        const authorsIds = userSubscribedTo.map(({ authorId }) => authorId);
        return usersLoader.loadMany(authorsIds);
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: ({ subscribedToUser }: UserEntity, _args, { usersLoader }: Context) => {
        if (!subscribedToUser) {
          return [];
        }

        const subscribersIds = subscribedToUser.map(({ subscriberId }) => subscriberId);
        return usersLoader.loadMany(subscribersIds);
      },
    },
  }),
});
