import { extractResumeText } from "./services/resumeParser.service.js";

const text = await extractResumeText("./testResume.pdf");

console.log("===== EXTRACTED RESUME TEXT =====");
console.log(text);
