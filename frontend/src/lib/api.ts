import { UserDocument } from './types';

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

export const chatApi = {
  uploadDocument,
  getAllDocuments,
};
