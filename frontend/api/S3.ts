import { LOCAL_API_URL } from "@env"
import axios from 'axios';

const API_URL = `${LOCAL_API_URL}/api/s3`;

export const uploadVideoToS3 = async (fileUri: string, username: string) => {

    const video = await fetch(fileUri)
    const contentType = video["headers"]["map"]["content-type"]
    const blob = await video.blob()

    console.log(username)

    try {
        const response = await axios.post(`${API_URL}/video_upload_pre_signed_url`, {
            contentType,
            username
        })
        const {url, videoFileName}: {url: string, videoFileName: string} = response.data
        console.log(url, videoFileName)
        const uploadResponse = await fetch(url, {
            method: "PUT",
            body: blob,
            headers: {
                "Content-Type": contentType
            }
        })

        if(uploadResponse.ok) {
            console.log("Video uploaded to S3")
            return videoFileName
        } else {
            console.log("Video upload failed: ", uploadResponse)
            throw new Error("Video upload failed.")
        }

    } catch (error) {
        console.log(error.message)
        throw error.response.data;
    }
    
}