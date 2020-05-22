import React, { Component } from "react";
import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import VisionApi from "./ComputerVisionApi/visionApi";
import JSONPretty from "react-json-pretty";
import info from './image/info_512pxGREY.png';

class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
      imageUrl: "",
      selectedFile: "",
      visionApiData: "",
      uploadMessage: "",
      uploadMessageClass: "",
      dataReceived: false
    };

    this.fileUploadHandler = this.fileUploadHandler.bind(this);
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
  }


  fileSelectedHandler(event) {
    //console.log(event.target.files[0]);
    this.setState({
      selectedFile: event.target.files[0],
      uploadMessage: "",
      uploadMessageClass: "",
      dataReceived: false
    });
  }

  async fileUploadHandler() {
    //console.log("this.state.selectedFile: ", this.state.selectedFile);
    if (!this.state.selectedFile) {
      this.setState({
        uploadMessage: "Сначала загрузите изображение, пожалуйста",
        uploadMessageClass: "uploadGoodWaitingForData"
      });
    }

    try {
      const fd = new FormData();
      fd.append("title", this.state.selectedFile.name);
      fd.append("image", this.state.selectedFile, this.state.selectedFile.name);
      const res = await axios.post(
        "https://picuploadtest-0020-backendapi.herokuapp.com/upload",
        fd
      );
      this.setState({ imageUrl: res.data });
      if (this.state.imageUrl) {
        this.setState({
          uploadMessage: "Обработка...",
          uploadMessageClass: "uploadGoodWaitingForData"
        });
      } else {
        this.setState({
          uploadMessage: "sorry something went wrong with upload",
          uploadMessageClass: "error"
        });
      }

      const data = await VisionApi.getPictureData(res.data);
      this.setState({ visionApiData: data });

      if (this.state.visionApiData) {
        this.setState({
          uploadMessage: "Изображение обработано, данные получены!",
          uploadMessageClass: "success",
          dataReceived: true
        });
        console.log(data.adult.getItem("racyScore"));
      } else {
        this.setState({
          uploadMessage: "sorry something went wrong computer vision api",
          uploadMessageClass: "error"
        });
      }
    } catch (err) {
      //console.log(err);
    }
  }


  async getDataFromJSON(){

    if(this.state.dataReceived){
      return '<span className="jsonRes">JSON Result</span>' +
          '<JSONPretty id="json-pretty" data={this.state.visionApiData}/>'
    }
  }

  render() {
    return (

        <div className="App">
          <div className="header">
            <p>Computer Vision</p>
            <img className='infoIco' id="infoIco" onClick={function () {
              alert("Компьютерное зрение — теория и технология создания машин, которые могут производить обнаружение, отслеживание и классификацию объектов. Как научная дисциплина, компьютерное зрение относится к теории и технологии создания искусственных систем, которые получают информацию из изображений.")
            }} src={info} alt="infoIco"/>
          </div>

          <div className="row">
            <div className="pictureDiv col-12 col-md-6">
              <h4>Image</h4>
              <div className="imageBox">
                <img src={this.state.imageUrl} alt={this.state.imageUrl==="" ? "" : "Couldnt find image" } />
              </div>
            </div>
            <div className="infoDiv col-12 col-md-6">
              <p>
                Загрузите картинку, чтобы увидеть анализ изображения, полученного с помощью Microsoft Computer Vision API.
              </p>

              <h4>Upload Image</h4>
              <div className="input-group uploadGroup">
                <div className="input-group-prepend">
                        <span onClick={this.fileUploadHandler} className="input-group-text uploadBtn" id="inputGroupFileAddon01">
                            Upload
                        </span>
                </div>
                <div className="custom-file">
                  <input onChange={this.fileSelectedHandler} type="file" className="custom-file-input uploadInput" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
                  <label className="custom-file-label" htmlFor="inputGroupFile01">
                    {this.state.selectedFile ? this.state.selectedFile.name : ""}
                  </label>
                </div>
              </div>

              <h5 className={this.state.uploadMessageClass}>
                {this.state.uploadMessage}
                <span className="scrollDownMessage">
                        {this.state.dataReceived ? " (Пролистайте вниз, чтобы увидеть результаты)" : ""}
                    </span>
              </h5>

              <h4>Какие данные можно получить с помощью данного API?</h4>
              <ul>
                <li>
                  <strong>Categories</strong> - классификация содержания изображения
                </li>
                <li>
                  <strong>Tags</strong> - подробный списком слов, относящихся к содержимому изображения
                </li>
                <li>
                  <strong>Description</strong> - описание изображения одним предложением на английском
                </li>
                <li>
                  <strong>Faces</strong> - определяет наличие лиц. Если они присутствуют, генерирует координаты, пол и возраст
                </li>
                <li>
                  <strong>Color</strong> - определяет фоновый цвет, доминирующий цвет, и является ли изображение черно-белым
                </li>
                <li>
                  <strong>Adult</strong> - определяет, является ли изображение порнографическим. Обнаруживается также сексуально непристойное содержание.
                </li>
                <li>
                  <strong>Celebrities</strong> - идентифицирует знаменитостей, если они определены на изображении
                </li>
                <li>
                  <strong>Landmarks</strong>- идентифицирует достопримечательности, если они обнаружены на изображении
                </li>
              </ul>
            </div>
          </div>
          <hr />
          <div className="jsonDiv">
            <span className="jsonRes">JSON Result</span>
            <JSONPretty id="json-pretty" data={this.state.visionApiData}/>
          </div>
        </div>
    );
  }
}

export default App;
