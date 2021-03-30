---
layout: post
title: "[Spring] 게시판 만들기 2편"
description: "Spring legacy를 활용한 게시판 만들기"
modified: 2021-03-30
tags: [Spring, Spring legacy, Spring board]
categories: [Spring]
---
# 서론
지난 포스트에서 Spring과 Mybatis Hikari를 활용하여 간단히 연동 하였습니다. 이번 포스트에서는 실제 게시판을 만들어 보도록 하겠습니다.

## 기술 스택

|   종류    |   스택                 |
|:--------- |:-----------------------|
| Java      | Oracle Java 1.8        |
| DB        | MySql 5.7.31           |
| WAS       | Tomcat 9.0             |
| Framework | Spring Framework 3.1.1 |
| Mapper    | Mybatis 3.5.6          |

# 시작
먼저 스프링 프로젝트를 생성하면 아래와 같은 패키지 구성을 가질 것이다.(Eclipse 기준)

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

# 1. 시작
먼저 데이터를 담는 그릇인 VO를 생성해 보겠습니다.
board 패키지 밑에 vo 패키지를 생성하고 아래 2개의 클래스를 생성합니다.

## Board.java
{% highlight java %}
package com.rlalsa8843.board.vo;

public class Board {
	private long idx;
	private String title;
	private String cntnt;
	private String writer;
	private int hit;
	private boolean dltYn;
	
	public long getIdx() {
		return idx;
	}
	public void setIdx(long idx) {
		this.idx = idx;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getCntnt() {
		return cntnt;
	}
	public void setCntnt(String cntnt) {
		this.cntnt = cntnt;
	}
	public String getWriter() {
		return writer;
	}
	public void setWriter(String writer) {
		this.writer = writer;
	}
	public int getHit() {
		return hit;
	}
	public void setHit(int hit) {
		this.hit = hit;
	}
	public boolean isDltYn() {
		return dltYn;
	}
	public void setDltYn(boolean dltYn) {
		this.dltYn = dltYn;
	}
	
	@Override
	public String toString() {
		return "Board [idx=" + idx + ", title=" + title + ", cntnt=" + cntnt + ", writer=" + writer + ", hit=" + hit
				+ ", dltYn=" + dltYn + "]";
	}
	
}
{% endhighlight %}

## Reply.java
{% highlight java %}
package com.rlalsa8843.board.vo;

public class Reply {
	private long idx;
	private long boardIdx;
	private String reply;
	
	public long getIdx() {
		return idx;
	}
	public void setIdx(long idx) {
		this.idx = idx;
	}
	public long getBoardIdx() {
		return boardIdx;
	}
	public void setBoardIdx(long boardIdx) {
		this.boardIdx = boardIdx;
	}
	public String getReply() {
		return reply;
	}
	public void setReply(String reply) {
		this.reply = reply;
	}
	
	@Override
	public String toString() {
		return "Reply [idx=" + idx + ", boardIdx=" + boardIdx + ", reply=" + reply + "]";
	}
	
}

{% endhighlight %}

다음 mapper 패키지를 생성 후 Mapper 클래스를 구성합니다.
## BoardMapper.java
{% highlight java %}
package com.rlalsa8843.board.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.rlalsa8843.board.vo.Board;
import com.rlalsa8843.board.vo.Reply;

public interface BoardMapper {
	List<Board> selectList(); // 리스트 조회
	
	int insertBoard(Board board); // 게시글 작성
	
	Board selectOne(@Param("idx") String idx); // 한 개의 게시글 조회
	
	List<Reply> selectReply(@Param("idx") String idx); // 게시글에 대한 댓글 조회
	
	int insertReply(Reply reply); // 댓글 자성
	
