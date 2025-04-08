export type UserDocument = {
  id: string;
  name: string;
  type: string;
  saved: boolean;
  status: 'Processing' | 'Success' | 'Failed';
  createdAt: string;
};

export type chatBot = {
  id: string;
  botName: string;
  botDescription: string;
  openingMessage: string;
  selectedDocs: string[];
  botPersona: string[];
  allowedDomains: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateBotFormInputs = {
  botName: string;
  botDescription: string;
  openingMessage: string;
  selectedDocs: string[];
  botPersona: string[];
  allowedDomains: string[];
};
