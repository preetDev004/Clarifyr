const uploadDocument = async (file: File, sessionId: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/upload_data`,
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

const getAllDocuments = async (sessionId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/get_data`,
      {
        method: 'GET',
        headers: {
          SessionID: sessionId,
        },
        mode: 'cors',
      }
    );
    if (!response.ok) {
      throw new Error('Get all documents failed');
    }
    return await response.json();
  } catch (error) {
    console.log('Get all documents failed:', error);
    throw error;
  }
}

export const chatApi = {
  uploadDocument,
  getAllDocuments,
};
