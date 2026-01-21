<%*
// Gemini API 키 설정
const apiKey = "AIzaSyD1I2n71xDMRlQ2RDrOOJlbV0iHLl4s1sA";
const prompt = `You are an expert in generating an appropriate topics properties that will be used in Obsidian Note. Your mission is to generate one or more topics suitable for given content.

Your generated output must be comma-separated values.

### Example Output:
[[📚 214 Document Parser]], [[📖 200 AI & Data]], [[📚 601 Enterprise Outsourcing Projects]]

Here's a list of possible substitutions for topics.
You must use these topics listed below:

### Topics:
- [[📖 100 연구]]
  - [[📚 101 RAG 연구]]
  - [[📚 102 LLM 연구]]
  - [[📚 103 AI 트렌드]]
  - [[📚 104 AI 활용 사례]]
  - [[📚 105 최신 논문]]  

- [[📖 200 AI & 데이터]]
  - [[📚 201 Concepts]]
  - [[📚 202 Prompt]]
  - [[📚 203 Retriever]]
  - [[📚 204 Embedding]]
  - [[📚 205 LLM]]
  - [[📚 206 LocalModels / Ollama]]
  - [[📚 207 Vector DB]]
  - [[📚 208 Reranking]]
  - [[📚 209 Knowledge Graph]]
  - [[📚 210 Hybrid Search]]
  - [[📚 211 Evaluation]]
  - [[📚 212 HuggingFace]]
  - [[📚 213 Agent]]
  - [[📚 214 문서파서]]
  - [[📚 220 Fine-Tuning]]
  - [[📚 221 LangChain / LangGraph]]
  - [[📚 222 vLLM]]
  - [[📚 230 데이터 분석]]
  - [[📚 231 머신러닝]]
  - [[📚 232 딥러닝 (pytorch)]]
  - [[📚 233 데이터 엔지니어링]]
  - [[📚 250 AI 서비스 구축]]

- [[📖 300 개발]]
  - [[📚 301 Python]]
  - [[📚 302 Web 개발]]
  - [[📚 303 AWS]]
  - [[📚 304 Docker & Kubernetes]]
  - [[📚 305 시스템 설계]]
  - [[📚 306 MLOps & 배포]]
  - [[📚 307 Git]]
  - [[📚 308 ngrok]]
  - [[📚 309 FastAPI]]
  - [[📚 310 가상환경/패키지관리(PYPI, Poetry, UV)]]

- [[📖 400 디자인]]
  - [[📚 401 디자인 기본기]]
  - [[📚 402 로고 디자인]]
  - [[📚 403 포스터 디자인]]

- [[📖 500 비즈니스 & 운영]]
  - [[📚 501 라우드소싱 컨테스트]]
  - [[📚 502 99designs 컨테스트]]
  - [[📚 503 디자인 에셋 수익화]]
  - [[📚 504 3D 에셋 수익화]]
  - [[📚 504 저관여 웹 앱 수익화]]

- [[📖 700 프로젝트]]
  - [[📚 701 기업 외주 프로젝트]]
  - [[📚 702 사이드 프로젝트]]

- [[📖 800 콘텐츠 & SNS]]
  - [[📚 801 JellyLove Discord 서버]]

- [[📖 900 지식관리 & 생산성]]
  - [[📚 901 세컨드브레인]]
  - [[📚 902 메모 & 노트]]
  - [[📚 903 나의 생각 정리]]
  - [[📚 904 업무 자동화]]

- [[📖 1000 Personal & 성장]]
  - [[📚 1001 커리어]] 
  - [[📚 1002 네트워킹 & 커뮤니티]]
  - [[📚 1003 개인 구매]]

[Note] Write your Final Answer in Korean. DO NOT narrate, just write the output without any markdown formatting of wrapping.

Generated topics must be related to the content. Otherwise, you will be penalized.
`;
%>

<%_*
// frontmatter의 topics 속성을 업데이트하는 함수
// @param file: 대상 파일 객체
// @param newTopics: 새로운 토픽 문자열 (쉼표로 구분된 값)

const processTopics = async (file, newTopics) => {
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    
    // 쉼표로 구분된 토픽을 배열로 변환하고 각 항목의 앞뒤 공백 제거
    const topics = newTopics.split(',').map(topic => topic.trim());

    // frontmatter의 topics 속성 업데이트
    frontmatter.topics = topics.map(topic => `${topic}`);
  });
};
_%>

<%*
// 현재 노트의 내용을 가져옵니다
const content = tp.file.content;

// 토픽 생성을 위한 curl 명령 실행
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    //"Authorization": `Bearer ${apiKey}`  // 이게 필요한 경우에만 사용하세요
  },
  body: JSON.stringify({
    contents: [
      {
        parts: [
          { text: `${prompt}\n\nHere is the content of the note:\n${content}` }
        ]
      }
    ]
  })
});

// 토픽을 생성하고 파일에 적용
const data = await res.json();
const topics = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "토픽 생성 실패";
console.log(JSON.stringify(data, null, 2));
const file = tp.config.target_file;
await processTopics(file, topics);
%>