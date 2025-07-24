# build config

`npx expo prebuild` bareworkflow 로 전환 후, `Unresolved reference: BuildConfig` 또는 `Unresolved reference: PackageList` 에러가 발생할 경우 아래와 같이 조치가 필요합니다.

```jproperties title="gradle.properties"
android.defaults.buildfeatures.buildconfig=true
```

!!! warning "deprecated"

    - `android.defaults.buildfeatures.buildconfig` 는 Android Gradle Plugin(AGP) 8.0 부터 deprecated 되었습니다.
    - AGP 8.0부터는 기본값이 false로 변경되어 더 이상 BuildConfig 파일이 자동 생성되지 않습니다.
    - 공식적으로 이 설정은 **AGP 9.0**에서 완전히 제거될 예정입니다.

```groovy title="build.gradle(Module :app)"
android {
    buildFeatures {
        buildConfig = true
    }
}
```
