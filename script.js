const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");

// form click event
form.addEventListener("click", () =>{
  fileInput.click();
});

fileInput.onchange = ({target})=>{
  let file = target.files[0]; //getting file [0] this means if user has selected multiple files then get first one only
  if(file){
    let fileName = file.name; //getting file name
    if(fileName.length >= 12){ //if file name length is greater than 12 then split it and add ...
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    document.getElementById('fileName').innerHTML = 'Name: ' + fileName;
    document.getElementById('fileDate').innerHTML = 'Date: ' + new Date(file.lastModified);
  }
}

// file upload function
function uploadFile(){
  document.getElementById('progress').innerHTML = 'Progress';
  let xhr = new XMLHttpRequest(); //creating new xhr object (AJAX)
  xhr.open("POST", "php/server.php"); //sending post request to the specified URL
  xhr.addEventListener("load", uploadComplete, false);
  xhr.addEventListener("error", uploadFailed, false);
  xhr.addEventListener("abort", uploadCanceled, false);
  xhr.upload.addEventListener("progress", uploadProgress, false);
  let data = new FormData(form); //FormData is an object to easily send form data
  xhr.send(data); //sending form data
}

function uploadProgress(evt) {
  let name = fileInput.files[0].name; //getting file name
  let loaded = evt.loaded; //getting loaded data size
  let total = evt.total; //getting total data size
  let fileLoaded = Math.floor((loaded / total) * 100);  //getting percentage of loaded file size
    let progressHTML = `<li class="row">
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    // uploadedArea.innerHTML = ""; //uncomment this line if you don't want to show upload history
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
    if(loaded == total){
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                              </div>
                            </div>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      // uploadedArea.innerHTML = uploadedHTML; //uncomment this line if you don't want to show upload history
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML); //remove this line if you don't want to show upload history
    }
}

function uploadComplete(evt) {
  /* This event is raised when the server send back a response */
  alert("Success!");
}

function uploadFailed(evt) {
  alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
    alert("The upload has been canceled by the user or the browser dropped the connection.");
}
