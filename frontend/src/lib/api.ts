import { CreateBotFormInputs, UserDocument } from './types';

const uploadDocument = async (file: File, sessionId: string, save: boolean) => {
  try {
    const queryParams = new URLSearchParams();
    if (save) {
      queryParams.append('save', save.toString());
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/upload_data?${queryParams.toString()}`,
      {
        method: 'POST',
        headers: {
          SessionID: sessionId,
        },
        body: formData,
        mode: 'cors',
      }
    );
    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.log('Upload failed:', error);
    throw error;
  }
};

const getAllDocuments = async (
  sessionId: string,
  searchQuery?: string
): Promise<UserDocument[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (searchQuery) {
      queryParams.append('q', searchQuery);
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/get_data?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        SessionID: sessionId,
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    return await response.json();
  } catch (error) {
    console.log('Get all documents failed:', error);
    throw error;
  }
};

const getDocumentContent = async (sessionId: string, docId: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/get_data/${docId}?type=original`;

    // Fetch as arrayBuffer to handle binary data properly
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        SessionID: sessionId,
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch document: ${response.status} ${response.statusText}`
      );
    }

    // Handle the response based on the content type
    const contentType = response.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) {
      // If it's JSON, parse it
      return await response.json();
    } else if (contentType.includes('text/')) {
      // If it's text, get as text
      return await response.text();
    } else {
      // For binary formats (PDF, DOCX, etc.), get as ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      // Convert to a format suitable for creating Blobs
      return arrayBuffer;
    }
  } catch (error) {
    console.error('Get document content failed:', error);
    throw error;
  }
};

const getAllChatbots = async (sessionId: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/chatbots`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        SessionID: sessionId,
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    return await response.json();
  } catch (error) {
    console.log('Get all chatbots failed:', error);
    throw error;
  }
};
const createChatbot = async (
  sessionId: string,
  chatbotData: CreateBotFormInputs
) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/chatbot`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        SessionID: sessionId,
      },
      mode: 'cors',
      body: JSON.stringify(chatbotData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create chatbot');
    }

    return await response.json();
  } catch (error) {
    console.error('Create chatbot failed:', error);
    throw error;
  }
};
export const chatApi = {
  uploadDocument,
  getAllDocuments,
  getDocumentContent,
  getAllChatbots,
  createChatbot,
};
