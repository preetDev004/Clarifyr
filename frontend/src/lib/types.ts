export type UserDocument = {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'Processing' | 'Success' | 'Failed';
  createdAt: string;
  updatedAt: string;
};
