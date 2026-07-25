import {
    CourseLoader,
    CourseIndexingService,
    TranscriptProcessor
} from "../course";

import {
    IndexingService
} from "../services";

import {
    OpenAIEmbeddingService
} from "../embeddings";

import {
    QdrantVectorStore
} from "../vectorstore";

export async function testBatchCourseIndex() {

    console.log("\n========== TEST 12 ==========\n");

    const loader = new CourseLoader();

    const course = await loader.load(
        "./data",
        "react-native-course",
        "React Native Bootcamp"
    );

    const processor =
        new TranscriptProcessor();

    const embedding =
        new OpenAIEmbeddingService();

    const vectorStore =
        new QdrantVectorStore();

    const indexing =
        new IndexingService(
            embedding,
            vectorStore
        );

    const courseIndexer =
        new CourseIndexingService(
            processor,
            indexing
        );

    await courseIndexer.rebuildCourse(course);

//    const allChunks: DocumentChunk[] = [];
//    console.table(

//     allChunks.map(chunk => ({

//         lesson: chunk.metadata.lessonTitle,

//         course: chunk.metadata.courseTitle,

//         lessonOrder: chunk.metadata.lessonOrder,

//     }))

// );

}