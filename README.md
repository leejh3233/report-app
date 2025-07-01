
# 시공보고서 웹앱

직원들이 모바일 또는 PC에서 시공보고서를 작성하고,
1. 결과 미리보기
2. 복사하기 (카카오톡 등)
3. 구글 스프레드시트로 전송

기능을 제공합니다.

## 구성 파일

- `index.html`: 메인 화면
- `style.css`: 스타일 시트
- `script.js`: 기능 로직
- `README.md`: 설명 문서

## 설정 방법

1. 구글 스프레드시트 생성 후 Apps Script에서 웹앱 배포
2. `script.js`의 `scriptURL` 변수에 Apps Script 배포 URL 입력
3. GitHub Pages 또는 Vercel 등에 업로드

완료 후 모바일에서 홈화면 앱처럼 사용할 수 있습니다.
