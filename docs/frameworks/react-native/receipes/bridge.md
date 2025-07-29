# React Native 와 Kotlin 간의 통신 - 작성중

React Native와 Kotlin 간의 통신은 주로 Native Module을 통해 이루어집니다. Native Module은 JavaScript와 네이티브(Android) 코드 간의 브리지 역할을 합니다. 이 문서에서는 React Native에서 Kotlin으로 데이터를 전달하고, Kotlin에서 React Native로 데이터를 전달하는 방법에 대해 설명합니다.

## 구성 요소

React Native와 Kotlin 간의 통신을 위해 다음과 같은 구성 요소가 필요합니다:

- **Native Module**: React Native와 Kotlin 간의 통신을 담당하는 모듈입니다. 이 모듈은 React Native에서 호출할 수 있는 `메서드`와 `모듈 명`을 정의합니다.
- **Broadcast**: Native Module에서 브로드캐스트를 발생시키는 역할을 합니다. 브로드캐스트는 앱 내에서 데이터를 전달하는 데 사용됩니다.
- **Receiver**: 브로드캐스트를 수신하는 역할을 합니다. 이 컴포넌트는 브로드캐스트가 발생했을 때 데이터를 처리합니다.
- **Service**: 백그라운드 작업을 수행하는 컴포넌트입니다. 서비스는 앱이 실행 중이지 않더라도 계속 실행될 수 있습니다.
- **Package**: Native Module을 등록하는 역할을 합니다. 이 패키지는 React Native가 Native Module을 인식할 수 있도록 합니다.
- **MainApplication**: Package를 등록하는 역할을 합니다. 이 클래스는 React Native 애플리케이션의 진입점으로, Native Module을 초기화하고 등록합니다

> Native Module 은 Package 에 등록되고, Package 는 MainApplication 에 등록됩니다. Native Module 필요에 따라 BroadcastReceiver, Service 등을 사용할 수 있습니다.

## 구현하기

### 1. Native Module 생성

Native Module을 생성하여 React Native와 Kotlin 간의 통신을 설정합니다. 이 모들은 React Native에서 호출할 수 있는 메서드를 정의합니다.

```kotlin title="MyModule.kt"
package com.example.mymodule

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

class MyModule(
    reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "MyModule" // (1)
    }

    @ReactMethod
    fun startReceiver(/* (2) */
        data: ReadableMap,
        promise: Promise,
    ) {
        // JSON 데이터를 처리하는 예제 코드입니다.
        val name = data.getString("name")
        Log.d("MyModule", "name: $name")

        val intent = Intent(reactApplicationContext, MyReceiver::class.java)
        reactApplicationContext.sendBroadcast(intent)

        // Promise 를 반환하여 JavaScript로 결과를 전달합니다.
        promise.resolve("Broadcast sent successfully")
    }
}
```

1. 모듈의 이름을 반환합니다. 이 이름은 JavaScript에서 호출할 때 사용됩니다.
2. 원하는 타입을 지정할 수 있습니다. <br>기본적인 `String`, `Int`, `Boolean` 뿐만 아니라 `com.facebook.react.bridge.Promise`, `com.facebook.react.bridge.ReadableMap`, `com.facebook.react.bridge.ReadableArray` 등 다양한 타입을 지원합니다. 이 메서드는 JavaScript에서 호출할 수 있습니다.

### 2. BroadcastReceiver 생성

BroadcastReceiver를 생성하여 브로드캐스트를 수신하고, 필요한 작업을 수행합니다

```kotlin title="MyReceiver.kt"
package com.example.mymodule

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class MyReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Log.d("MyReceiver", "Broadcast received")
        // 필요한 작업 수행
        // 예: 서비스 시작
        val serviceIntent = Intent(reactContext, MyService::class.java)
        reactContext.startService(serviceIntent)
    }
}
```

## flow

보통 JS -> NativeModule -> Broadcast -> Receiver -> Service -> NativeModule -> JS 순으로 흐릅니다.

## Module

```kotlin title="MyModule.kt"
class MyModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "MyModule" // 모듈의 이름을 반환합니다. 이 이름은 JavaScript에서 호출할 때 사용됩니다.
    }

    @ReactMethod
    fun startReceiver() {
        val intent = Intent(reactApplicationContext, MyReceiver::class.java)
        reactApplicationContext.sendBroadcast(intent)
    }
}
```

## Service

```kotlin
class MyService : Service() {
    override fun onCreate() {
      // 서비스가 생성될 때 호출됩니다.
        super.onCreate()
    }
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 서비스가 시작될 때 호출됩니다.
        return START_STICKY // 서비스가 종료되면 시스템이 서비스를 다시 시작합니다.
    }
    override fun onBind(intent: Intent?): IBinder? {
        // 서비스가 바인딩될 때 호출됩니다.
        return null // 바인딩을 지원하지 않으므로 null을 반환합니다.
    }
    override fun onDestroy() {
      // 서비스가 종료될 때 호출됩니다.
        super.onDestroy()
    }
```

> 실행 순서는 `onCreate` -> `onStartCommand` -> `onDestroy`입니다. `onBind`는 서비스가 바인딩될 때 호출되며, 바인딩을 지원하지 않는 경우 `null`을 반환합니다.
> 서비스 바인딩은 일반적으로 `Activity`나 다른 컴포넌트에서 `bindService` 메서드를 호출하여 이루어집니다. 바인딩된 서비스는 클라이언트가 서비스와 상호작용할 수 있도록 합니다. 예를 들어, `Activity`에서 서비스를 바인딩하려면 다음과 같이 할 수 있습니다:

```kotlin
val serviceIntent = Intent(this, MyService::class.java)
bindService(serviceIntent, serviceConnection, Context.BIND_AUTO_CREATE)
```

`Service`는 백그라운드에서 실행되는 컴포넌트로, 사용자 인터페이스와 상호작용하지 않습니다. 서비스는 앱이 실행 중이 아니더라도 계속 실행될 수 있습니다.`

onStartCommand

- START_STICKY: 서비스가 종료되면 시스템이 서비스를 다시 시작하고, 이전에 전달된 Intent를 무시합니다.
- START_NOT_STICKY: 서비스가 종료되면 시스템이 서비스를 다시 시작하지 않습니다
- START_REDELIVER_INTENT: 서비스가 종료되면 시스템이 서비스를 다시 시작하고, 이전에 전달된 Intent를 다시 전달합니다.
- START_FOREGROUND: 서비스가 포그라운드 서비스로 실행되며, 알림을 표시합니다.
