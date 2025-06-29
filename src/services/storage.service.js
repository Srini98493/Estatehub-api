const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Load environment variables
const ENV = process.env.S3_ENV || 'dev';

const CDN_BASE_MAP = {
    dev: 'dev-cdn.estateshub.co.in',
    uat: 'dev-cdn.estateshub.co.in',
    prod: 'cdn.estateshub.co.in'
};

const cdnBase = CDN_BASE_MAP[ENV];

const s3Client = new S3Client({
    endpoint: 'https://usc1.contabostorage.com',
    credentials: {
        accessKeyId: '675c948592513864a81ad2f9e85a4228',
        secretAccessKey: 'dfbb2b631cdd64e184e14a33b3775bc4'
    },
    region: 'us-east-1',
    forcePathStyle: true
});

const bucketMap = {
    dev: 'ehub-dev',
    uat: 'ehub-dev',
    prod: 'ehub-prod'
};

const bucketName = bucketMap[ENV];
// const bucketName = 'ehub-dev';

const uploadFile = async (file) => {
    try {
        const sanitizedFileName = path.parse(file.originalname).name.replace(/\s+/g, '_');
        const fileExtension = path.parse(file.originalname).ext;
        const fileName = `properties/${uuidv4()}_${sanitizedFileName}${fileExtension}`;

        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        return `https://${cdnBase}/060e835992534d1face309804cd35474:${bucketName}/${fileName}`;
    } catch (error) {
        throw new Error(`Could not upload file: ${error.message}`);
    }
};

// ... (rest remains unchanged)


const uploadMultipleFiles = async (files) => {
    try {
        const uploadPromises = files.map(file => uploadFile(file));
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        throw new Error(`Could not upload files: ${error.message}`);
    }
};

const deleteFile = async (fileUrl) => {
    try {
        let url = fileUrl;
        if (typeof fileUrl === 'object') {
            url = fileUrl.attachmenturl || fileUrl.url;
            if (!url) {
                return;
            }
        }

        const urlParts = url.split(`${bucketName}/`);
        if (urlParts.length !== 2) {
            return;
        }
        const key = urlParts[1];

        const deleteParams = {
            Bucket: bucketName,
            Key: key
        };
        
        await s3Client.send(new DeleteObjectCommand(deleteParams));
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = {
    uploadFile,
    uploadMultipleFiles,
    deleteFile
}; 