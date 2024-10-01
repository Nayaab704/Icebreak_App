import { View, Text, Alert } from 'react-native'
import React, { useRef } from 'react'
import { CameraMode, CameraView, FlashMode } from 'expo-camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import CameraTools from './CameraTools'
import MainRowActions from './MainRowActions'
import BottomRowTools from './BottomRowTools'

export default function Camera() {
    const cameraRef = useRef(null)
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

    // const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
                // handleTakePicture={cameraMode === 'picture' ? handleTakePicture : toggleRecord}
                handleTakePicture={() => {}}
                isRecording={isRecording}
                />
                <BottomRowTools setCameraMode={setCameraMode} cameraMode={cameraMode}/>
            </View>
            </SafeAreaView>
        </CameraView>
        </View>
    )
}