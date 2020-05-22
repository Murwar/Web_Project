import axios from "axios";

class VisionApi {
  static getPictureData(uploadedImageUrl) {
    return new Promise(async (resolve) => {

    //Seting up payload to send;
      const CVF_analyze = "v1.0/analyze";
      const params = {
        visualFeatures: "Categories,Tags,Faces,Description,ImageType,Color,Adult",
        details: "Landmarks,Celebrities"
      };
      const imageUrl = uploadedImageUrl;

      const payload = {
        computerVisionFunction: CVF_analyze,
        params,
        imageUrl
      };

      const backendApiUrl ="https://picuploadtest-0020-backendapi.herokuapp.com/vision-api";

      //Setup and Call Computer Vision Api with Axios
      // Add axios.post Headers
      axios.defaults.headers.post["Content-Type"] = "application/json";
      try {
        const data = await axios({
          method: "post",
          url: backendApiUrl,
          data: payload
        }).catch(error => {
          console.log("Frontend first Catch: ", error);

        });
        console.log(data.data);
        resolve(data.data);
      } catch (err) {
        console.log("Frontend second Catch: ", err);
      }
    });
  }
}

export default VisionApi;
