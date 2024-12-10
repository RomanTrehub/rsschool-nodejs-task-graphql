import { SubscribedToUser, UserSubscribedTo } from './subscriptionsType.js';

export type UserEntity = {
  id: string;
  name: string;
  balance: number;
  userSubscribedTo?: UserSubscribedTo[];
  subscribedToUser?: SubscribedToUser[];
};

export type CreateUserInputFields = Pick<UserEntity, 'name' | 'balance'>;
export type ChangeUserInputFields = Partial<CreateUserInputFields>;