	int updateHit(Board board); // 조회수 증가
}

{% endhighlight %}

Mapper.xml 을 구성하기 앞서, 지난시간에 만들었던 `mapper-context.xml`을 일부 수정해 보겠습니다.

{% highlight xml %}
<bean id="sqlSession" class="org.mybatis.spring.SqlSessionFactoryBean">
	<property name="dataSource" ref="dataSource"></property>
	<property name="mapperLocations" value="classpath:/mapper/**/*-mapper.xml"></property>
	<!-- 해당 부분 추가 -->
	<property name="configLocation" value="classpath:/mapper/mybatis-config.xml"></property> 
	<!-- 추가 끝 -->
</bean>
{% endhighlight %}

그리고 classpath:/mapper 경로에 mybatis-config.xml 파일을 추가 합니다.

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
	<typeAliases>
		<typeAlias type="com.rlalsa8843.board.vo.Board" alias="board"/>
		<typeAlias type="com.rlalsa8843.board.vo.Reply" alias="reply"/>
	</typeAliases>
</configuration>
{% endhighlight %}

해당 config로 인해 기존에 com.rlalsa8843.board.vo.Board 을 작성해줘야 했던 부분을 `board` 로 한 단어로 설정할 수 있습니다.

## board-mapper.xml
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.rlalsa8843.board.mapper.BoardMapper">

	<select id="selectList" resultType="board">
		SELECT IDX, 
			   TITLE,
			   CNTNT,
			   WRITER,
			   HIT
		  FROM TB_BOARD
		<where>
			AND DLT_YN = 'N'
		</where>
		ORDER BY IDX DESC
	</select>
	
