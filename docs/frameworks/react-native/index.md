# React Native

## 개발 환경

### React Native CLI

- react-native-cli 를 사용하여 앱을 개발하고 배포
- expo SDK 를 사용할 수 있지만, expo Go 앱을 통해 테스트할 수 없음
- 네이티브 모듈을 직접 추가하거나 수정할 수 있음
- expo SDK 를 사용하지 않고, react-native 라이브러리와 네이티브 모듈을 직접 사용
- expo 에 의존하지 않는 워크플로우
- expo Go 앱을 사용하지 않고, 직접 빌드하여 테스트

### Managed Workflow

- expo 에 의존하는 워크플로우
- expo-cli 를 사용하여 앱을 개발하고 배포
- expo SDK 를 사용하여 다양한 기능을 쉽게 구현
- expo Go 앱을 통해 개발 중인 앱을 테스트할 수 있음

### Bare Workflow

- expo 에 의존하지 않는 워크플로우
- react-native-cli 를 사용하여 앱을 개발하고 배포
- expo SDK 를 사용할 수 있지만, expo Go 앱을 통해 테스트할 수 없음
- 네이티브 모듈을 직접 추가하거나 수정할 수 있음
- expo SDK 를 사용하지 않고, react-native 라이브러리와 네이티브 모듈을 직접 사용

### Expo Go

- expo 를 사용하여 개발한 앱을 테스트할 수 있는 앱
- expo 공식 SDK 가 포함되어 있어, expo SDK 를 사용하여 개발한 앱을 쉽게 테스트할 수 있음
- 네이티브 모듈이 추가된 앱은 테스트할 수 없음

## components

[deep-link](./components/deep-link.md)

## troubleshooting

[build-config](./troubleshooting/buildconfig.md)

### dark mode

emulator 다크모드 활성화

```bash
adb shell "cmd uimode night yes"
```

> app.json 의 .expo.userInterfaceStyle 을 `dark` 또는 `light` 로 설정 가능 (기본: `automatic`)

```js
import { useColorScheme, Appearance } from "react-native";

const scheme = useColorScheme(); // 'dark' | 'light' | undefined
// or
Appearance.setColorScheme("dark"); // 'dark' | 'light' (iOS 13+)
Appearance.getColorScheme(); // 'dark' | 'light' | undefined
Appearance.addChangeListener(({ colorScheme }) => {
  // colorScheme: 'dark' | 'light'
});
Appearance.removeChangeListener(listener);
```

### share

```js
import { Share } from "react-native";

const handleShare = async () => {
  try {
    const result = await Share.share({
      message: "Hello, world!",
      url: "${.expo.scheme}://example.com", // for ios
      title: "Share this", // for android
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    console.error(error);
  }
};
```

### file share

```bash
npx expo install expo-sharing
```

```js
import * as Sharing from "expo-sharing";
```

