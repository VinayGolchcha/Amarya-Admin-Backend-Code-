

export const generateDownloadLinkMySQL = async (buffer, name) => {
    try {
     
      const base64FileData = buffer.toString('base64');
      let mimeType = 'application/octet-stream'; // Default MIME type
  
        const extension = name.split('.').pop().toLowerCase();
        switch (extension) {
        case 'pdf':
            mimeType = 'application/pdf';
            break;
        case 'doc':
            mimeType = 'application/msword';
            break;
        case 'docx':
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
        case 'ppt':
            mimeType = 'application/vnd.ms-powerpoint';
            break;
        case 'pptx':
            mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            break;
        case 'xls':
            mimeType = 'application/vnd.ms-excel';
            break;
        case 'xlsx':
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
        case 'exe':
            mimeType = 'application/x-msdownload';
            break;
        default:
            mimeType = 'application/octet-stream';
            break;
        }
  
      // Create a downloadable link
      const downloadLink = `data:${mimeType};base64,${base64FileData}`;
      return downloadLink;
    } catch (error) {
      console.error('Failed to generate download link: ' + error);
      throw error;
    }
  };