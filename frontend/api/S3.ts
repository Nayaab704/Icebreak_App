import { LOCAL_API_URL } from "@env"
import axios from 'axios';

const API_URL = `${LOCAL_API_URL}/api/s3`;

export const uploadVideoToS3 = async (fileUri: string) => {

    const video = await fetch(fileUri)
    const contentType = video["headers"]["map"]["content-type"]
    const blob = await video.blob()

    try {
        const response = await axios.post(`${API_URL}/video_upload_pre_signed_url`, {
            contentType
        })
        const url = response.data
        const uploadResponse = await fetch(url, {
            method: "PUT",
            body: blob,
            headers: {
                "Content-Type": contentType
            }
        })

        if(uploadResponse.ok) {
            console.log("Video uploaded to S3")
        } else {
            console.log("Video upload failed: ", uploadResponse)
        }

    } catch (error) {
        console.log(error.message)
        throw error.response.data;
    }
    
}