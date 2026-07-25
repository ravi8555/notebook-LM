import { CourseLoader, TranscriptProcessor } from "../course";

export async function testTranscriptProcessor() {

    console.log("\n========== TEST 10 ==========\n");

    const loader = new CourseLoader();

    const course = await loader.load(
        "./data",
        "react-native-course",
        "React Native Bootcamp"
    );

    const processor =
        new TranscriptProcessor();

    const chunks =
        await processor.process(course.lessons[0]);

    console.log();

    console.log(
        `Generated ${chunks.length} chunks`
    );

    console.table(
        chunks.map(chunk => ({
            id: chunk.id,
            lesson: chunk.metadata.lessonTitle,
            start: chunk.start,
            end: chunk.end,
        }))
    );

}