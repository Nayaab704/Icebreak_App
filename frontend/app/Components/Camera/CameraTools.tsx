import { FlashMode } from "expo-camera";
import { View } from "react-native";
import IconButton from "./IconButton";

interface CameraToolsProps {
   cameraTorch: boolean 
   cameraFlash: FlashMode
   cameraFacing: "front" | "back"
   cameraZoom: number
   setCameraTorch: React.Dispatch<React.SetStateAction<boolean>>
   setCameraFlash: React.Dispatch<React.SetStateAction<FlashMode>>
   setCameraFacing: React.Dispatch<React.SetStateAction<"front" | "back">>
   setCameraZoom: React.Dispatch<React.SetStateAction<number>>
}

export default function CameraTools({
    cameraTorch,
    cameraFlash,
    cameraFacing,
    cameraZoom,
    setCameraTorch,
    setCameraFlash,
    setCameraFacing,
    setCameraZoom
}: CameraToolsProps) {
    return (
        <View style={{
            position: 'absolute',
            right: 6,
            gap: 16,
            zIndex: 1
        }}>
            <IconButton
                onPress={() => setCameraTorch((prevValue) => !prevValue)}
                iconName={cameraTorch ? "flash" : "flash-off"}
            />
            <IconButton
                onPress={() =>
                setCameraFacing((prevValue) =>
                    prevValue === "back" ? "front" : "back"
                )
                }
                iconName="close"
                width={25}
                height={21}
            />
            <IconButton
                onPress={() =>
                setCameraFlash((prevValue) => (prevValue === "off" ? "on" : "off"))
                }
                iconName={cameraFlash === "on" ? "flash" : "flash-off"}
            />
            <IconButton
                onPress={() => {}}
                iconName="volume-high"
            />
            {/* <IconButton
                onPress={() => {
                // increment by .01
                if (cameraZoom < 1) {
                    setCameraZoom((prevValue) => prevValue + 0.01);
                }
                }}
                iconName="sear"
            />
            <IconButton
                onPress={() => {
                // decrement by .01
                if (cameraZoom > 0) {
                    setCameraZoom((prevValue) => prevValue - 0.01);
                }
                }}
                iosName={"minus.magnifyingglass"}
                androidName="close"
            /> */}
        </View>
    )
}