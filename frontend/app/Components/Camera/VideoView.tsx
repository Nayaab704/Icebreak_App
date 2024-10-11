import { Image } from "expo-image";
import { Alert, View } from "react-native";
import IconButton from "./IconButton";
import { saveToLibraryAsync } from "expo-media-library";
import { shareAsync } from "expo-sharing";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { uploadVideoToS3 } from "../../../api/S3";

interface VideoViewComponentProps {
    video: string
    setVideo: React.Dispatch<React.SetStateAction<string>>

}

export default function VideoViewComponent({
    video,
    setVideo
} : VideoViewComponentProps) {

    const videoViewRef = React.useRef<VideoView>(null)
    const [isPlaying, setIsPlaying] = React.useState(true)
    const player = useVideoPlayer(video, (player) => {
        player.loop = true
        player.muted = true
        player.play()
    })

    React.useEffect(() => {
        const subscription = player.addListener('playingChange', (isPlaying) => {
            setIsPlaying(isPlaying)
        })

        return () => {
            subscription.remove()
        }
    }, [player])

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
                    iconName={isPlaying ? "play" : "pause"}
                    onPress={() => {
                        if(isPlaying) {
                            player.pause()
                        } else {
                            player.play()
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
            <VideoView
                ref={videoViewRef}
                style={{
                    width: "100%",
                    height: "100%"
                }}
                player={player}
                allowsFullscreen
                nativeControls
            />
        </View>
    )
}