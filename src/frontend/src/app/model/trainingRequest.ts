export class TrainingRequest {
    _id : string 
    imageName : string 
    status : string 
    computingTime : string 
    /*date : string*/

    constructor(_id : string, imageName : string, status : string, computingTime : string/*, date : string*/){
        this._id = _id
        this.imageName = imageName
        this.status = status
        this.computingTime = computingTime
        /*this.date = date*/
    }
}