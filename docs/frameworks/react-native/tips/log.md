# Mobile 에서 구동 중인 앱의 로그를 확인하는 방법

## Android

Android 에서 앱의 로그를 확인하려면 `adb logcat`[^1] 명령어를 사용합니다. 이 명령어는 Android 디바이스의 로그 메시지를 실시간으로 출력합니다.

다음과 같은 옵션을 추가하여 로그를 필터링할 수 있습니다:

### 특정 태그의 로그 확인

특정 태그의 로그를 확인하려면, 로그 메시지를 출력할 때 태그를 지정해야 합니다. 예를 들어, Kotlin에서 로그를 출력할 때 다음과 같이 태그를 지정합니다:

```kotlin
Log.d("TAG_NAME1", "로그 메시지")
Log.i("TAG_NAME2", "로그 메시지")
```

그 후, 해당 태그의 로그를 확인하려면 다음과 같이 명령어를 입력합니다:

```bash
adb logcat -s TAG_NAME1 TAG_NAME2 # (1)
```

1. 공백으로 구분하여 여러 태그를 지정할 수 있습니다. 이 명령어는 지정한 태그의 로그 메시지만 출력합니다.

### 로그 레벨 필터링

| 약어 | 이름    | 의미               | 운선순위 |
| ---- | ------- | ------------------ | -------- |
| V    | Verbose | 모든 로그 메시지   | 0        |
| D    | Debug   | 디버그 메시지      | 1        |
| I    | Info    | 정보 메시지        | 2        |
| W    | Warning | 경고 메시지        | 3        |
| E    | Error   | 오류 메시지        | 4        |
| F    | Fatal   | 심각한 오류 메시지 | 5        |
| S    | Silent  | 로그 출력 없음     | 6        |

Android 에는 위와 같은 로그 레벨이 있습니다. 로그 레벨을 지정하여 해당 레벨 이상의 로그 메시지만 출력할 수 있습니다.

`adb LOG_TAG:LEVEL` 형식으로 명령어를 입력합니다. 예를 들어, `TAG_NAME1` 태그의 Warning 이상의 로그 메시지를 출력하려면 다음과 같이 입력합니다:

```bash
adb TAG_NAME1:W TAG_NAME2:I *:S
```

<div class="result" markdown>
  - `TAG_NAME1` -> `TAG_NAME1` 태그의 Warning 이상의 로그만 출력
  - `TAG_NAME2` -> `TAG_NAME2` 태그의 Info 이상의 로그만 출력
  - `*:S` -> 그 외 모든 태그의 로그 메시지는 출력하지 않음
</div>

### 앱 패키지 이름으로 필터링

=== "PID 활용"
    ```bash
    adb logcat --pid=$(adb shell pidof com.yourapp.package)
    ```
=== "GREP 활용"
    ```bash
    adb logcat | grep "com.yourapp.package"
    ```

## IOS

추후 업데이트 예정

[^1]: [Android Developer](https://developer.android.com/tools/logcat?hl=ko)
