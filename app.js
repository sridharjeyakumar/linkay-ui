 import React, { useState, Suspense } from "react";

 import axios from "axios";



 import { Canvas } from "@react-three/fiber";

 import {

   OrbitControls,

   Environment,

   Stage,

   useGLTF,

 } from "@react-three/drei";



 const API_KEY = "msy_qFkUKUmyHJPKv4dPpbvJu7bV0wPHRvP63uC0";



 function Model({ url }) {

   const { scene } = useGLTF(url);



   return (

     <primitive

       object={scene}

       scale={1}

     />

   );

 }



 export default function App() {

   const [files, setFiles] = useState([]);

   const [status, setStatus] = useState("");

   const [loading, setLoading] = useState(false);

   const [viewerUrl, setViewerUrl] = useState("");

  const fileToBase64 = (file) =>

     new Promise((resolve, reject) => {

       const reader = new FileReader();



       reader.onload = () => resolve(reader.result);

       reader.onerror = reject;



       reader.readAsDataURL(file);

     });



   const generate3D = async () => {

     try {

       if (files.length === 0) {

         alert("Select images first");

         return;

       }



       setLoading(true);

       setStatus("Converting images...");



       const base64Images = await Promise.all(

         Array.from(files).map(fileToBase64)

       );



       setStatus("Uploading to Meshy...");



      //  const createResponse = await axios.post(

      //    "https://api.meshy.ai/openapi/v1/multi-image-to-3d",

      //    {

      //      image_urls: base64Images,

      //      should_texture: true,

      //      enable_pbr: true,

      //      target_formats: ["glb"]

      //    },

      //    {

      //      headers: {

      //        Authorization: `Bearer ${API_KEY}`,

      //        "Content-Type": "application/json"

      //      }

      //    }

      //  );

const createResponse = await axios.post(
  "https://api.meshy.ai/openapi/v1/multi-image-to-3d",
  {
    image_urls: base64Images,

    ai_model: "meshy-6",

    should_texture: true,

    enable_pbr: true,

    hd_texture: true,

    should_remesh: true,

    topology: "quad",

    target_polycount: 100000,

    target_formats: ["glb"]
  },
  {
    headers: {
      Authorization: `Bearer ${API_KEY}`
    }
  }
);

       const taskId = createResponse.data.result;



       console.log("Task ID:", taskId);



       setStatus("Generating 3D Model...");



      let finished = false;



       while (!finished) {

         const taskResponse = await axios.get(

           `https://api.meshy.ai/openapi/v1/multi-image-to-3d/${taskId}`,

           {

             headers: {

               Authorization: `Bearer ${API_KEY}`

             }

           }

         );



         const task = taskResponse.data;



         console.log(task);



         setStatus(task.status);



         if (task.status === "SUCCEEDED") {

           const glbUrl = task.model_urls.glb;



           console.log("Meshy GLB:", glbUrl);



           try {

             const response = await fetch(glbUrl);



             const blob = await response.blob();



             const localBlobUrl =

               URL.createObjectURL(blob);



             setViewerUrl(localBlobUrl);



             setStatus("Completed");



             finished = true;

           } catch (error) {

             console.error(error);



             alert(

               "Meshy blocked browser download (CORS). " +

               "Open console and check the error."

             );



            finished = true;

          }

        }



         if (task.status === "FAILED") {

           throw new Error("Generation failed");

         }



         if (!finished) {

           await new Promise(resolve =>

             setTimeout(resolve, 10000)

           );

         }

       }

     } catch (error) {

       console.error(error);



       alert(

         error?.response?.data?.message ||

         error.message ||

         "Unknown Error"

       );

     } finally {

       setLoading(false);

     }

   };



   return (

     <div

       style={{

         width: "100vw",

         height: "100vh",

         padding: 20,

         boxSizing: "border-box"

       }}

     >

       <h1>Meshy Multi Image To 3D</h1>



       <input

         type="file"

         multiple

         accept="image/*"

         onChange={(e) => setFiles(e.target.files)}

       />



       <br />

      <br />



       <button

         onClick={generate3D}

         disabled={loading}

       >

         {loading ? "Generating..." : "Generate 3D"}

       </button>



       <p>Status: {status}</p>



       {viewerUrl && (

         <div

           style={{

             width: "100%",

             height: "700px",

             border: "1px solid #ccc"

           }}

         >

           <Canvas

             camera={{

               position: [0, 0, 5],

               fov: 45           }}

           >

             <Suspense fallback={null}>

               <Stage

                 intensity={2}

                 environment="city"

                 adjustCamera

                 shadows

               >

                 <Model url={viewerUrl} />

               </Stage>



               <Environment preset="city" />

             </Suspense>



             <OrbitControls />           </Canvas>

         </div>

      )}

     </div>

   );

}