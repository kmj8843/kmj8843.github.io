---
layout: post
title: "[자바 자료구조] ArrayList"
description: "자바 자료구조 ArrayList"
modified: 2021-02-11
tags: [Java ArrayList]
categories: [java]
---

ArrayList는 `java.util.List interface` 를 구현한 `java.util.ArrayList class` 입니다.

## 1. 함수

|   method   |   param                    |   return   |
|:-----------|:---------------------------|:-----------|
|trimToSize  |-                           |void        |
|----
|size        |-                           |int         |
|----
|isEmpty     |-                           |boolean     |
|----
|contains    |Object                      |boolean     |
|----
|indexOf     |Object                      |int         |
|----
|lastIndexOf |Object                      |int         |
|----
|clone       |-                           |Object      |
|----
|toArray     |-                           |Object[]    |
|            |T[]                         |\<T\> T[]   |
|----
|get         |int                         |E           |
|----
|set         |int, E                      |E           |
|----
|add         |E                           |boolean     |
|            |int, E                      |void        |
|----
|remove      |int                         |E           |
|            |Object                      |boolean     |
|----
|clear       |-                           |void        |
|----
|addAll      |Collection<? extends E>     |boolean     |
|            |int, Collection<? extends E>|boolean     |
|----
|removeAll   |Collection<?>               |boolean     |
|----
|retainAll   |Collection<?>               |boolean     |
|----
|removeIf    |Predicate<? super E>        |boolean     |
|----
|replaceAll  |UnaryOperator\<E\>          |void        |
|----
|sort        |Comparator<? super E>       |void        |
{: rules="groups"}

<br/>

## 2-1. size
1. Params: -
2. Result: `int`
3. Desc: ArrayList의 요소 개수를 반환

Ex)
{% highlight java %}
List<String> list = new ArrayList<String>();

list.add("naver");
System.out.println("list size : " + list.size()); // 1

list.add("google");
System.out.println("list size : " + list.size()); // 2

list.add("kakao");
System.out.println("list size : " + list.size()); // 3
{% endhighlight %}
{% highlight java %}
list size : 1
list size : 2
list size : 3
{% endhighlight %}

<br/>

## 2-2. isEmpty
1. Params: -
2. Result: boolean
3. Desc: 요소가 없으면 true를 반환

Ex)
{% highlight java %}
List<String> list = new ArrayList<String>();

System.out.println("값 삽입 전: " + list.isEmpty()); // true

list.add("naver");
list.add("google");
list.add("kakao");

System.out.println("값 삽입 후: " + list.isEmpty()); // false
{% endhighlight %}
{% highlight java %}
값 삽입 전: true
값 삽입 후: false
{% endhighlight %}

<br/>

## 2-3. contains
1. Params: Object
2. Result: int
3. Desc: Param 요소가 있으면 true를 반환

Ex)
{% highlight java %}
List<String> list = new ArrayList<String>();

list.add("naver");
list.add("google");
list.add("kakao");

System.out.println("네이버 포함 여부 : " + list.contains("naver"));
System.out.println("다음 포함 여부 : " + list.contains("daum"));
{% endhighlight %}
{% highlight java %}
네이버 포함 여부 : true
다음 포함 여부 : false
{% endhighlight %}

<br/>

## 2-4. indexOf
1. Params: Object
2. Result: boolean
3. Desc: Param 요소의 첫 번째 List의 Index를 반환, 없으면 -1을 반환

Ex)
{% highlight java %}
List<String> list = new ArrayList<String>();
		
list.add("naver");
list.add("google");
list.add("kakao");
list.add("google");

System.out.println("naver indexOf: " + list.indexOf("naver"));
System.out.println("google indexOf: " + list.indexOf("google"));
System.out.println("kakao indexOf: " + list.indexOf("kakao"));
System.out.println("daum indexOf: " + list.indexOf("daum"));
{% endhighlight %}
{% highlight java %}
naver indexOf: 0
google indexOf: 1
kakao indexOf: 2
daum indexOf: -1
{% endhighlight %}
> 처음부터 탐색해서 찾은 값의 index를 반환
> contains 메소드는 indexOf가 -1 보다 크면 true, 아니면 false로 구현되어 있다.

<br/>

