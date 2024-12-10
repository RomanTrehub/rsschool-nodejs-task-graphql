export type PostEntity = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export type CreateInputPostFieldsType = Omit<PostEntity, 'id'>;
export type ChangeInputPostFieldsType = Partial<CreateInputPostFieldsType>;
