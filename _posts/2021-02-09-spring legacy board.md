---
layout: post
title: "[Spring] 게시판 만들기"
description: "Spring legacy를 활용한 게시판 만들기"
modified: 2021-02-09
tags: [Spring, Spring legacy, Spring board]
categories: [Spring]
---
# 서론
Spring Legacy를 활용하여 게시판을 만들어 보자

## 기술 스택

|   종류    |   스택                 |
|:--------- |:-----------------------|
| Java      | Oracle Java 1.8        |
| DB        | MySql 5.7.31           |
| WAS       | Tomcat 9.0             |
| Framework | Spring Framework 3.1.1 |
| Mapper    | Mybatis 3.5.6          |

# 시작
먼저 스프링 프로젝트를 생성하면 아래와 같은 패키지 구성을 가질 것이다.

{% highlight xml %}
┌─ src
│   └─ main
│        ├─ java
│        │   └─ com
│        │       └─ rlalsa8843
│        │           └─ board
│        │               └─ HomeController.java
│        ├─ webapp
│        │   ├─ resources
│        │   └─ WEB-INF
│        │       ├─ spring
│        │       │   ├─ appServlet
│        │       │   │   └─ servlet-context.xml
│        │       │   └─ root-context.xml
│        │       ├─ views
│        │       │   └─ home.jsp
│        │       └─ web.xml
│        └─ resources
│                └─ META-INF
│                    └─ log4j.xml
└── pom.xml
{% endhighlight %}

게시판을 다 만든 이후에는 아래와 같은 패키지 구성을 가지게 될 것이다.

{% highlight xml %}
┌─ src
│   └─ main
│        ├─ java
│        │   └─ com
│        │       └─ rlalsa8843
│        │           └─ board
│        │               ├─ controller
│        │               │   └─ BoardController.java
│        │               ├─ mapper
│        │               │   └─ BoardMapper.java
│        │               ├─ service
│        │               │   └─ BoardService.java
│        │               └─ vo
│        │                   ├─ Board.java
│        │                   └─ Reply.java
│        ├─ webapp
│        │   ├─ resources
│        │   │   └─ mapper
│        │   │       ├─ board
│        │   │       │   └─ board-mapper.xml
│        │   │       └─ mybatis-config.xml
│        │   └─ WEB-INF
│        │       ├─ spring
│        │       │   ├─ appServlet
│        │       │   │   └─ servlet-context.xml
│        │       │   ├─ hikaricp-context.xml
│        │       │   ├─ mapper-context.xml
│        │       │   └─ root-context.xml
│        │       ├─ views
│        │       │   ├─ create.jsp
│        │       │   ├─ list.jsp
│        │       │   └─ view.jsp
│        │       └─ web.xml
│        └─ resources
│                └─ META-INF
│                    └─ log4j.xml
└── pom.xml
{% endhighlight %}

시작하기 전에 패키지를 보면서 동작 구조를 간단히 설명하면 Spring이 실행될 때 먼저 `web.xml` 의 내용을 읽을 것이다. <br>
{% highlight xml %}
<!-- Application Context -->
<context-param>
	<param-name>contextConfigLocation</param-name>
	<param-value>/WEB-INF/spring/root-context.xml</param-value> <!-- Application Context 파일 경로 -->
</context-param>

...중략

<!-- Servlet Context -->
<servlet> 
	<servlet-name>dispatcherServlet</servlet-name>
	<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class> 
	<init-param>
		<param-name>contextConfigLocation</param-name> 
		<param-value>
			/WEB-INF/spring/appServlet/servlet-context.xml <!-- Servlet Context 파일 경로 -->
		</param-value>
	</init-param>
	<load-on-startup>1</load-on-startup>
</servlet>
{% endhighlight %}
`web.xml`에서 `Application Context`와 `Servlet Context` 의 파일 주소를 읽고 해당 파일 정보를 읽어 온다.<br>
각각의 Context에서 등록된 정보를 활용하여 scan 한 후 Bean에 등록한다. (상세 내용은 진행 하면서 중간중간 설명)<br><br>

