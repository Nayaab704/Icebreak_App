import { View, Text, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { CameraMode, CameraView, FlashMode, useCameraPermissions, useMicrophonePermissions } from 'expo-camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import CameraTools from './CameraTools'
import MainRowActions from './MainRowActions'
import BottomRowTools from './BottomRowTools'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { usePermissions } from 'expo-media-library'
import { ActivityIndicator, Button } from 'react-native-paper'

export default function Camera() {
    const cameraRef = React.useRef<CameraView>(null)
    const [cameraMode, setCameraMode] = React.useState<CameraMode>("picture")
    const [qrCodeDetected, setQrCodeDetected] = React.useState<string>("")
    const [isBrowsing, setIsBrowsing] = React.useState<boolean>(false)
    const [cameraTorch, setCameraTorch] = React.useState<boolean>(false)
    const [cameraFlash, setCameraFlash] = React.useState<FlashMode>('off')
    const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">('back')
    const [cameraZoom, setCameraZoom] = React.useState<number>(0)
    const [isRecording, setIsRecording] = React.useState<boolean>(false)

    const [picture, setPicture] = React.useState<string>("")
    const [video, setVideo] = React.useState<string>(""); 

    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    /*
        Ask Permissions to use Camera, Microphone, and Library
    */

    const [cameraPermissions, requestCameraPermissions] = useCameraPermissions()
    const [microphonePermissions, requestMicrophonePermissions] = useMicrophonePermissions()
    const [mediaLibraryPermissions, requestMediaLibraryPermissions] = usePermissions()

    // if(!cameraPermissions || !microphonePermissions || !mediaLibraryPermissions) {
    //     return (
    //         <ActivityIndicator/>
    //     )
    // }

    async function requestAllPermissions() {
        const cameraStatus = await requestCameraPermissions()
        if(!cameraStatus.granted) {
        Alert.alert('Error', "Camera permissions is required")
        return false
        }
        const microphoneStatus = await requestMicrophonePermissions()
        if(!microphoneStatus.granted) {
        Alert.alert('Error', "Microphone permissions is required")
        return false
        }
        const mediaLibraryStatus = await requestMediaLibraryPermissions()
        if(!mediaLibraryStatus.granted) {
        Alert.alert('Error', "Media library permissions is required")
        return false
        }
        await AsyncStorage.setItem('hasOpened', "true")
        return true
    }

    useEffect(() => {
        const checkPermissions = async () => {
            if(!cameraPermissions.granted || !microphonePermissions.granted || !mediaLibraryPermissions.granted) {
                await requestAllPermissions()
            }
        }
        checkPermissions()
    }, [])

    async function toggleRecord() {
        if(isRecording) {
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

    // if(!cameraPermissions.granted || !microphonePermissions.granted || !mediaLibraryPermissions.granted) {
    //     return (
    //         <SafeAreaView>
    //             <Text>We require permission to use your camera, microphone, and media library to use this app.</Text>
    //             <Button onPress={async () => await requestAllPermissions()}>Continue</Button>
    //         </SafeAreaView>
    //     )
    // }

    if(isBrowsing) return <></>
//   if(picture) return <PictureView picture={picture} setPicture={setPicture}/>
//   if(video) return <VideoViewComponent video={video} setVideo={setVideo}/>

    return (
        <View style={{flex: 1}}>
        <CameraView
            style={{flex: 1}}
            ref={cameraRef}
            mode={cameraMode}
            zoom={cameraZoom}
            flash={cameraFlash}
            enableTorch={cameraTorch}
            facing={cameraFacing}
            barcodeScannerSettings={{
            barcodeTypes: ["qr"]
            }}
            // onBarcodeScanned={handleBarCodeScanned}
        >
            <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
                <CameraTools
                cameraTorch={cameraTorch}
                cameraFlash={cameraFlash}
                cameraFacing={cameraFacing}
                cameraZoom={cameraZoom}
                setCameraTorch={setCameraTorch}
                setCameraFlash={setCameraFlash}
                setCameraFacing={setCameraFacing}
                setCameraZoom={setCameraZoom}
                />
                <MainRowActions
                cameraMode={cameraMode}
                handleTakePicture={cameraMode === 'picture' ? handleTakePicture : toggleRecord}
                isRecording={isRecording}
                />
                <BottomRowTools setCameraMode={setCameraMode} cameraMode={cameraMode}/>
            </View>
            </SafeAreaView>
        </CameraView>
        </View>
    )
}