## 2-4. lastIndexOf
1. Params: Object
2. Result: boolean
3. Desc: Param 요소의 마지막 List의 Index를 반환, 없으면 -1을 반환

Ex)
{% highlight java %}
List<String> list = new ArrayList<String>();

list.add("naver");
list.add("google");
list.add("kakao");
list.add("google");

System.out.println("naver lastIndexOf: " + list.lastIndexOf("naver"));
System.out.println("google lastIndexOf: " + list.lastIndexOf("google"));
System.out.println("kakao lastIndexOf: " + list.lastIndexOf("kakao"));
System.out.println("daum lastIndexOf: " + list.lastIndexOf("daum"));
{% endhighlight %}
{% highlight java %}
naver lastIndexOf: 0
google lastIndexOf: 3
kakao lastIndexOf: 2
daum lastIndexOf: -1
{% endhighlight %}
> 마지막부터 탐색해서 찾은 값의 index를 반환

<br/>

## 2-5. clone
1. Params: -
2. Result: Object
3. Desc: List를 복제한 인스턴스를 반환

Ex)
{% highlight java %}
ArrayList<String> list = new ArrayList<String>();

list.add("naver");
list.add("google");
list.add("kakao");

ArrayList<String> list2 = (ArrayList<String>) list.clone();

list.add("daum");

System.out.println("리스트1: " + list.toString());
System.out.println("리스트2: " + list2.toString());
{% endhighlight %}
{% highlight java %}
리스트1: [naver, google, kakao, daum]
리스트2: [naver, google, kakao]
{% endhighlight %}

<br/>

## 2-6. toArray
1. Params: -
2. Result: Object[]
3. Desc: List의 첫 번째부터 마지막 요소를 배열로 반환

Ex)
{% highlight java %}
ArrayList<String> list = new ArrayList<String>();

list.add("naver");
list.add("google");
list.add("kakao");

Object[] obj = list.toArray();

System.out.println("list: " + list.toString());

System.out.print("obj: ");
for (Object item : obj)
    System.out.print(item + " ");
{% endhighlight %}
{% highlight java %}
list: [naver, google, kakao]
obj: naver google kakao 
{% endhighlight %}


1. Params: \<T\> T[]
2. Result: T[]
3. Desc: List의 첫 번째부터 마지막 요소를 배열로 반환(Generic 타입)

Ex)
{% highlight java %}
ArrayList<String> list = new ArrayList<String>();

list.add("naver");
list.add("google");
list.add("kakao");

String[] arr = new String[list.size()];
list.toArray(arr);

System.out.println("list: " + list.toString());
System.out.print("arr: ");
for (String item : arr)
    System.out.print(item + " ");
{% endhighlight %}
{% highlight java %}
list: [naver, google, kakao]
arr: naver google kakao 
{% endhighlight %}

<br/>

## 2-7. get
1. Params: int
2. Result: E
3. Desc: List의 index 번째 요소의 값을 반환

Ex)
{% highlight java %}
ArrayList<String> list = new ArrayList<String>();

list.add("naver");
list.add("google");
list.add("kakao");

System.out.println("0번째 Index: " + list.get(0));
System.out.println("1번째 Index: " + list.get(1));
System.out.println("2번째 Index: " + list.get(2));
{% endhighlight %}
{% highlight java %}
0번째 Index: naver
1번째 Index: google
2번째 Index: kakao
{% endhighlight %}

<br/>

## 2-8. set
1. Params: int, E
2. Result: E
3. Desc: List의 index 번째 요소를 반환하고 해당 요소의 값을 E로 치환

Ex)
{% highlight java %}
ArrayList<String> list = new ArrayList<String>();

list.add("naver");
list.add("google");
list.add("kakao");

System.out.println("list 수정 전: " + list.toString());

list.set(0, "daum");

System.out.println("list 수정 후: " + list.toString());
{% endhighlight %}
{% highlight java %}
list 수정 전: [naver, google, kakao]
list 수정 후: [daum, google, kakao]
{% endhighlight %}

<br/>

## 2-9. add
1. Params: E
2. Result: boolean
3. Desc: List의 마지막에 E 값을 삽입하고 true를 반환

Ex)
{% highlight java %}
ArrayList<String> list = new ArrayList<String>();

boolean b1 = list.add("naver");
boolean b2 = list.add("google");
boolean b3 = list.add("kakao");

