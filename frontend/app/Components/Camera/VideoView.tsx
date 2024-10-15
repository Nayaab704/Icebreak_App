import { Image } from "expo-image";
import { Alert, View } from "react-native";
import IconButton from "./IconButton";
import { saveToLibraryAsync } from "expo-media-library";
import { shareAsync } from "expo-sharing";
import React from "react";
import { uploadVideoToS3 } from "../../../api/S3";
import { ResizeMode, Video } from "expo-av";

interface VideoViewComponentProps {
    video: string
    setVideo: React.Dispatch<React.SetStateAction<string>>

}

export default function VideoViewComponent({
    video,
    setVideo
} : VideoViewComponentProps) {

    const videoViewRef = React.useRef<Video>(null)
    const [isPlaying, setIsPlaying] = React.useState(false)
    // const player = useVideoPlayer(video, (player) => {
    //     player.loop = true
    //     player.muted = true
    //     player.play()
    // })

    // React.useEffect(() => {
    //     const subscription = player.addListener('playingChange', (isPlaying) => {
    //         setIsPlaying(isPlaying)
    //     })

    //     return () => {
    //         subscription.remove()
    //     }
    // }, [player])

    return (
        <View>
            <View style={{
                position: 'absolute',
                right: 6,
                zIndex: 1,
                paddingTop: 50,
                gap: 16
            }}>
                <IconButton
                    iconName="save"
                    onPress={async () => {
                        await saveToLibraryAsync(video)
                        Alert.alert("Picture saved!!!")
                    }}
                />
                <IconButton
                    iconName={isPlaying ? "pause" : "play"}
                    onPress={() => {
                        if(isPlaying) {
                            videoViewRef.current.pauseAsync()
                        } else {
                            videoViewRef.current.playAsync()
                        }
                        setIsPlaying(!isPlaying)
                    }}
                />
                <IconButton
                    iconName="share"
                    onPress={async () => await shareAsync(video)}
                />
                <IconButton
                    iconName="share"
                    onPress={async () => await uploadVideoToS3(video)}
                />
            </View>
            <View style={{
                position: 'absolute',
                left: 6,
                zIndex: 1,
                paddingTop: 50,
                gap: 16
            }}>
                <IconButton
                    iconName="close"
                    onPress={() => setVideo("")}
                />
            </View>
            <Video
                ref={videoViewRef}
                source={{
                    uri: video
                }}
                resizeMode={ResizeMode.COVER}
                isLooping
                className="w-full h-full"
            />
        </View>
    )
}