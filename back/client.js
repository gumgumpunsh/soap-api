// client.js
const soap = require('soap');

const url = 'http://localhost:3000/wsdl?wsdl';

soap.createClient(url, (err, client) => {
  if (err) throw err;

  // Test getCharacter
  client.getCharacter({ id: 1 }, (err, response) => {
    if (err) throw err;
    console.log('getCharacter Response:', response);
  });

  // Test listCharacters
  client.listCharacters({}, (err, response) => {
    if (err) throw err;
    console.log('listCharacters Response:', response);
  });
});