	<insert id="insertBoard" parameterType="board">
		INSERT INTO TB_BOARD(TITLE, WRITER, CNTNT)
		VALUES(#{title}, #{writer}, #{cntnt})
	</insert>
	
	<select id="selectOne" parameterType="String" resultType="board">
		SELECT IDX,
			   TITLE,
			   CNTNT,
			   WRITER
		  FROM TB_BOARD
		<where>
			AND IDX = #{idx}
		</where>
	</select>
	
	<select id="selectReply" parameterType="String" resultType="reply">
		SELECT REPLY
		  FROM TB_REPLY
		<where>
			BOARD_IDX = #{idx}
		</where>
		ORDER BY IDX;
	</select>
	
	<insert id="insertReply" parameterType="reply">
		INSERT INTO TB_REPLY(BOARD_IDX, REPLY)
		VALUES(#{boardIdx}, #{reply})
	</insert>
	
	<update id="updateHit" parameterType="board">
		UPDATE TB_BOARD
		   SET HIT = IFNULL(HIT, 0) + 1
		<where>
			AND IDX = #{idx}
		</where>
	</update>

</mapper>
{% endhighlight %}

board-mapper.xml을 생성하여 다음 쿼리를 작성 합니다. 해당 쿼리에서 id 값은 mapper interface에 정의해 두었던 method 명이고, parameterType, resultType 또한 mapper 인터페이스에서 정의해 두었던 매개변수, 반환 타입을 동일하게 맞춰줘야 합니다.

이제 service와 controller를 생성해 보겠습니다.

## BoardService.java
{% highlight java %}
package com.rlalsa8843.board.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rlalsa8843.board.mapper.BoardMapper;
import com.rlalsa8843.board.vo.Board;
import com.rlalsa8843.board.vo.Reply;

@Service
public class BoardService {
	@Autowired
	private BoardMapper boardMapper;
	
	public List<Board> selectList() {
		return boardMapper.selectList();
	}
	
	public int insertBoard(Board board) {
		return boardMapper.insertBoard(board);
	}
	
	public Board selectOne(String idx) {
		return boardMapper.selectOne(idx);
	}
	
	public List<Reply> selectReply(String idx) {
		return boardMapper.selectReply(idx);
	}
	
	public int insertReply(Reply reply) {
		return boardMapper.insertReply(reply);
	}
	
	public int updateHit(Board board) {
		return boardMapper.updateHit(board);
	}
}

{% endhighlight %}

`@Service` Annotation을 달아주고, 해당 Controller에서 Service를 실행 시 실행할 동작을 정의 합니다. 현재 Service에서는 간단히 쿼리만 실행시키도록 하였습니다.

## BoardController.java
{% highlight xml %}
package com.rlalsa8843.board.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.rlalsa8843.board.service.BoardService;
import com.rlalsa8843.board.vo.Board;
import com.rlalsa8843.board.vo.Reply;

@Controller
public class BoardController {
	@Autowired
	private BoardService boardService;
	
	private static final Logger logger = LoggerFactory.getLogger(BoardController.class);
	
	@RequestMapping(value = "/")
	public ModelAndView home(ModelAndView mv) {		
		List<Board> list = boardService.selectList();
		
		logger.debug("게시판 리스트 조회 완료");
		
		mv.addObject("boardList", list);
		mv.setViewName("list");
		
		return mv;
	}
	
	@RequestMapping(value = "/create")
	public ModelAndView create(ModelAndView mv) {
		mv.setViewName("create");
		
		return mv;
	}
	
	@RequestMapping(value ="/addPost", method = RequestMethod.POST)
	public ModelAndView post(ModelAndView mv, Board board) {
		logger.debug( board.toString() );
		
		boardService.insertBoard(board);
		
		mv.setViewName("redirect:/");
		return mv;
	}
	
	@RequestMapping(value ="/addReply", method = RequestMethod.POST)
	public ModelAndView reply(ModelAndView mv, Reply reply) {
		logger.debug( reply.toString() );
		
		boardService.insertReply(reply);
		
		mv.setViewName("redirect:/view?no=" + reply.getBoardIdx());
		return mv;
	}
	
	@RequestMapping(value = "/view")
	public ModelAndView view(@RequestParam("no") String idx, ModelAndView mv) {
		Board board = boardService.selectOne(idx);
		List<Reply> replyList = boardService.selectReply(idx);
		boardService.updateHit(board);
		
		mv.addObject("board", board);
		mv.addObject("replyList", replyList);
		
		mv.setViewName("view");
		
		return mv;
	}
	
}

{% endhighlight %}

이렇게 Controller를 생성하고 나면 Java 에서의 코드는 끝이 났습니다.
각 method에서 ModelAndView를 return 하고 있는데 이때 ViewName은 servlet-context.xml 에서 정의한

{% highlight xml %}
<beans:bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
	<beans:property name="prefix" value="/WEB-INF/views/" />
	<beans:property name="suffix" value=".jsp" />
</beans:bean>
{% endhighlight %}
이 부분에 의해 /WEB-INF/views/ 경로의 jsp로 끝나는 확장자 파일을 찾게 됩니다. 따라서 저희는 해당 경로에 맞는 이름의 jsp 파일을 만들어야 합니다.

## create.jsp
{% highlight html %}
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<html>
<head>
	<title>게시글 작성</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">
	
	<style>
		body { padding-top: 70px; padding-bottom: 30px; }
		.theme-dropdown .dropdown-menu { position: static; display: block; margin-bottom: 20px; }
		.theme-showcase > p > .btn { margin: 5px 0; }
		.theme-showcase .navbar .container { width: auto; }
	</style>
</head>
<body>
	<div class="container theme-showcase">
		<form action="<c:url value='/addPost' />" method="post">
			<div class="form-group">
				<label for="fm-title">게시글 제목</label>
				<input type="text" class="form-control" id="fm-title" name="title" placeholder="제목을 작성해주세요.">
			</div>
			<div class="form-group">
				<label for="fm-writer">작성자</label>
				<input type="text" class="form-control" id="fm-writer" name="writer" placeholder="작성자 이름">
			</div>
			<div class="form-group">
				<label for="fm-cntnt">본문</label>
				<textarea class="form-control" id="fm-cntnt" name="cntnt" rows="3"></textarea>
			</div>
		<button type="submit" class="btn btn-lg btn-default" style="float: right;">게시글 작성</button>
		</form>
	</div>
	
	<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
</body>
</html>

{% endhighlight %}

## list.jsp
{% highlight html %}
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<html>
<head>
	<title>게시판</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">
	
	<style>
		body { padding-top: 70px; padding-bottom: 30px; }
		.theme-dropdown .dropdown-menu { position: static; display: block; margin-bottom: 20px; }
		.theme-showcase > p > .btn { margin: 5px 0; }
		.theme-showcase .navbar .container { width: auto; }
	</style>
</head>
<body>
	<div class="container theme-showcase">
		<table class="table">
			<thead>
				<tr>
					<th scope="col">NO</th>
					<th scope="col">게시글 제목</th>
					<th scope="col">작성자</th>
					<th scope="col">조회수</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="item" items="${boardList}" varStatus="status">
					<tr>
						<th scope="row">${status.count}</th>
						<td><a href="${pageContext.request.contextPath}/view?no=${item.idx}">${item.title}</a></td>
						<td>${item.writer}</td>
						<td>${item.hit}</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	<a class="btn btn-lg btn-default" href="/create" style="float: right;">게시글 작성</a>
	</div>
	
	<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
</body>
</html>

{% endhighlight %}

## view.jsp
{% highlight html %}
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<html>
<head>
	<title>게시판</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">
	
	<style>
		body { padding-top: 70px; padding-bottom: 30px; }
		.theme-dropdown .dropdown-menu { position: static; display: block; margin-bottom: 20px; }
		.theme-showcase > p > .btn { margin: 5px 0; }
		.theme-showcase .navbar .container { width: auto; }
	</style>
</head>
<body>
	<div class="container theme-showcase">
		<table class="table">
			<colgroup>
				<col width="10%" />
				<col width="*" />
			</colgroup>
			<tbody>
				<tr>
					<th>제목</th>
					<td>${ board.title }</td>
				</tr>
				<tr>
					<th>작성자</th>
					<td>${ board.writer }</td>
				</tr>
				<tr>
					<th>본문</th>
					<td>${ board.cntnt }</td>
				</tr>
			</tbody>
		</table>
		<a class="btn btn-lg btn-default" href="/">뒤로가기</a>
	
		<table class="table" style="margin-top: 50px;">
			<tbody>
				<c:forEach var="item" items="${ replyList }">
					<tr>
						<td>${ item.reply }</td>
					</tr>
				</c:forEach>
				<tr>
					<td>
						<form action="<c:url value='/addReply' />" method="post">
							<input type="hidden" value="${ board.idx }" name="boardIdx" >
							<div class="form-group">
								<textarea class="form-control" style="display: inline; width: 90%;" name="reply" rows="3"></textarea>
								<span style="float: right; width: 10%; height: auto; padding: 6px 12px; border: 1px;">
									<button type="submit" class="btn btn-lg btn-default" style="width: 100%; height: 100%;">확인</button>
								</span>
							</div>
						</form>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	
	<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
</body>
</html>

{% endhighlight %}

이렇게 jsp 파일까지 만들면 아래와 같은 패키지 구성을 가지게 되며 끝이나게 됩니다.
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

# 3. 정리
처음 Spring을 실행하게 되면 web.xml 파일이 실행이 되며 `Application Context`와 `Servlet Context`의 위치를 읽어온 뒤, 각각의 Context 파일의 내용을 읽습니다.
이후 `Application Context`에서 DB 연결 정보 등을 읽어오며 Hikaricp와 Mapper 를 연결하며 Java와 Xml에서 쿼리를 실행할 수 있도록 도와줍니다.
Mybatis에 의해 `board-mapper.xml`과 `BoardMapper.java`가 연결되어 있으며 2개의 파일에서
| java      | xml           |
|:--------- |:--------------|
| method 명 | id            |
| parameter | ParameterType |
| result    | ResultType    |
의 정보는 맞춰줘야 합니다.
ex)
java에서 int insertBoard(Board board) 와 xml에서 <insert id="insertBoard" parameterType="board"> 은
| 예시      | java        | xml         |
|:----------|:------------|:------------|
| method    | insertBoard | insertBoard |
| parameter | Board       | board       |
| result    | int         | (생략)      |
와 같은 매핑을 가지게 됩니다.

따라서 사용자가 `/view` url로 요청 한다면 Controller에서 Mapping 된 메소드가 실행이 되며, 해당 Controller에서 Service를 실행하게 됩니다.
그럼 Service에서 Mapper interface를 실행하게 되며 interface에서 xml에 매핑된 쿼리를 실행합니다.

<a href="https://github.com/kmj8843/SpringBoard" target="_blank">Git에서 소스 보기</a>