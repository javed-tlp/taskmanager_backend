const mimeTypes = require('mime-types');  // Use mime-types instead of mime
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const uploadUPIScannerImage = async (base64String) => {
    try {
        console.log('UploadUPIScannerImage API called');

        // Trim the base64 string to remove any leading/trailing spaces
        base64String = base64String.trim();

        // Check if base64 string includes the correct prefix (for PNG/JPEG images)
        if (!base64String.startsWith('data:image/')) {
            console.warn('Invalid base64 format. Adding PNG type by default');
            base64String = 'data:image/png;base64,' + base64String; // Prepending default image type (png)
        }

        // Validate the base64 string format
        const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,/;
        if (!base64Pattern.test(base64String)) {
            console.warn('Invalid base64 format. Expected format: data:image/<mime_type>;base64,<base64_string>');
            throw new Error('Invalid base64 format');
        }

        // Decode the base64 string
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        const mimeType = matches[1];
        const extension = mimeTypes.extension(mimeType);  // Use mime-types package for extension
        const imageData = Buffer.from(matches[2], 'base64');

        // Use path.resolve to ensure the uploads folder is in the root directory
        const monthYear = moment().format('YYYY-MM');
        const uploadDir = path.resolve(__dirname, '../uploads', monthYear); // Save to 'uploads' folder in the root

        // Create directory if it does not exist
        if (!fs.existsSync(uploadDir)) {
            console.log('Creating directory:', uploadDir);
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}.${extension}`;
        const uploadPath = path.join(uploadDir, fileName);

        // Write the file to the directory
        fs.writeFileSync(uploadPath, imageData);

        const uploadUrl = path.join('uploads', monthYear, fileName);
        console.log('File uploaded successfully at:', uploadUrl);

        return uploadUrl; // Return the relative file path
    } catch (error) {
        console.error('Error uploading UPI scanner image:', error.message);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

module.exports = { uploadUPIScannerImage };
