const Alert = require("Alert")

class Scheduler extends EventEmitter{
  constructor(){
    this.list = [];
  }

  setSchedule(alert){
    this.list.push(alert);
  }


}