[expo 참고 링크](https://docs.expo.dev/versions/latest/sdk/sharing/)

expo 에서 다른 앱으로의 공유는 지원하지만 다른 앱에서 expo 로 공유는 불가능  
필요하다면 [third-party 라이브러리](#expo-share-extension) 사용 필요

### expo share extension

[git 링크](https://github.com/MaxAst/expo-share-extension)

해당 라이브러리를 사용하면 expo go 사용이 불가능해짐

### status bar

```js
import { StatusBar } from "expo-status-bar";
```

expo 를 사용중이라면 `expo-status-bar` 를 사용하는게 좋음  
기본적인 기능들이 android, ios 각각 맞게 구현되어 있음

### splash screen

> 앱 로딩 시 보여지는 화면

```js
import { SplashScreen } from "expo-splash-screen";
SplashScreen.preventAutoHideAsync(); // 앱 로딩 시 splash screen 숨김 방지
SplashScreen.hideAsync(); // 앱 로딩 완료 후 splash screen 숨김
SplashScreen.showAsync(); // splash screen 강제로 보여줌
SplashScreen.getVisibilityAsync(); // splash screen이 보이는지 여부
```

```js
import * as SplashScreen from "expo-splash-screen";

// 앱 로딩 시 splash screen 숨김 방지
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.warn("Error preventing splash screen auto-hide:", error);
});

// 앱 로딩 완료 후 splash screen 숨김
await SplashScreen.hideAsync();
```

### asset

```bash
npx expo install expo-asset

## app.json

# "plugins": [
#   "expo-asset"
# ],
```

```js
import { Asset } from "expo-asset";

Asset.fromUri("https://example.com/image.png")
  .downloadAsync()
  .then(() => {
    // 이미지 다운로드 완료 후 실행
  });

await Asset.loadAsync(require("./assets/image.png"));
```

[expo 참고 링크](https://docs.expo.dev/versions/latest/sdk/asset/)

### constants

```bash
npx expo install expo-constants
```

```js
import Constants from "expo-constants";
```

[expo 참고 링크](https://docs.expo.dev/versions/latest/sdk/constants/)

### 인앱 브라우저

```bash
# 보통 내장되어 있음
npx expo install expo-web-browser
```

```js
import * as WebBrowser from "expo-web-browser";
WebBrowser.openBrowserAsync("https://example.com", {
  toolbarColor: "#6200ee",
  controlsColor: "#ffffff",
  showTitle: true,
  enableBarCollapsing: true,
});
```

[expo 참고 링크](https://docs.expo.dev/versions/latest/sdk/webbrowser/)

## webview

```bash
npx expo install react-native-webview
```

```js
import { WebView } from "react-native-webview";
<WebView
  source={{ uri: "https://example.com" }}
  style={{ flex: 1 }}
  onLoadStart={() => console.log("Loading started")}
  onLoadEnd={() => console.log("Loading finished")}
  onError={(error) => console.error("WebView error:", error.nativeEvent)}
  onHttpError={(error) => console.error("HTTP error:", error.nativeEvent)}
  onMessage={(event) => {
    const data = event.nativeEvent.data;
    console.log("Message from WebView:", data);
  }}
/>;
```

[expo 참고 링크](https://docs.expo.dev/versions/latest/sdk/webview/)
[git 참고 링크](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md)

### FlatList

- 많은 양의 데이터 리스트를 효율적으로 렌더링하기 위해 사용
- 스크롤 시 화면에 보이는 아이템만 렌더링하여 성능 최적화

```js
import { FlatList } from "react-native";

<FlatList
  data={data} // 데이터 배열
  renderItem={({ item }) => <ItemComponent item={item} />} // 각 아이템을 렌더링하는 함수
  keyExtractor={(item) => item.id.toString()} // 각 아이템의 고유 키를 반환하는 함수
  onEndReached={loadMoreData} // 스크롤이 끝에 도달했을 때 호출되는 함수
  onEndReachedThreshold={0.5} // onEndReached 호출 임계값 (0~1 사이)
  ListHeaderComponent={<HeaderComponent />} // 리스트 상단에 렌더링할 컴포넌트
  ListFooterComponent={<FooterComponent />} // 리스트 하단에 렌더링할 컴포넌트
/>;
```

[react native 참고 링크](https://reactnative.dev/docs/next/flatlist)
다른 최적화된 third-party 사용하려면 [git 참고 링크](#flash-list) 확인

### ScrollView

- 모든 아이템을 한 번에 렌더링하여 스크롤 가능하게 만듦
- 작은 양의 데이터나 복잡한 레이아웃에 적합
- 메모리 사용량 높음

```js
import { ScrollView } from "react-native";
<ScrollView
  contentContainerStyle={{ padding: 16 }} // 내부 컨텐츠 스타일
  horizontal={false} // 수평 스크롤 여부
  showsVerticalScrollIndicator={true} // 수직 스크롤바 표시 여부
  showsHorizontalScrollIndicator={false} // 수평 스크롤바 표시 여부
  onScroll={(event) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    console.log("Scroll position:", contentOffset.y);
  }} // 스크롤 이벤트 핸들러
/>;
```

[react native 참고 링크](https://reactnative.dev/docs/next/scrollview)

### Flash List

- v2 가 출시되었지만 expo 에서는 아직 v1 만 지원함(sdk 53 기준)
- [FlatList](#flatlist) 의 성능을 개선한 컴포넌트

```bash
# yarn add @shopify/flash-list@rc
npx expo install @shopify/flash-list
```

```js
import { FlashList } from "@shopify/flash-list";
<FlashList
  data={data} // 데이터 배열
  renderItem={({ item }) => <ItemComponent item={item} />} // 각 아이템을 렌더링하는 함수
  estimatedItemSize={100} // 아이템의 예상 크기 (성능 최적화), 값을 작성하지 않으면 warning 에 예상 임계치 표시됨
  onEndReached={loadMoreData} // 스크롤이 끝에 도달했을 때 호출되는 함수
  onEndReachedThreshold={0.5} // onEndReached 호출 임계값 (0~1 사이)
  refreshing={isRefreshing} // 새로고침 상태
  onRefresh={handleRefresh} // 새로고침 핸들러
/>;
```

[git 참고 링크](https://github.com/Shopify/flash-list)

### 진동(haptics)

```bash
npx expo install expo-haptics
```

```js
import * as Haptics from "expo-haptics";

Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // 성공 알림
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // 오류 알림
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); // 경고 알림
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // 가벼운 충격
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // 중간 충격
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // 강한 충격
Haptics.selectionAsync(); // 선택 알림
```

[expo 참고 링크](https://docs.expo.dev/versions/latest/sdk/haptics/)

### toast

```bash
npm i react-native-toast-message
```

```js
import Toast from "react-native-toast-message";

<Toast config={toastConfig} />;

Toast.show({
  type: "success", // "success", "error", "info"
  text1: "Hello",
  text2: "This is a toast message",
  position: "top", // "top", "bottom", "center"
  visibilityTime: 4000, // ms
});
```

[git 참고 링크](https://github.com/calintamas/react-native-toast-message)

### push notification

```bash
npx expo install expo-notifications
```

```js
import * as Notifications from "expo-notifications";

// 알림 권한 요청
const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    // Notifications.requestPermissionsAsync();
    alert("알림 권한이 필요합니다.");
  }
};

// 알림 토큰 가져오기
const getNotificationToken = async () => {
  const token = await Notifications.getExpoPushTokenAsync();
  console.log("알림 토큰:", token.data);
};

// 알림 수신 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 알림 수신 이벤트 리스너
Notifications.addNotificationReceivedListener((notification) => {
  console.log("알림 수신:", notification);
});

// 알림 클릭 이벤트 리스너
Notifications.addNotificationResponseReceivedListener((response) => {
  console.log("알림 클릭:", response.notification);
});

// 알림 보내기
const sendNotification = async (token) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "알림 제목",
      body: "알림 내용",
      data: { extraData: "추가 데이터" },
    },
    trigger: { seconds: 1 }, // 1초 후에 알림
  });
};

// 앱이 백그라운드나 종료 상태일 때 알림 클릭 시 동작
Notifications.setNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;
  console.log("알림 클릭 시 데이터:", data);
});

// 앱이 포그라운드 상태일 때 알림 클릭 시 동작
Notifications.setNotificationReceivedListener((notification) => {
  const data = notification.request.content.data;
  console.log("알림 수신 시 데이터:", data);
});
```

[expo 참고 링크](https://docs.expo.dev/versions/latest/sdk/notifications/)
[expo 테스트 링크](https://expo.dev/notifications)

## 공통

### require type

```js
require("..."); // 이거의 type 은 number 임
```

```js
<MyComponent image={require("...")} />

function MyComponent({ children, image }:
  { children: React.ReactNode; image: number }) {
  return <Image source={image}>{children}</Image>;
}
```
