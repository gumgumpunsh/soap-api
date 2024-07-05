function createSoapEnvelope(action, body) {
  return `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        ${body}
      </soap:Body>
    </soap:Envelope>
  `;
}

function getCharacter() {
  const characterId = document.getElementById('character-id').value;
  if (!characterId) {
    alert('Please enter a character ID');
    return;
  }

  const soapBody = `
    <getCharacter xmlns="http://www.example.org/CharacterService/">
      <id>${characterId}</id>
    </getCharacter>
  `;

  const soapEnvelope = createSoapEnvelope('getCharacter', soapBody);

  axios.post('http://localhost:3001/wsdl', soapEnvelope, {
    headers: { 'Content-Type': 'text/xml' }
  })
  .then(response => {
    console.log('Raw response:', response.data);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');
    console.log('Parsed XML:', xmlDoc);

    const result = xmlDoc.getElementsByTagNameNS('*', 'getCharacterResponse')[0];
    console.log('Parsed result:', result);

    if (result) {
      const id = result.getElementsByTagNameNS('*', 'id')[0]?.textContent || 'N/A';
      const name = result.getElementsByTagNameNS('*', 'name')[0]?.textContent || 'N/A';
      const game = result.getElementsByTagNameNS('*', 'game')[0]?.textContent || 'N/A';
      const power = result.getElementsByTagNameNS('*', 'power')[0]?.textContent || 'N/A';
      displayResult(`ID: ${id}, Name: ${name}, Game: ${game}, Power: ${power}`);
    } else {
      displayResult('Character not found');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    displayResult('An error occurred');
  });
}

function listCharacters() {
  const soapBody = `
    <listCharacters xmlns="http://www.example.org/CharacterService/" />
  `;

  const soapEnvelope = createSoapEnvelope('listCharacters', soapBody);

  axios.post('http://localhost:3001/wsdl', soapEnvelope, {
    headers: { 'Content-Type': 'text/xml' }
  })
  .then(response => {
    console.log('Raw response:', response.data);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');
    console.log('Parsed XML:', xmlDoc);

    const result = xmlDoc.getElementsByTagNameNS('*', 'listCharactersResponse')[0];
    console.log('Parsed result:', result);

    if (result) {
      const characters = result.getElementsByTagNameNS('*', 'characters')[0]?.childNodes || [];
      let output = '';
      for (let i = 0; i < characters.length; i++) {
        const character = characters[i];
        const id = character.getElementsByTagNameNS('*', 'id')[0]?.textContent || 'N/A';
        const name = character.getElementsByTagNameNS('*', 'name')[0]?.textContent || 'N/A';
        const game = character.getElementsByTagNameNS('*', 'game')[0]?.textContent || 'N/A';
        const power = character.getElementsByTagNameNS('*', 'power')[0]?.textContent || 'N/A';
        output += `ID: ${id}, Name: ${name}, Game: ${game}, Power: ${power}<br>`;
      }
      displayResult(output);
    } else {
      displayResult('No characters found');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    displayResult('An error occurred');
  });
}

function displayResult(result) {
  document.getElementById('result').innerHTML = result;
}
