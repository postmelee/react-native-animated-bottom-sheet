# react-native-animated-bottom-sheet
![npm-version](https://img.shields.io/npm/v/react-native-animated-bottom-sheet)
![Download-status](https://img.shields.io/npm/dm/react-native-animated-bottom-sheet)

**Swipeable**, **Animated**, **Compact** - Bottom sheet for react native project.


## 🛠  Installation
Open a Terminal in the project root and run:
```sh
npm i react-native-animated-bottom-sheet --save
```
Now we need to install [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)
```sh
npm i react-native-gesture-handler --save
```

## 📝  Requirements
- [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)

## 🧬  Available Props
|Name|Type|Require|Description|
|---|---|---|---|
|closeBottomSheet|`boolean`|`true`|Set to `true` if bottom sheet should close|
|setCloseBottomSheet|`(value: boolean) => void`|`true`|Function that set value of `closeBottomSheet`. If you use `useState`, you can pass set function of your state.|
|renderContent|`(disabled: boolean) => any`|`true`|Function that returns component to render in bottom sheet.|
|visibleHeight|`number`|`true`|Visible height from bottom of the window.|

## 🏗  Examples
```tsx
import BottomSheet from 'react-native-animated-bottom-sheet';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';

const App = () => {
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
    const renderBottomSheetContent = () => (
        <View 
            style={{
                flex: 1, 
                alignItems: 'center', 
                justifyContent: 'center'}}>
            <Text>Swipe Down To Close</Text>
        </View>
    )
    return (
        <View style={{flex: 1}}>
            <Text>Main</Text>
            <BottomSheet isVisible={isBottomSheetVisible} setIsVisible={setIsBottomSheetVisible} renderContent={renderBottomSheetContent} visibleHeight={Dimensions.get('window').height}/>
        </View>
    )
}

export default App
```
## ✏️  Todo
- [ ] change props
- [ ] add example image

## ⚖️  License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/postmelee/react-native-animated-bottom-sheet/blob/main/LICENSE) file for details

