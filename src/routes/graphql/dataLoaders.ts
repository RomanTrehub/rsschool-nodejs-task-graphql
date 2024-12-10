import type { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { UserEntity } from './ts-types/userType.js';
import { PostEntity } from './ts-types/postEntityType.js';
import { ProfileEntity } from './ts-types/profilesType.js';
import { MemberTypeEntity } from './ts-types/memberType.js';

const getUsers = async (prisma: PrismaClient, ids: string[]) => {
  const returnedUsers = await prisma.user.findMany({
    include: { subscribedToUser: true, userSubscribedTo: true },
    where: { id: { in: ids } },
  });
  const returnedUsersMap: Record<string, UserEntity> = {};

  for (const user of returnedUsers) {
    returnedUsersMap[user.id] = user;
  }

  return ids.map((id) => returnedUsersMap[id]);
};

const getPosts = async (prisma: PrismaClient, authorIds: string[]) => {
  const returnedPosts = await prisma.post.findMany({
    where: { authorId: { in: authorIds } },
  });
  const returnedPostsMap: Record<string, PostEntity[]> = {};

  for (const post of returnedPosts) {
    if (!returnedPostsMap[post.authorId]) {
      returnedPostsMap[post.authorId] = [];
    }

    returnedPostsMap[post.authorId].push(post);
  }

  return authorIds.map((authorId) => returnedPostsMap[authorId]);
};

const getProfilesById = async (prisma: PrismaClient, userIds: string[]) => {
  const returnedProfiles = await prisma.profile.findMany({
    where: { userId: { in: userIds } },
  });
  const returnedProfilesMap: Record<string, ProfileEntity> = {};

  for (const profile of returnedProfiles) {
    returnedProfilesMap[profile.userId] = profile;
  }

  return userIds.map((userId) => returnedProfilesMap[userId]);
};

const getProfilesByMemberType = async (prisma: PrismaClient, memberTypeIds: string[]) => {
  const returnedProfiles = await prisma.profile.findMany({
    where: { memberTypeId: { in: memberTypeIds } },
  });
  const returnedProfilesMap: Record<string, ProfileEntity[]> = {};

  for (const profile of returnedProfiles) {
    if (!returnedProfilesMap[profile.memberTypeId]) {
      returnedProfilesMap[profile.memberTypeId] = [];
    }
    returnedProfilesMap[profile.userId].push(profile);
  }

  return memberTypeIds.map((memberTypeId) => returnedProfilesMap[memberTypeId]);
};

const getMemberTypes = async (prisma: PrismaClient, memberIds: string[]) => {
  const returnedMemberTypes = await prisma.memberType.findMany({
    where: { id: { in: memberIds } },
  });
  const returnedMemberTypesMap: Record<string, MemberTypeEntity> = {};

  for (const memberType of returnedMemberTypes) {
    returnedMemberTypesMap[memberType.id] = memberType;
  }

  return memberIds.map((userId) => returnedMemberTypesMap[userId]);
};

export const createDataLoaders = (prisma: PrismaClient) => ({
  usersLoader: new DataLoader<string, UserEntity>((ids) =>
    getUsers(prisma, ids as string[]),
  ),
  postsLoader: new DataLoader<string, PostEntity[]>((ids) =>
    getPosts(prisma, ids as string[]),
  ),
  profilesLoaderById: new DataLoader<string, ProfileEntity>((ids) =>
    getProfilesById(prisma, ids as string[]),
  ),
  profilesLoaderByMemberType: new DataLoader<string, ProfileEntity[]>((ids) =>
    getProfilesByMemberType(prisma, ids as string[]),
  ),
  memberTypesLoader: new DataLoader<string, MemberTypeEntity>((ids) =>
    getMemberTypes(prisma, ids as string[]),
  ),
});

export type ReturnedDataLoadersType = ReturnType<typeof createDataLoaders>;
