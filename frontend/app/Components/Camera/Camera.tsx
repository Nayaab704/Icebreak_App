import { View, Text, Alert, LogBox } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { CameraMode, CameraView, FlashMode } from 'expo-camera'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import CameraTools from './CameraTools'
import MainRowActions from './MainRowActions'
import BottomRowTools from './BottomRowTools'
import { Ionicons } from "@expo/vector-icons"
import IconButton from './IconButton'
import PictureView from './PictureView'
import VideoViewComponent from './VideoView'
import { GestureEvent, GestureHandlerRootView, HandlerStateChangeEvent, PinchGestureHandler, PinchGestureHandlerEventPayload, State } from 'react-native-gesture-handler'

interface CameraProps {
    showCamera: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Camera({
    showCamera
}: CameraProps) {

    const CAMERA_RATIO = 100

    const cameraRef = useRef<CameraView>(null)
    // const [cameraRef, setCameraRef] = useState(null)
    const [cameraMode, setCameraMode] = useState<CameraMode>("picture")
    const [qrCodeDetected, setQrCodeDetected] = useState<string>("")
    const [isBrowsing, setIsBrowsing] = useState<boolean>(false)
    const [cameraFlash, setCameraFlash] = useState<FlashMode>('off')
    const [cameraFacing, setCameraFacing] = useState<"front" | "back">('back')
    const [cameraZoom, setCameraZoom] = useState<number>(0)
    const [isRecording, setIsRecording] = useState<boolean>(false)

    const [picture, setPicture] = useState<string>("")
    const [video, setVideo] = useState<string>("");

    const insets = useSafeAreaInsets()

    const trueCameraZoom = () => cameraZoom * CAMERA_RATIO

    // const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Suppress useless warning about ref
    LogBox.ignoreAllLogs()
    const originalWarn = console.error;
    console.error = (message) => {
        if (!message.includes('Warning: Function components cannot be given refs')) {
            originalWarn(message);
        }
    };


    async function toggleRecord() {
        if (isRecording) {
            cameraRef.current?.stopRecording()
            setIsRecording(false)
        } else {
            setIsRecording(true)
            const response = await cameraRef.current?.recordAsync({
                maxDuration: 60
            })
            setVideo(response!.uri)
        }
    }

    async function handleTakePicture() {
        const response = await cameraRef.current?.takePictureAsync({})
        console.log(response?.uri)
        setPicture(response!.uri)
    }

    const handlePinch = async (event: GestureEvent<PinchGestureHandlerEventPayload>) => {
        const sensitivity = 0.02 * (1 + trueCameraZoom())
        const velocity = event.nativeEvent.velocity

        let newZoom = trueCameraZoom() + (velocity * sensitivity)
        newZoom = Math.max(0, Math.min(newZoom, 5))

        setCameraZoom(newZoom / CAMERA_RATIO)
    }

    const handlePinchStateChange = (event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>) => {
        if (event.nativeEvent.state === State.BEGAN) {
            console.log("START SCALE", (event.nativeEvent.scale - 1) / 10)
            console.log("START ZOOM: ", cameraZoom) // Only store the current zoom level when the pinch gesture begins
        }
    };

    //   async function handleOpenQRCode() {
    //     setIsBrowsing(true)
    //     const browserResult = await WebBrowser.openBrowserAsync(qrCodeDetected, {
    //       presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET
    //     })
    //     if(browserResult.type === 'cancel') {
    //       setIsBrowsing(false)
    //     }
    //   }

    //   function handleBarCodeScanned(scanningResult: BarcodeScanningResult) {
    //     if(scanningResult.data) {
    //       console.log(scanningResult.data)
    //       setQrCodeDetected(scanningResult.data)

    //       if(timeoutRef.current) {
    //         clearTimeout(timeoutRef.current)
    //       }
    //       timeoutRef.current = setTimeout(() => {
    //         setQrCodeDetected("")
    //       }, 1000)
    //     }
    //   }

    function closeCamera() {
        cameraRef.current?.pausePreview()
        showCamera(false)
    }

    if (isBrowsing) return <></>
    if (picture) return <PictureView picture={picture} setPicture={setPicture} />
    if (video) return <VideoViewComponent video={video} setVideo={setVideo} />

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PinchGestureHandler
                onGestureEvent={handlePinch}
                onHandlerStateChange={handlePinchStateChange}
            >
                <CameraView
                    style={{
                        flex: 1,
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                        paddingLeft: insets.left,
                        paddingRight: insets.right
                    }}
                    ref={cameraRef}
                    mode={cameraMode}
                    zoom={cameraZoom}
                    flash={cameraFlash}
                    facing={cameraFacing}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"]
                    }}
                // onBarcodeScanned={handleBarCodeScanned}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{
                            position: "absolute",
                            top: 0,
                            left: 5,
                            zIndex: 50
                        }}>
                            <IconButton
                                iconName='close-circle-outline'
                                onPress={closeCamera}
                                size={40}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CameraTools
                                cameraFlash={cameraFlash}
                                cameraFacing={cameraFacing}
                                cameraZoom={cameraZoom}
                                setCameraFlash={setCameraFlash}
                                setCameraFacing={setCameraFacing}
                                setCameraZoom={setCameraZoom}
                            />
                            <MainRowActions
                                cameraMode={cameraMode}
                                handleTakePicture={cameraMode === 'picture' ? handleTakePicture : toggleRecord}
                                isRecording={isRecording}
                            />
                            <BottomRowTools setCameraMode={setCameraMode} cameraMode={cameraMode} />
                        </View>
                    </SafeAreaView>
                </CameraView>
            </PinchGestureHandler>
        </GestureHandlerRootView>
    )
}