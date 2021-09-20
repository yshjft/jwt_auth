## 홧김에 만든 jwt auth

### 사용스택
- Node.js(express.js)   
  백엔드 어플리케이션 구현을 위해 사용
  

- MYSQL    
  사용자 정보(id, 이름, 출생년도, 출생달, 출생일, 주소, 이메일, 패스워드)를 저장하는 데이터베이스
  

- JWT(JSON WEB TOKEN)   
  인증을 위한 access token, refresh token으로 사용, payload 사용자 id를 담는다
  

- Redis with Docker   
  refresh token을 저장하기 위해 사용 
  

### JWT 로그인 구현
1. 사용자가 이메일과 패스워드를 이용하여 로그인
2. 사용자인 경우 access token과 refresh token을 발급   
    - refresh token은 redis에 [id : refresh token]으로 저장
    - 발근된 토큰들은 cookie에 설정하여 전달
3. 서버에 요청을 보낼때 headers에 authorization: 'bearer ' + access token 방식으로 토큰도 전달
4. 요청을 처리하기전 access token이 유효한지 검증한 후 요청을 처리
5. access token이 유효하지 않을 경우 클라이언트는 refresh token과 함께 access token 갱신 요청을 전달
6. refresh token이 유효한지 검증(만료 여부, redis에 저장된 토크과 비교)을 통해 문제가 없는 경우 access token 재발급

### 로그아웃
- redis에 저장된 토큰과 쿠키들을 모두 지움

### Redis with Docker   
도커로 레디스를 실행시키며 겪었던 문제와 해결방안을 정리한다 
- 로컬에 켜져 있는 레디스가 꺼져있는지 확인한다. 
- 레디스를 도커에서 실행을 위해 포트 매핑을 할경우 아래와 같이 127.0.0.1도 포함시킨다   
  docker run -d -p 127.0.0.1:6379:6379 redis   