System.out.println(list.toString());
System.out.println("b1: " + b1);
System.out.println("b2: " + b2);
System.out.println("b3: " + b3);
{% endhighlight %}
{% highlight java %}
[naver, google, kakao]
b1: true
b2: true
b3: true
{% endhighlight %}

1. Params: int, E
2. Result: void
3. Desc: List의 index 번째 요소에 E 값을 삽입

Ex)
{% highlight java %}
ArrayList<String> list = new ArrayList<String>();

list.add("naver");
list.add("google");
list.add("kakao");

System.out.println(list.toString());

list.add(1, "daum");

System.out.println(list.toString());
{% endhighlight %}
{% highlight java %}
[naver, google, kakao]
[naver, daum, google, kakao]
{% endhighlight %}

<br/>

## 2-10. remove
1. Params: int
2. Result: E
3. Desc: List의 index 번째 요소를 반환하고 해당 요소를 삭제

Ex)
{% highlight java %}
ArrayList<String> list = new ArrayList<String>();

list.add("naver");
list.add("google");
list.add("kakao");

System.out.println(list.toString());

String s = list.remove(1);

System.out.println(s + "값 삭제 후 리스트: " + list.toString());
{% endhighlight %}
{% highlight java %}
[naver, google, kakao]
google값 삭제 후 리스트: [naver, kakao]
{% endhighlight %}

1. Params: Object
2. Result: boolean
3. Desc: List의 첫 번째 Object 값을 삭제하고, 값이 있으면 true 없으면 false를 반환

Ex)
{% highlight java %}
ArrayList<String> list = new ArrayList<String>();

list.add("google");
list.add("naver");
list.add("google");
list.add("kakao");
list.add("google");

System.out.println(list.toString());

boolean b = list.remove("google");

if (b)
    System.out.println("google 삭제 성공");
else
    System.out.println("google 삭제 실패");

System.out.println(list.toString());

boolean bo = list.remove("daum");

if (bo)
    System.out.println("daum 삭제 성공");
else
    System.out.println("daum 삭제 실패");

System.out.println(list.toString());
{% endhighlight %}
{% highlight java %}
[google, naver, google, kakao, google]
google 삭제 성공
[naver, google, kakao, google]
daum 삭제 실패
[naver, google, kakao, google]
{% endhighlight %}

<br/>

## 2-11. clear
1. Params: -
2. Result: void
3. Desc: List의 모든 값 삭제

Ex)
{% highlight java %}
ArrayList<String> list = new ArrayList<String>();

list.add("naver");
list.add("kakao");
list.add("google");

System.out.println("clear 이전: " + list.toString());

list.clear();

System.out.println("clear 이후: " + list.toString());
{% endhighlight %}
{% highlight java %}
clear 이전: [naver, kakao, google]
clear 이후: []
{% endhighlight %}

<br/>

## 2-12. addAll
1. Params: Collection<? extends E>
2. Result: boolean
3. Desc: Collection 요소의 모든 요소의 값을 ArrayList의 마지막 요소에 추가

Ex)
{% highlight java %}
ArrayList<String> sites = new ArrayList<String>();

sites.add("naver");
sites.add("kakao");
sites.add("google");

ArrayList<String> fruits = new ArrayList<>(Arrays.asList("apple", "orange"));

System.out.println("sites: " + sites.toString());
System.out.println("fruits: " + fruits.toString());

fruits.addAll(sites);
System.out.println("fruits addAll: " + fruits.toString());
{% endhighlight %}
{% highlight java %}
sites: [naver, kakao, google]
fruits: [apple, orange]
fruits addAll: [apple, orange, naver, kakao, google]
{% endhighlight %}

1. Params: int, Collection<? extends E>
2. Result: boolean
3. Desc: Collection 요소의 모든 요소의 값을 ArrayList의 Index 번째에 추가

Ex)
{% highlight java %}
ArrayList<String> sites = new ArrayList<String>();

sites.add("naver");
sites.add("kakao");
sites.add("google");

ArrayList<String> fruits = new ArrayList<>(Arrays.asList("apple", "orange"));

System.out.println("sites: " + sites.toString());
System.out.println("fruits: " + fruits.toString());

