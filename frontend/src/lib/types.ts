export type UserDocument = {
  id: string;
  name: string;
  type: string;
  saved: boolean;
  status: 'Processing' | 'Success' | 'Failed';
  createdAt: string;
};

// Casing and naming conventions is SNAKE here to match backend
export interface Chatbot {
  id: string;
  name: string;
  description: string | null;
  welcome_message: string | null;
  personality_traits: string[] | null;
  expertise_docs: Array<{ id: string }>;
  whitelist_domains: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type CreateBotFormInputs = {
  name: string;
  description: string;
  welcome_message: string;
  personality_traits: string[];
  expertise_docs: string[];
  whitelist_domains: string[];
};
