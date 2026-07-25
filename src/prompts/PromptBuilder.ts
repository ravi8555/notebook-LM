import { VectorSearchResult } from "../vectorstore";
import { PromptTemplate } from "./PromptTemplate";
import { formatTimestamp } from "../utils/formatTimestamp";
import { truncateText } from "../utils/truncateText";

export class PromptBuilder {   

    build(
        question: string,
        results: VectorSearchResult[]
    ): string {

        const context = results
            .map((result, index) => {

                return `
=============================
SOURCE ${index + 1}

Lesson:
${result.chunk.metadata.lessonTitle}

Timestamp:
${formatTimestamp(result.chunk.start)}
-
${formatTimestamp(result.chunk.end)}

Transcript:
${truncateText(result.chunk.text)}
=============================
                `.trim();

            })
            .join("\n\n");

        return `
${PromptTemplate.SYSTEM}

----------------------------------------
COURSE CONTEXT
----------------------------------------

${context}

----------------------------------------
QUESTION
----------------------------------------

${question}

----------------------------------------
ANSWER
----------------------------------------
        `.trim();
    }

}