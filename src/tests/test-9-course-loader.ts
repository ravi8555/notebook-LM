import { CourseLoader } from "../course";

export async function testCourseLoader() {

    console.log("\n========== TEST 9 ==========\n");

    const loader = new CourseLoader();

    const course = await loader.load(

        "./data",

        "react-native-course",

        "React Native Bootcamp"

    );

    console.log(course.title);

    console.log();

    console.table(course.lessons);

}