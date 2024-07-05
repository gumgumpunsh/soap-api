// server.js
const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser');
const characters = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;

//CORS policy
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Middleware
app.use(bodyParser.raw({ type: () => true, limit: '5mb' }));

// Define the SOAP service
const service = {
  CharacterService: {
    CharacterServiceSoapPort: {
      getCharacter(args) {
        const character = characters.find(char => char.id === parseInt(args.id));
        if (character) {
          return {
            id: character.id,
            name: character.name,
            game: character.game,
            power: character.power,
          };
        }
        return { message: 'Character not found' };
      },
      listCharacters() {
        return { characters };
      }
    }
  }
};

// WSDL (Web Services Description Language) file content
const xml = `
<definitions name="CharacterService"
  targetNamespace="http://www.example.org/CharacterService/"
  xmlns:tns="http://www.example.org/CharacterService/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns="http://schemas.xmlsoap.org/wsdl/">

  <message name="getCharacterRequest">
    <part name="id" type="xsd:int"/>
  </message>
  <message name="getCharacterResponse">
    <part name="id" type="xsd:int"/>
    <part name="name" type="xsd:string"/>
    <part name="game" type="xsd:string"/>
    <part name="power" type="xsd:string"/>
    <part name="message" type="xsd:string"/>
  </message>
  <message name="listCharactersResponse">
    <part name="characters" type="tns:CharacterArray"/>
  </message>

  <portType name="CharacterServicePortType">
    <operation name="getCharacter">
      <input message="tns:getCharacterRequest"/>
      <output message="tns:getCharacterResponse"/>
    </operation>
    <operation name="listCharacters">
      <input message="tns:emptyRequest"/>
      <output message="tns:listCharactersResponse"/>
    </operation>
  </portType>

  <binding name="CharacterServiceSoapBinding" type="tns:CharacterServicePortType">
    <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="getCharacter">
      <soap:operation soapAction="getCharacter"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
    <operation name="listCharacters">
      <soap:operation soapAction="listCharacters"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
  </binding>

  <service name="CharacterService">
    <port name="CharacterServiceSoapPort" binding="tns:CharacterServiceSoapBinding">
      <soap:address location="http://localhost:${PORT}/wsdl"/>
    </port>
  </service>
</definitions>
`;

// Create SOAP server and listen for requests
app.listen(PORT, () => {
  const wsdlPath = '/wsdl';
  soap.listen(app, wsdlPath, service, xml);
  console.log(`Server started on port ${PORT}`);
  console.log(`WSDL available at http://localhost:${PORT}${wsdlPath}?wsdl`);
});
