"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},84770:e=>{e.exports=require("crypto")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},68621:e=>{e.exports=require("punycode")},76162:e=>{e.exports=require("stream")},74026:e=>{e.exports=require("string_decoder")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},6162:e=>{e.exports=require("worker_threads")},71568:e=>{e.exports=require("zlib")},98061:e=>{e.exports=require("node:assert")},92761:e=>{e.exports=require("node:async_hooks")},72254:e=>{e.exports=require("node:buffer")},40027:e=>{e.exports=require("node:console")},6005:e=>{e.exports=require("node:crypto")},65714:e=>{e.exports=require("node:diagnostics_channel")},30604:e=>{e.exports=require("node:dns")},15673:e=>{e.exports=require("node:events")},87561:e=>{e.exports=require("node:fs")},88849:e=>{e.exports=require("node:http")},42725:e=>{e.exports=require("node:http2")},87503:e=>{e.exports=require("node:net")},38846:e=>{e.exports=require("node:perf_hooks")},39630:e=>{e.exports=require("node:querystring")},84492:e=>{e.exports=require("node:stream")},72477:e=>{e.exports=require("node:stream/web")},31764:e=>{e.exports=require("node:tls")},41041:e=>{e.exports=require("node:url")},47261:e=>{e.exports=require("node:util")},93746:e=>{e.exports=require("node:util/types")},24086:e=>{e.exports=require("node:worker_threads")},65628:e=>{e.exports=require("node:zlib")},2143:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>b,patchFetch:()=>C,requestAsyncStorage:()=>f,routeModule:()=>I,serverHooks:()=>D,staticGenerationAsyncStorage:()=>k});var s={};r.r(s),r.d(s,{POST:()=>v});var o=r(49303),n=r(88716),a=r(60670),i=r(87070);class c{static{this.SYSTEM=`
You are an AI Course Assistant.

Your job is to help the user understand the course content using ONLY the supplied transcript context.

Rules:
1. Never invent information.
2. If the user asks a specific question and the answer is not in the transcript, say:
   "I couldn't find this information in the course."
3. If the user quotes a phrase or seems to be looking for where something is mentioned, LOCATE that phrase in the context and explain the surrounding context (what topic is being discussed, who is speaking, what comes before/after).
4. Keep answers concise.
5. Do NOT invent lesson names or timestamps.
6. The application will provide citations separately.
`.trim()}}function l(e){return`${Math.floor(e/60).toString().padStart(2,"0")}:${Math.floor(e%60).toString().padStart(2,"0")}`}class u{build(e,t){let r=t.map((e,t)=>`
=============================
SOURCE ${t+1}

Lesson:
${e.chunk.metadata.lessonTitle}

Timestamp:
${l(e.chunk.start)}
-
${l(e.chunk.end)}

Transcript:
${(function(e,t=600){return e.length<=t?e:e.slice(0,t)+"..."})(e.chunk.text)}
=============================
                `.trim()).join("\n\n");return`
${c.SYSTEM}

----------------------------------------
COURSE CONTEXT
----------------------------------------

${r}

----------------------------------------
QUESTION
----------------------------------------

${e}

