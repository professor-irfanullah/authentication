require('dotenv').config()
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path');



cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.API_key,
    api_secret: process.env.API_secret
});
const uploadImageOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'image',
            folder: 'profile_images'
        })
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return error
    }
}
module.exports = { uploadImageOnCloudinary }