<%*
const apiKey = "AIzaSyD1I2n71xDMRlQ2RDrOOJlbV0iHLl4s1sA";

const prompt = `다음 내용을 기반으로 글의 제목을 한국어로 1개만 제안해 주세요. 내용: "${tp.file.content}". 특수문자 전혀 없이 순수 텍스트로 지어 주세요.`;

const requestBody = {
  contents: [
    {
      parts: [
        { text: prompt }
      ]
    }
  ]
};

// curl 명령 실행
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestBody)
});

const data = await res.json();
const title = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "제목 생성 실패";

// 파일 제목 변경
await tp.file.rename(title);

// 필요하면 노트 본문에도 제목 삽입
tR += `# ${title}`;
%>
