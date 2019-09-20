const xss = require('xss')

const Utils = {
  serialize(object){
    let newObject = {};
    for (const key of Object.keys(object)){
      newObject[key] = typeof object[key] === 'string' ? xss(object[key]) : object[key];
    }
    return newObject;
  },
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
  },
  generateHtml(list){
    const rows = list.map(obj => {
      return `<tr>
        <td>${obj.client.full_name}</td>
        <td>${obj.subtotal}</td>
        <td>${obj.tax}</td>
        <td>${obj.total}</td>
        <td>${obj.observation}</td>
      </tr>`
    }).join('');
    let html = `<html>
      <head>
      <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }

      tr:nth-child(even) {
        background-color: #dddddd;
      }
      </style>
      </head>
      <body>

      <h2>Report</h2>

      <table>
        <tr>
          <th>Client</th>
          <th>Subtotal</th>
          <th>Tax</th>
          <th>Total</th>
          <th>Observation</th>
        </tr>
        ${rows}
      </table>

      </body>
      </html>`
    return html;
  }
}

module.exports = Utils;