fruits.addAll(1, sites);
System.out.println("fruits addAll: " + fruits.toString());
{% endhighlight %}
{% highlight java %}
sites: [naver, kakao, google]
fruits: [apple, orange]
fruits addAll: [apple, naver, kakao, google, orange]
{% endhighlight %}

<br/>

## 2-13. removeAll
1. Params: Collection<?>
2. Result: boolean
3. Desc: Collection 요소에 존재하는 ArrayList 요소를 삭제, 삭제한 값이 있으면 true 없으면 false를 반환

Ex)
{% highlight java %}
ArrayList<String> sites = new ArrayList<String>();

sites.add("naver");
sites.add("kakao");
sites.add("google");
sites.add("daum");

ArrayList<String> del = new ArrayList<>(Arrays.asList("naver", "google"));

System.out.println("sites: " + sites.toString());

sites.removeAll(del);
System.out.println("sites 삭제 후: " + sites.toString());
{% endhighlight %}
{% highlight java %}
sites: [naver, kakao, google, daum]
sites 삭제 후: [kakao, daum]
{% endhighlight %}

<br/>

## 2-14. retainAll
1. Params: Collection<?>
2. Result: boolean
3. Desc: Collection 요소와 ArrayList에 공통적으로 존재하는 요소만 저장

Ex)
{% highlight java %}
ArrayList<String> sites = new ArrayList<String>();

sites.add("naver");
sites.add("kakao");
sites.add("google");
sites.add("daum");

ArrayList<String> sites2 = new ArrayList<>(Arrays.asList("naver", "google"));

sites.retainAll(sites2);
System.out.println("sites: " + sites.toString());
{% endhighlight %}
sites: [naver, google]
{% highlight java %}

{% endhighlight %}

<br/>

## 2-15. removeIf
1. Params: Predicate<? super E>
2. Result: boolean
3. Desc: Predicate 인자로 전달된 요소 삭제

Ex)
{% highlight java %}
ArrayList<String> sites = new ArrayList<String>();

sites.add("naver");
sites.add("kakao");
sites.add("google");
sites.add("daum");

System.out.println("remove 전: " + sites.toString());
sites.removeIf(e -> e == "naver");
System.out.println("remove 후1: " + sites.toString());
sites.removeIf(s -> s.startsWith("go")); // go로 시작하는 단어 제거
System.out.println("remove 후2: " + sites.toString());
sites.removeIf(s -> s.contains("a")); // a를 포함하는 단어 제거
System.out.println("remove 후3: " + sites.toString());
{% endhighlight %}
{% highlight java %}
remove 전: [naver, kakao, google, daum]
remove 후1: [kakao, google, daum]
remove 후2: [kakao, daum]
remove 후3: []
{% endhighlight %}

<br/>

## 2-16. replaceAll
1. Params: UnaryOperator<E>
2. Result: void
3. Desc: UnaryOperator 인자로 전달된 요소 변경

Ex)
{% highlight java %}
ArrayList<String> sites = new ArrayList<String>();

sites.add("naver");
sites.add("kakao");
sites.add("google");
sites.add("daum");

System.out.println("list 수정 전: " + sites.toString());
sites.replaceAll(e -> e.toUpperCase());
System.out.println("list 수정 후: " + sites.toString());
{% endhighlight %}
{% highlight java %}
list 수정 전: [naver, kakao, google, daum]
list 수정 후: [NAVER, KAKAO, GOOGLE, DAUM]
{% endhighlight %}

<br/>

## 2-17. sort
1. Params: Comparator<? super E>
2. Result: void
3. Desc: Comparator 인자에 맞도록 정렬

Ex)
{% highlight java %}
ArrayList<String> sites = new ArrayList<String>();

sites.add("naver");
sites.add("kakao");
sites.add("google");
sites.add("daum");

sites.sort(null); // 오름차순 정렬
//sites.sort((s1, s2) -> s1.compareTo(s2)); //동일한 오름차순 정렬
System.out.println(sites.toString());

sites.sort((s1, s2) -> s2.compareTo(s1)); // 내림차순 정렬 
System.out.println(sites.toString());
{% endhighlight %}
{% highlight java %}
[daum, google, kakao, naver]
[naver, kakao, google, daum]
{% endhighlight %}

## 3. 마치며
> 참고 : `https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html`