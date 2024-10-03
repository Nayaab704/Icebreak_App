import { Image } from "expo-image";
import { Alert, View } from "react-native";
import IconButton from "./IconButton";
import { saveToLibraryAsync } from "expo-media-library";
import { shareAsync } from "expo-sharing";

interface PictureViewProps {
    picture: string
    setPicture: React.Dispatch<React.SetStateAction<string>>

}

export default function PictureView({
    picture,
    setPicture
} : PictureViewProps) {
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
                        await saveToLibraryAsync(picture)
                        Alert.alert("Picture saved!!!")
                    }}
                />
                <IconButton
                    iconName="share"
                    onPress={async () => await shareAsync(picture)}
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
                    iconName="close-circle-outline"
                    onPress={() => setPicture("")}
                />
            </View>
            <Image
                source={picture}
                style={{
                    width: '100%',
                    height: '100%'
                }}
            />
        </View>
    )
}