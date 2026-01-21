<%*
// Gemini API 키 설정
const apiKey = "AIzaSyD1I2n71xDMRlQ2RDrOOJlbV0iHLl4s1sA";
const prompt = `You are an expert in generating an appropriate index properties that will be used in Obsidian Note. Your mission is to generate one or two indexes suitable for given content.

Your generated output must be comma-separated values.

Here is the example output:

### Example Output:
[[🏷️ 커리큘럼]], [[🏷️ 사이드 프로젝트]]
Here's a list of possible substitutions for index. You must use one of these indexes listed below.

<Index List>
- [[🏷️ 스터디]] : Self studying contents. Mostly development self memo will be this index.
- [[🏷️ 외주 프로젝트]] : Enterprise Outsourcing Projects
- [[🏷️ 사이드 프로젝트]] : Contents related to Side Projects
- [[🏷️ PM]] : Project Management
- [[🏷️ 커리큘럼]] : Curriculum related contents
- [[🏷️ 컨퍼런스]] : Conference related contents
- [[🏷️ 데일리 노트]] : Daily note related contents
</Index List>

####
[Note]
- Write your Final Answer in Korean.
- DO NOT narrate, just write the output without any markdown formatting of wrapping.
- Generated indexes must be related to the content. Otherwise, you will be penalized.
- Generated indexes must be one of the <Index List>
`;
%>

<%_*
// frontmatter의 index 속성을 업데이트하는 함수
// @param file: 대상 파일 객체
// @param newIndices: 새로운 토픽 문자열 (쉼표로 구분된 값)

const processIndicies = async (file, newIndices) => {
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    
    // 쉼표로 구분된 토픽을 배열로 변환하고 각 항목의 앞뒤 공백 제거
    const indices = newIndices.split(',').map(index => index.trim());

    // frontmatter의 indices 속성 업데이트
    frontmatter.indices = indices.map(index => `${index}`);
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

// 인덱스를 생성하고 파일에 적용
const data = await res.json();
const index = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "인덱스 생성 실패";
console.log(JSON.stringify(data, null, 2));
const file = tp.config.target_file;
await processIndicies(file, index);
%>