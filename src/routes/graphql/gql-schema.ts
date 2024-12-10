import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { ChangeInputUserType, CreateInputUserType, UserType } from './gql-types/users.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { UUIDType } from './gql-types/uuid.js';
import { Context } from './ts-types/contextType.js';
import { ChangeInputPostType, CreateInputPostType, PostType } from './gql-types/post.js';
import {
  ChangeInputProfileType,
  CreateInputProfileType,
  ProfileType,
} from './gql-types/profiles.js';
import { MemberType, MemberTypeIdType } from './gql-types/memberType.js';
import { ChangeUserInputFields, CreateUserInputFields } from './ts-types/userType.js';
import {
  ChangeInputPostFieldsType,
  CreateInputPostFieldsType,
} from './ts-types/postEntityType.js';
import {
  ChangeInputProfileFieldsType,
  CreateInputProfileFieldsType,
} from './ts-types/profilesType.js';

export const graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: {
      user: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_source, { id }: { id: string }, { usersLoader }: Context) => {
          return usersLoader.load(id);
        },
      },
      post: {
        type: PostType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_source, { id }: { id: string }, { prisma }: Context) => {
          return prisma.post.findUnique({ where: { id } });
        },
      },
      profile: {
        type: ProfileType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_source, { id }: { id: string }, { prisma }: Context) => {
          return prisma.profile.findUnique({ where: { id } });
        },
      },
      memberType: {
        type: MemberType,
        args: { id: { type: new GraphQLNonNull(MemberTypeIdType) } },
        resolve: async (_source, { id }: { id: string }, { prisma }: Context) => {
          console.log('MEMBERTYPE', id);
          const memberType = await prisma.memberType.findUnique({ where: { id } });
          return memberType;
          // return prisma.memberType.findUnique({ where: { id } });
        },
      },
      users: {
        type: new GraphQLList(UserType),
        resolve: async (_source, _args, { prisma, usersLoader }: Context, info) => {
          const parsedInfo = parseResolveInfo(info);
          const fields = parsedInfo?.fieldsByTypeName.User;
          const includeSubsInDBRequest = {};

          if (fields && 'userSubscribedTo' in fields) {
            includeSubsInDBRequest['userSubscribedTo'] = true;
          }

          if (fields && 'subscribedToUser' in fields) {
            includeSubsInDBRequest['subscribedToUser'] = true;
          }

          const users = await prisma.user.findMany({ include: includeSubsInDBRequest });

          for (const user of users) {
            usersLoader.prime(user.id, user);
          }
          return users;
        },
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve: async (_source, _args, { prisma }: Context) => {
          return prisma.post.findMany();
        },
      },
      profiles: {
        type: new GraphQLList(ProfileType),
        resolve: async (_source, _args, { prisma }: Context) => {
          return prisma.profile.findMany();
        },
      },
      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async (_source, _args, { prisma }: Context) => {
          return prisma.memberType.findMany();
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      createUser: {
        type: UserType,
        args: { dto: { type: new GraphQLNonNull(CreateInputUserType) } },
        resolve: (
          _source,
          { dto }: { dto: CreateUserInputFields },
          { prisma }: Context,
        ) => {
          return prisma.user.create({ data: dto });
        },
      },
      changeUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeInputUserType) },
        },
        resolve: (
          _source,
          { id, dto }: { id: string; dto: ChangeUserInputFields },
          { prisma }: Context,
        ) => {
          return prisma.user.update({ where: { id }, data: dto });
        },
      },

      deleteUser: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }: { id: string }, { prisma }: Context) => {
          await prisma.user.delete({ where: { id } });
          return null;
        },
      },
      createPost: {
        type: PostType,
        args: { dto: { type: new GraphQLNonNull(CreateInputPostType) } },
        resolve: (
          _source,
          { dto }: { dto: CreateInputPostFieldsType },
          { prisma }: Context,
        ) => {
          return prisma.post.create({ data: dto });
        },
      },
      changePost: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeInputPostType) },
        },
        resolve: (
          _source,
          { id, dto }: { id: string; dto: ChangeInputPostFieldsType },
          { prisma }: Context,
        ) => {
          return prisma.post.update({ where: { id }, data: dto });
        },
      },

      deletePost: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }: { id: string }, { prisma }: Context) => {
          await prisma.post.delete({ where: { id } });
          return null;
        },
      },

      createProfile: {
        type: ProfileType,
        args: { dto: { type: new GraphQLNonNull(CreateInputProfileType) } },
        resolve: (
          _source,
          { dto }: { dto: CreateInputProfileFieldsType },
          { prisma }: Context,
        ) => {
          return prisma.profile.create({ data: dto });
        },
      },
      changeProfile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeInputProfileType) },
        },
        resolve: (
          _source,
          { id, dto }: { id: string; dto: ChangeInputProfileFieldsType },
          { prisma }: Context,
        ) => {
          return prisma.profile.update({ where: { id }, data: dto });
        },
      },
      deleteProfile: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }: { id: string }, { prisma }: Context) => {
          await prisma.profile.delete({ where: { id } });
          return null;
        },
      },

      subscribeTo: {
        type: UserType,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (
          _source,
          { userId, authorId }: { userId: string; authorId: string },
          { prisma }: Context,
        ) => {
          await prisma.user.update({
            where: { id: userId },
            data: { userSubscribedTo: { create: { authorId } } },
          });
        },
      },
      unsubscribeFrom: {
        type: GraphQLString,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (
          _source,
          { userId, authorId }: { userId: string; authorId: string },
          { prisma }: Context,
        ) => {
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                authorId,
                subscriberId: userId,
              },
            },
          });
        },
      },
    },
  }),
});
