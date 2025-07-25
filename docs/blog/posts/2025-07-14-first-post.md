---
title: "📢 블로그 첫 글 - MkDocs 시작하기"
date: 2025-07-14
categories:
  - Blog
tags:
  - mkdocs
  - material
  - 시작하기
summary: MkDocs Material 테마를 기반으로 블로그를 구성하는 첫 단계를 안내합니다.
---

# 블로그 시작을 환영합니다 🎉

이 블로그는 `MkDocs`와 `Material for MkDocs` 테마를 사용해서 만들어졌습니다.

## ✨ 이 글에서 다루는 내용

- MkDocs 설치 방법
- Material 테마 적용
- 블로그 플러그인 설정

## 🚀 MkDocs 설치

```bash
pip install mkdocs mkdocs-material
```

---

## ✅ 설명

| YAML 필드    | 설명                                                      |
| ------------ | --------------------------------------------------------- |
| `title`      | 글 제목 (사이드바/목록에 표시됨)                          |
| `date`       | 포스트 날짜 (정렬 기준)                                   |
| `categories` | 분류용 카테고리. `categories_allowed:`에 명시된 값만 유효 |
| `tags`       | 태그 목록. `tags` 플러그인으로 필터링 가능                |
| `summary`    | 일부 테마/플러그인에서 미리보기 텍스트로 사용됨           |

> `---` 사이의 구역은 **YAML frontmatter**라고 하며, 블로그 메타데이터로 사용됩니다.

## 🚀 MkDocs 실행

```bash
mkdocs serve
```

---

## ✅ 폴더 구조 예시

```
docs/
└── blog/
├── index.md
├── 2025-07-14-my-first-post.md
└── 2025-07-15-another-post.md
```

파일명은 날짜-슬러그 형태(`YYYY-MM-DD-slug.md`)로 하면 대부분의 blog 플러그인에서 잘 정렬됩니다.

---

## ✅ 추가 팁

- 여러 카테고리/태그도 가능 (`tags:`에 2~3개 이상)
- 카테고리나 태그 링크는 자동으로 `tags/`, `categories/` 페이지에 생성됨
- 포스트 내부에서 이미지 넣고 싶다면 `docs/images/` 아래에 저장하고 상대 경로로 삽입 가능

```md
![예시 이미지](../images/sample.png)
```

---

## 기타 사용 방법

툴팁 예시
[Hover me](https://example.com "I'm a tooltip!")

[test]
[test]: ../index.md#asd

이미지 삽입 예시  
![Image title](https://dummyimage.com/600x400/eee/aaa)

---

### content tabs

=== "C"

    ``` c
    #include <stdio.h>

    int main(void) {
      printf("Hello world!\n");
      return 0;
    }
    ```

=== "C++"

    ``` c++
    #include <iostream>

    int main(void) {
      std::cout << "Hello world!" << std::endl;
      return 0;
    }
    ```

!!! example

    === "Unordered List"

        ``` markdown
        * Sed sagittis eleifend rutrum
        * Donec vitae suscipit est
        * Nulla tempor lobortis orci
        ```

    === "Ordered List"

        ``` markdown
        1. Sed sagittis eleifend rutrum
        2. Donec vitae suscipit est
        3. Nulla tempor lobortis orci
        ```

---

## 📝 코드 예시

```py title="bubble_sort.py" linenums="1" hl_lines="2 3"
def bubble_sort(items):
    for i in range(len(items)):
        for j in range(len(items) - 1 - i):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
```

```yaml
theme:
  features:
    - content.code.annotate # (1)
```

1.  :man_raising_hand: I'm a code annotation! I can contain `code`, **formatted
    text**, images, ... basically anything that can be written in Markdown.

---

## 📦 코드 샌드박스 예시

<iframe src="https://codesandbox.io/embed/new?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="React"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
