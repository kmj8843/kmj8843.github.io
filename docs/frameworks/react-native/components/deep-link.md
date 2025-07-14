# Deep Link

```bash
npx uri-scheme open $(jq -r .expo.scheme app.json)://activity --android
npx uri-scheme open exp://127.0.0.1:8081/--/activity --android
```

[react native 참고 링크](https://reactnative.dev/docs/next/linking#open-links-and-deep-links-universal-links)  
[expo 참고 링크](https://docs.expo.dev/linking/overview/)
