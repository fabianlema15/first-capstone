const xss = require('xss')

const Utils = {
  serialize(object){
    let newObject = {};
    for (const key of Object.keys(object)){
      newObject[key] = typeof object[key] === 'string' ? xss(object[key]) : object[key];
    }
    return newObject;
  },

  /*removeEmpty(requiredFields, completeFields){
    for (const field of Object.keys(requiredFields)){
      if (requiredFields[field] == null){
        delete completeFields[field]
      }else{
        if (typeof requiredFields[field] === 'string' && requiredFields[field].trim() === ''){
          delete completeFields[field];
        }/*else if (typeof requiredFields[field] === 'number' && requiredFields[field] === 0){
          delete completeFields[field];
        }*/
      /*}
    }
    return completeFields;
  },*/

  generateCodeUser(){
    let arrayComplete = [1,2,3,4,5,6,7,8,9,0];
    let i, random;
    let arrayGenerated = [];
    for (i=0; i<4; i++)
    {
      random = Math.floor(Math.random() * arrayComplete.length);
      arrayGenerated.push(arrayComplete[random]);
      arrayComplete.splice(random, 1);
    }
    arrayComplete = arrayGenerated;
    arrayGenerated = [];
    for (i=0; i<6; i++)
    {
      random = Math.floor(Math.random() * arrayComplete.length);
      if (arrayGenerated.findIndex(number => number==arrayComplete[random]) >= 0){
        arrayGenerated.push(arrayComplete[random]);
        arrayComplete.splice(random, 1);
      }else{
        arrayGenerated.push(arrayComplete[random]);
      }
    }
    return arrayGenerated.join('');
  }
}

module.exports = Utils;
