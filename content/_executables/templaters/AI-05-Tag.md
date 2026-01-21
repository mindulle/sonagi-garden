<%*
// Gemini API 키 설정
const apiKey = "AIzaSyD1I2n71xDMRlQ2RDrOOJlbV0iHLl4s1sA";
const prompt = `You are an expert at generating precise, SEO-optimized tags for technical and business documentation. Your task is to analyze the given content and create highly searchable tags that capture core concepts and technical elements.

### Analysis Framework:
1. Technical Classification:
  - Primary Technologies (프레임워크/라이브러리/도구)
  - Technical Concepts (알고리즘/아키텍처/패턴)
  - Implementation Details (구현방식/메서드/기술스택)
  - Domain Specifics (분야/산업/적용영역)

2. Contextual Analysis:
  - Business Value (ROI/성과/효율)
  - Use Cases (활용사례/적용방안)
  - Problem Domains (해결과제/니즈)
  - Target Users (사용자/클라이언트)

1. Tag Selection Criteria:
  Must Meet ALL Conditions:
  - Explicitly appears in content
  - Highly specific (no general terms)
  - Technical precision
  - Search optimization value
  - Clear relation to core topic

### Tag Generation Rules:
Technical Requirements:
- Keep technical terms in English (#RAG, #LLM etc)
- Include version numbers when specific
- Use established technical terminology
- Maintain technical accuracy

Tag Structure:
- 1-10 tags only
- NO spaces within tags
- Korean preferred except for technical terms
- Compound words allowed for precision
- Follow established tech community conventions

Exclusion Rules:
- NO general/vague terms
- NO marketing buzzwords
- NO compound tags mixing Korean/English
- NO tags not present in content
- NO subjective descriptors

Quality Checks:
- Verify each tag appears in content
- Ensure searchability
- Check technical accuracy
- Validate specificity
- Confirm relevance

[Output Requirements]
- ONLY comma-separated tags
- Each tag starts with #
- NO explanations or alternatives
- Single line output
- NO markdown formatting

Example format:
#RAG, #문서처리, #파이프라인, #LangChain, #성능최적화

Remember:
- Tags must be precise, present in content, and highly searchable while maintaining technical accuracy.
- Generate maximum 10 tags.
`;
%>

<%_*
// frontmatter의 tag 속성을 업데이트하는 함수
// @param file: 대상 파일 객체
// @param newTags: 새로운 토픽 문자열 (쉼표로 구분된 값)

const processTags = async (file, newTags) => {
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    
    // 쉼표로 구분된 태그를 배열로 변환하고 각 항목의 앞뒤 공백 제거
    const tags = newTags.split(',').map(tag => tag.trim());

    // frontmatter의 indices 속성 업데이트
    frontmatter.tags = tags.map(tag => `${tag}`);
  });
};
_%>

<%*
// 현재 노트의 내용을 가져옵니다
const content = tp.file.content;

// 태그 생성을 위한 curl 명령 실행
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

// 태그를 생성하고 파일에 적용
const data = await res.json();
const tag = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "태그 생성 실패";
console.log(JSON.stringify(data, null, 2));
const file = tp.config.target_file;
await processTags(file, tag);
%>