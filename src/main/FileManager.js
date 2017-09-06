const fs = require("fs");
const path = require("path");

class FileManager {
  static init(path) {
    if (path) FileManager.path = path

    let dir = fs.readdirSync(path);
    for (let item of dir)
      FileManager.fileList.add(item)

    FileManager.isInit = true;
  }

  static getUniqueFileName(num) {
    let characters = "ABCDEFGHIJKLMNOPQRSTUOWXZY01234556789";
    let fileName = "";

    let index;
    for (let i = 0; i < num; i++) {
      index = Math.floor(Math.random() * characters.length)
      fileName = fileName + characters[index];
    }

    if (FileManager.isInit)
      new Error("FileManager is not init");

    return FileManager.fileList.has(fileName) ? FileManager.getUniqueFileName(num) : fileName;
  }

  static saveFile(fileName, html) {
    // 디렉토리 생성
    fs.mkdirSync(path.join(FileManager.path, fileName));
    // html 파일 저장
    fs.writeFileSync(path.join(FileManager.path, fileName, "sticky.html"), html);
  }

  static loadFile(fileName) {
    return fs.readFileSync(path.join(FileManager.path, fileName, "sticky.html"));
  }

  static updateFile(fileName, html) {
    fs.writeFileSync(path.join(FileManager.path, fileName, "sticky.html"), html);
  }

  static deleteFile(fileName) {
    let items = fs.readdirSync(path.join(FileManager.path, fileName));

    for (let item of items)
      fs.unlinkSync(path.join(FileManager.path, fileName, item));

    fs.rmdirSync(path.join(FileManager.path, fileName));
  }

  static writeOption(fileName, option){
    let JSONString = JSON.stringify(option);
    fs.writeFileSync(path.join(FileManager.path, fileName, "option.json"), JSONString);
  }
  
  static readOption(fileName){
    let JSONString = fs.readFileSync(path.join(FileManager.path, fileName, "option.json"));
    return JSON.parse(JSONString);
  }
  
}
FileManager.isInit = false;
FileManager.fileList = new Set();
FileManager.path = "./";

module.exports = FileManager;