import {
    CourseLoader,
    CourseIndexingService, TranscriptProcessor, 
} from "../course";
import { OpenAIEmbeddingService } from "../embeddings";
import { QdrantVectorStore } from "../vectorstore";
import {IndexingService} from '../services'
import { DocumentChunk } from "../types";
export async function testBatchCourseIndex() {

    console.log("\n========== TEST 11 ==========\n");

    const loader = new CourseLoader();

    const course = await loader.load(
        "./data",
        "react-native",
        "React Native Bootcamp"
    );

    const indexer = new CourseIndexingService(
    new TranscriptProcessor(),
    new IndexingService(
        new OpenAIEmbeddingService(),
        new QdrantVectorStore()
        
    )
    
);
    await indexer.rebuildCourse(course);
    const allChunks = await indexer.rebuildCourse(course)
   console.table(

    allChunks.map(chunk => ({

        lesson: chunk.metadata.lessonTitle,

        course: chunk.metadata.courseTitle,

        lessonOrder: chunk.metadata.lessonOrder,

    }))
    

);

}