![DispatcherServlet]({{ site.url }}/images/DispatcherServlet.png)


# 1. 세팅
## web.xml
{% highlight xml %}
<context-param>
	<param-name>contextConfigLocation</param-name>
	<param-value>/WEB-INF/spring/*-context.xml</param-value>
</context-param>
{% endhighlight %}

## root-context.xml
{% highlight xml %}
<context:component-scan base-package="com.rlalsa8843.board" use-default-filters="false">
	<context:include-filter type="annotation" expression="org.springframework.stereotype.Service" />
	<context:include-filter type="annotation" expression="org.springframework.stereotype.Repository" />
	<context:include-filter type="annotation" expression="org.springframework.stereotype.Component" />
</context:component-scan>
{% endhighlight %}

## servlet-context.xml
{% highlight xml %}
<context:component-scan base-package="com.rlalsa8843.board" use-default-filters="false">
	<context:include-filter type="annotation" expression="org.springframework.stereotype.Controller" />
</context:component-scan>
{% endhighlight %}

`root-context.xml` 과 `servlet-context.xml` 세팅으로 `Controller Annotation`이 붙은 클래스는 servlet-context에서 `Service, Repository, Component Annitation`이 붙은 클래스는 root-context에서 관리 한다.

## DB TABLE
{% highlight sql %}
CREATE TABLE `SpringBoard`.`TB_BOARD` (
  `IDX` BIGINT NOT NULL AUTO_INCREMENT COMMENT '인덱스',
  `TITLE` VARCHAR(45) NOT NULL COMMENT '게시글 제목',
  `CNTNT` TEXT NULL COMMENT '게시글 내용',
  `WRITER` VARCHAR(45) NOT NULL COMMENT '게시글 작성자', 
  `HIT` BIGINT NOT NULL DEFAULT 0 COMMENT '조회수',
  `DLT_YN` CHAR(1) NULL DEFAULT 'N' COMMENT '삭제 여부\nY : 삭제\nN : 미삭제',
  PRIMARY KEY (`IDX`));

CREATE TABLE `SpringBoard`.`TB_REPLY` (
  `IDX` BIGINT NOT NULL AUTO_INCREMENT,
  `BOARD_IDX` BIGINT NOT NULL,
  `REPLY` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`IDX`),
  INDEX `BOARD__idx` (`BOARD_IDX` ASC),
  CONSTRAINT `TB_BOARD_IDX_FK`
    FOREIGN KEY (`BOARD_IDX`)
    REFERENCES `SpringBoard`.`TB_BOARD` (`IDX`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
{% endhighlight %}

게시판에 필요한 테이블을 생성합니다. TB_BOARD는 게시판 내용을, TB_REPLY는 게시판 댓글을 구성 합니다.

## hikaricp-context.xml
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
	
	<bean id="hikariConfig" class="com.zaxxer.hikari.HikariConfig">
		<property name="driverClassName" value="com.mysql.cj.jdbc.Driver"></property>
		<property name="jdbcUrl" value="jdbc:mysql://{host}:{port}/SpringBoard"></property>
		<property name="username" value="{username}"></property>
		<property name="password" value="{password}"></property>
		<!-- connectionTestQuery는 생략 가능 -->
		<property name="connectionTestQuery" value="SELECT CURRENT_DATE"></property>
	</bean>
	
	<bean id="dataSource" class="com.zaxxer.hikari.HikariDataSource" destroy-method="close">
		<constructor-arg ref="hikariConfig"></constructor-arg>
	</bean>
	
</beans>
{% endhighlight %}

`hikaricp`로 Connection Pool을 생성합니다. {host}, {port}, {username}, {password} 에는 각각의 DB 접속 정보를 넣으면 됩니다. mysql이 아닌 경우 driverClassName이 달라질 수도 있습니다.

## mapper-context.xml
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

	<bean id="sqlSession" class="org.mybatis.spring.SqlSessionFactoryBean">
		<property name="dataSource" ref="dataSource"></property>
		<property name="mapperLocations" value="classpath:/mapper/**/*-mapper.xml">
		</property>
	</bean>
	
	<bean id="sqlSessionTemplate" class="org.mybatis.spring.SqlSessionTemplate">
		<constructor-arg index="0" ref="sqlSession"></constructor-arg>
	</bean>
	
	<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
		<property name="basePackage" value="com.rlalsa8843.board"></property>
	</bean>
	
