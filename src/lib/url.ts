// 배포 경로(base) 접두어를 붙인 앱 내부 URL. 앱 웹뷰(base '/')와 GitHub Pages 프로토타입(base '/Vibecoding_TQ_Contents/') 모두에서 동작
export function appUrl(path: string) {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}
