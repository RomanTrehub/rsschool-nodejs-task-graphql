export type ProfileEntity = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
};

export type CreateInputProfileFieldsType = Omit<ProfileEntity, 'id'>;
export type ChangeInputProfileFieldsType = Partial<
  Omit<CreateInputProfileFieldsType, 'userId'>
>;