</beans>

{% endhighlight %}

Mapper.xml 위치와 Mapper interface의 위치를 정의 합니다. 현재 구성는 mapper.xml 은 classpath의 mapper 폴더 내에 -mapper.xml 로 끝나는 파일이며, mapper inteface는 com.rlalsa8843.board 패키지 밑의 모든 클래스(인터페이스)를 스캔합니다.

# 2. 클래스
## BoardMapper.java
{% highlight java %}
package com.rlalsa8843.board.mapper;

public interface BoardMapper {
	int sample();
}
{% endhighlight %}

com.rlalsa8843.board 패키지 내에 mapper 패키지를 추가하고 interface를 만들면 앞서 세팅한 매퍼 스캔에 포함된 패키지 구조이기 때문에 매퍼가 실행 됩니다.

## BoardService.java
{% highlight java %}
package com.rlalsa8843.board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rlalsa8843.board.mapper.BoardMapper;

@Service
public class BoardService {
	@Autowired
	private BoardMapper boardMapper;
	
	public int sample() {
		return boardMapper.sample();
	}
}

{% endhighlight %}

앞서 만든 BoardMapper를 Bean 주입 후 해당 매퍼를 실행하는 서비스를 만듭니다.

## board-mapper.xml
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.rlalsa8843.board.mapper.BoardMapper">
	<select id="sample" resultType="Integer">
		SELECT 1
	</select>
</mapper>
{% endhighlight %}

classpath:/mapper/board/board-mapper.xml 에 `BoardMapper.interface` 의 `int sample()` method 가 호출될 경우 실행 할 쿼리를 정의 합니다.

## SampleController.java
{% highlight java %}
package com.rlalsa8843.board;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.rlalsa8843.board.service.BoardService;

@Controller
@RequestMapping(value = "/sample", method = RequestMethod.GET)
public class SampleController {
	@Autowired
	private BoardService boardService;
	
	@RequestMapping(value = "/testQuery")
	@ResponseBody
	public String testQuery() {
		return Integer.toString( boardService.sample() );
	}
	
}

{% endhighlight %}

컨트롤러까지 만들고 나면 localhost:8080/sample/testQuery 로 실행할 경우 쿼리 결과가 나오는 것을 확인할 수 있습니다.

## 현재 패키지 구성도
{% highlight xml %}
┌─ src
│   └─ main
│        ├─ java
│        │   └─ com
│        │       └─ rlalsa8843
│        │           └─ board
│        │               ├─ mapper
│        │               │   └─ BoardMapper.java
│        │               └─ Service
│        │                   └─ BoardService.java
│        ├─ webapp
│        │   ├─ resources
│        │   │   └─ mapper
│        │   │       └─ board
│        │   │           └─ board-mapper.xml
│        │   └─ WEB-INF
│        │       ├─ spring
│        │       │   ├─ appServlet
│        │       │   │   └─ servlet-context.xml
│        │       │   ├─ hikaricp-context.xml
│        │       │   ├─ mapper-context.xml
│        │       │   └─ root-context.xml
│        │       ├─ views
│        │       │   └─ home.jsp
│        │       └─ web.xml
│        └─ resources
│                └─ META-INF
│                    └─ log4j.xml
└── pom.xml
{% endhighlight %}

다음 시간에는 실제 게시판을 위한 코드를 짜보도록 하겠습니다.