---
title: "[Jekyll] Blog 시작하기(1)"
excerpt: Jekyll Blog 기본 환경
author_profile: true
toc : true
categories: 
  - Jekyll
tags:
  - Jekyll
  - Blog  
---


# 기본 환경

jekyll을 이용해서 블로그를 구성하기 위해서는 Rudy와 Jekyll 세팅이 필요합니다.

## Ruby 세팅

### brew rbenv 이용하여 Ruby 설치

~~~
$ brew install rbenv
~~~

rbenv는 루비의 버전을 관리를 도와주는 패키지입니다.

rbenv를 통해 여러 Ruby 버전 설치가 가능하고, 필요에 따라 여러 Ruby 버전 사용이 가능합니다.

### rbenv를 이용한 Ruby 설치

~~~
$ open ~/.zshrc # zsh에 rbenv 추가

eval "$(rbenv init -)" # zsh에 해당 설정 추가

$ source ~/.zshrc # zsh 반영
~~~

### Ruby 버전 설치

~~~
$ rbenv install 2.7.2 # 원하는 Ruby 버전으로 설치 진행
$ rbenv global 2.7.2
$ rbenv rehash

$ ruby -v # Ruby 버전 확인
~~~

global : 전역 설정을 변경하는 옵션 <br/>
local : 현재 디렉토리에 설정 파일을 추가하여 프로젝트 별로 루비 버전을 설정할 때 사용

## bundler 설치

Ruby에서 사용하는 패키지인 Gem의 의존성 관리를 위한 의존성 관리 도구인 bundler 설치

~~~
$ gem install bundler
~~~

## Jekyll 설치

~~~
$ gem install jekyll
~~~

터미널에서 `ruby -v`와 `jekyll -v`로 정상적으로 설치되었는지 확인해주세요!

