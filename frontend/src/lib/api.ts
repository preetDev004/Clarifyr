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

export const chatApi = {
  uploadDocument,
};
