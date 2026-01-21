<%*
// 템플릿 실행 중단
if (!tp.file) {
new Notice("⚠️ 현재 노트가 열려 있지 않습니다. 템플릿 실행을 중단합니다.");
  return; // 여기서 종료
}

const filePath = tp.file.path;
tR += `현재 파일 경로: ${filePath}`;
%>

<%_*
// 노트 내용
const fileContent = tp.file.content;
_%>

<%_*
const noteType = await tp.system.suggester(
    ["🌱Seed", "🌲Tree", "🍑Fruit", "🌻Flower"], 
    ["[[_templates/_seed/_index|Seed]]", "[[_templates/_tree/_index|Tree]]", "[[_templates/_fruit/_index|Fruit]]", "[[_templates/_flower/_index|Flower]]"], 
    true, 
    "Select Your Note Type");

console.log("noteType: ", noteType);

// file 가져오기
const file = tp.config.target_file

await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
  // metadata 업데이트
  frontmatter.created = tp.file.creation_date();
  frontmatter.author = "Mindulle";
  frontmatter.source = "";
  frontmatter.type = noteType;
});
_%>
