# Safe Area Context

실제 장치의 안전 영역을 감지하고, 해당 영역에 맞춰 UI를 조정하는 데 사용되는 컴포넌트입니다. 이 컴포넌트는 특히 iOS와 Android에서 화면의 노치, 홈 인디케이터, 상태 바 등을 고려하여 레이아웃을 조정할 수 있도록 도와줍니다.  

## 설치

expo 로 설치했다면 기본적으로 제공됩니다.

```bash
npx expo install react-native-safe-area-context
```


## API

```ts
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
```


[expo 참고 링크](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)
