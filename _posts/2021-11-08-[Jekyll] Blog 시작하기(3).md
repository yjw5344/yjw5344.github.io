---
title: "[Jekyll] Blog 시작하기(3)"
excerpt: _config.yml 설정하기
author_profile: true
toc : true
categories: 
  - Jekyll
tags:
  - Jekyll
  - Blog  
---

<br/>

# 테마 기본 설정( _config.yml 수정하기 )

블로그의 전반적인 기본 사항은 _config.yml 파일을 통해서 설정하면 됩니다.

자기 취향에 맞게 커스텀해서 사용하면 되고, 세부 설정은 아래 코드를 참고해주세요!

(로컬 서버 jekyll serve를 재실행해야 적용됩니다. repository에는 push 후에 반영됩니다.)

~~~json

minimal_mistakes_skin    : "default" # "air", "aqua", "contrast", "dark", "dirt", "neon", "mint", "plum", "sunrise" 테마설정

# Site Settings
locale                   : "en-US" # 타깃 국가 설정, 블로그의 주요 언어 설정, 한국어(ko-KR)
title                    : "Blog - Wooner" # 사이트 탭에서 보이는 이름
title_separator          : "-"
subtitle                 : # 화면 Title 하단의 소제목
name                     : "Wooner Blog" # 블로그 이름(페이지 하단의 CopyRight 영역)
description              : "github-Blog" # 블로그 설명
url                      : "https://yjw5344.github.io" # 블로그 주소(URL)
baseurl                  : # 예기치 못한 오류 발생 시 연결되는 URL
repository               : "yjw5344/yjw5344.github.io" # GitHub username/repo-name e.g. "mmistakes/minimal-mistakes"
teaser                   : # path of fallback teaser image, e.g. "/assets/images/500x300.png", 폴백(예기치 못한 오류)일 때 보이는 이미지
logo                     : # path of logo image to display in the masthead, e.g. "/assets/images/88x88.png"
masthead_title           : Blog # overrides the website title displayed in the masthead, use " " for no title
# breadcrumbs            : false # true, false (default) breadcrumbs UX

...

# Site Author
author:
  name             : "Jungwon"
  avatar           : # path of avatar image, e.g. "/assets/images/bio-photo.jpg"
  bio              : "Git Blog"
  location         : "Seoul Korea"
  email            : #yjw5344@hanmail.net
  links:
    - label: "Email"
      icon: "fas fa-fw fa-envelope-square"
      url: "mailto:yjw5344@hanmail.net"
    - label: "Website"
      icon: "fas fa-fw fa-link"
      # url: "https://your-website.com"
    - label: "Twitter"
      icon: "fab fa-fw fa-twitter-square"
      # url: "https://twitter.com/"
    - label: "Facebook"
      icon: "fab fa-fw fa-facebook-square"
      # url: "https://facebook.com/"
    - label: "GitHub"
      icon: "fab fa-fw fa-github"
      url: "https://github.com/yjw5344"
    - label: "Instagram"
      icon: "fab fa-fw fa-instagram"
      # url: "https://instagram.com/"

...

# Site Footer
footer:
  links:
    - label: "Twitter"
      icon: "fab fa-fw fa-twitter-square"
      # url:
    - label: "Facebook"
      icon: "fab fa-fw fa-facebook-square"
      # url:
    - label: "GitHub"
      icon: "fab fa-fw fa-github"
      url: github.com/yjw5344
    - label: "GitLab"
      icon: "fab fa-fw fa-gitlab"
      # url:
    - label: "Bitbucket"
      icon: "fab fa-fw fa-bitbucket"
      # url:
    - label: "Instagram"
      icon: "fab fa-fw fa-instagram"
      # url:

~~~


나머지 설정은 [minimal-mistakes docs](https://mmistakes.github.io/minimal-mistakes/docs/configuration/)에서 확인하여 사용하시면 됩니다.

