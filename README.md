# react-native-animated-bottom-sheet
![npm-version](https://img.shields.io/npm/v/react-native-animated-bottom-sheet)
![Download-status](https://img.shields.io/npm/dm/react-native-animated-bottom-sheet)

**Swipeable**, **Animated**, **Compact** - Bottom sheet for react native project.

<img src="https://github.com/postmelee/react-native-animated-bottom-sheet/blob/main/gif/gif1.gif?raw=true" width="180" height="320" />

## ⚡️ Features
- **Swipeable:** swipe down or up to handle component.
- **Animated:** Moving component, Changing backdrop opacity with Smooth Animation
- **Compact:** Two props, Two methods, ready to use.
- **Backdrop:** Touch Backdrop to close the botton sheet.
- **Customize:** Customize events with `onSwipe` parameter that indicates swiping event.
## 🛠 Installation
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

## 🏗  Examples
```tsx
import BottomSheet from 'react-native-animated-bottom-sheet';
import React, {useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TouchableOpacity } from 'react-native';

const App = () => {
    const bottomSheetRef: any = useRef();
    const renderBottomSheetContent = (onSwipe: boolean) => (
        <View 
            style={{
                flex: 1, 
                alignItems: 'center', 
                justifyContent: 'center'}}>
            <Text>{onSwipe ? 'swiping' : 'not swiping'}</Text>
        </View>
    )
    return (
        <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => bottomSheetRef.current.open()}>
            <Text>Open!</Text>
        </TouchableOpacity>
            <BottomSheet 
            ref={bottomSheetRef}
            renderContent={renderBottomSheetContent}
            visibleHeight={Dimensions.get('window').height/2}/>
        </View>
    )
}

export default App
```

## 🧬 Props
|Name|Type|Require|Description|
|---|---|---|---|
|renderContent|`(onSwipe: boolean) => any`|`true`|Function that returns child component to render. you can use `onSwipe` value to handle swipe event.|
|visibleHeight|`number`|`true`|Value that defines height to show from end of the window.|

## 🪡 Methods
### `show(value?: number)`
 Shows the bottom sheet to `value` with Animation. 
 - **`value:`** The value that the bottom sheet will move to(px from the bottom of the window)
> **Note:** Calling `show()` without any parameter will show the bottom sheet to `visibleHeight`

### `close()`
Closes the bottom sheet to bottom with Animation.

## ✏️  Todo
- [ ] Add callback to `close`

## ⚖️ License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/postmelee/react-native-animated-bottom-sheet/blob/main/LICENSE) file for details