----------------------------------------
ANSWER
----------------------------------------
        `.trim()}}class d{constructor(e,t){this.searcher=e,this.chatService=t}async ask(e,t){let r=await this.searcher.search(e,t,10);console.log("\uD83D\uDCDA RAG retrieved:",r.length,"chunks");let s=new u().build(e,r),o=await this.chatService.generate([{role:"user",content:s}]),n=r.filter(e=>e.score>.2).sort((e,t)=>t.score-e.score).filter((e,t,r)=>t===r.findIndex(t=>t.chunk.lessonId===e.chunk.lessonId)).slice(0,4);return{...o,sources:n.map(e=>({lesson:e.chunk.metadata.lessonTitle,lessonId:e.chunk.lessonId,start:e.chunk.start,end:e.chunk.end}))}}}class p{constructor(e,t){this.embeddingService=e,this.vectorStore=t}async search(e,t,r=5){let s=await this.embeddingService.embed(e);return await this.vectorStore.search(s,{limit:r},t)}}var h=r(54214),m=r(16636);r.n(m)().config();let g=process.env.OPENAI_API_KEY||"";g||console.warn("Warning: OPENAI_API_KEY is not set in environment variables");class x{async generate(e){let t=await this.client.chat.completions.create({model:"gpt-4.1-mini",temperature:0,messages:e});return{answer:t.choices[0]?.message.content??"",sources:[]}}constructor(){this.client=new h.ZP({apiKey:g})}}var w=r(82181);let q=new(r(36262)).QdrantVectorStore,y=new d(new p(new w.F,q),new x);async function v(e){let t;let{question:r,sourceIds:s}=await e.json();s&&s.length>0&&(t={courseIds:s});let o=await y.ask(r,t);return i.NextResponse.json(o)}let I=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"D:\\practice\\GenAI-2026\\projects\\notebook-LM\\src\\app\\api\\chat\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:f,staticGenerationAsyncStorage:k,serverHooks:D}=I,b="/api/chat/route";function C(){return(0,a.patchFetch)({serverHooks:D,staticGenerationAsyncStorage:k})}},82181:(e,t,r)=>{r.d(t,{F:()=>i});var s=r(54214),o=r(16636);r.n(o)().config();let n=new s.ZP({apiKey:process.env.OPENAI_API_KEY}),a=process.env.EMBEDDING_MODEL??"text-embedding-3-small";class i{async embed(e){return(await n.embeddings.create({model:a,input:e})).data[0].embedding}async embedBatch(e){return console.log(`🚀 Embedding ${e.length} chunks in ONE request`),(await n.embeddings.create({model:a,input:e})).data.map(e=>e.embedding)}}},36262:(e,t,r)=>{r.d(t,{QdrantVectorStore:()=>n});class s{static toPayload(e){return{id:e.id,documentId:e.documentId,lessonId:e.lessonId,start:e.start,end:e.end,text:e.text,metadata:{courseId:e.metadata.courseId,courseTitle:e.metadata.courseTitle,lessonId:e.metadata.lessonId,lessonTitle:e.metadata.lessonTitle,lessonOrder:e.metadata.lessonOrder,source:e.metadata.source,segmentIds:e.metadata.segmentIds,tokenCount:e.metadata.tokenCount,duration:e.metadata.duration}}}}var o=r(70923);class n{constructor(e="notebook-Lm-col"){this.collectionName=e,this.client=new o.o({url:process.env.QDRANT_URL})}buildFilter(e){if(!e)return;let t=[];return e.courseId&&t.push({key:"metadata.courseId",match:{value:e.courseId}}),e.courseIds&&e.courseIds.length>0&&t.push({key:"metadata.courseId",match:{any:e.courseIds}}),e.lessonId&&t.push({key:"metadata.lessonId",match:{value:e.lessonId}}),t.length?{must:t}:void 0}async upsert(e){await this.upsertBatch([e])}async upsertBatch(e){if(0===e.length)return;let t=e.map(e=>({id:e.chunk.id,vector:e.embedding,payload:s.toPayload(e.chunk)}));console.log(`📦 Batch inserting ${t.length} vectors...`),await this.client.upsert(this.collectionName,{wait:!0,points:t}),console.log(`✅ Batch insert completed`)}async createCollection(){if((await this.client.getCollections()).collections.some(e=>e.name===this.collectionName)){console.log("Collection already exists.");return}await this.client.createCollection(this.collectionName,{vectors:{size:1536,distance:"Cosine"}}),console.log("Collection created.")}async recreateCollection(){(await this.client.getCollections()).collections.some(e=>e.name===this.collectionName)&&(console.log("\uD83D\uDDD1️ Deleting existing collection..."),await this.client.deleteCollection(this.collectionName)),console.log("\uD83D\uDCE6 Creating collection..."),await this.createCollection()}async search(e,t,r){let s=this.buildFilter(r),o={query:e,limit:t?.limit??5,with_payload:!0};s&&(o.filter=s),console.log("\uD83D\uDD0D Qdrant search params:",{collection:this.collectionName,limit:o.limit,filter:s,vectorSample:e.slice(0,3)});let n=await this.client.query(this.collectionName,o);return(console.log("\uD83D\uDD0D Qdrant response:",{pointsCount:n.points?.length??0,scores:n.points?.map(e=>e.score),sources:n.points?.map(e=>e.payload?.metadata?.lessonTitle)}),n.points&&0!==n.points.length)?n.points.map(e=>({score:e.score,chunk:e.payload})):(console.warn("⚠️ Qdrant returned 0 results"),[])}async deleteByCourseId(e){try{await this.client.delete(this.collectionName,{wait:!0,filter:{must:[{key:"metadata.courseId",match:{value:e}}]}}),console.log(`🗑️ Deleted vectors for course: ${e}`)}catch(e){console.error("\uD83D\uDDD1️ Qdrant delete failed:",e.message)}}async debugPayload(){console.dir((await this.client.scroll(this.collectionName,{limit:1,with_payload:!0,with_vector:!1})).points[0],{depth:null})}}new o.o({url:"http://localhost:6333"})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,720],()=>r(2143));module.exports=s})();