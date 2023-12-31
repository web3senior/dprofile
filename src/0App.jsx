import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Web5 } from "@web5/api";

const protocolDefinition = {
  "protocol": "https://mintdid.me",
  "published": true,
  "types": {
    "profile": {
      "schema": "https://mintdid.me/schemas/profileSchema",
      "dataFormats": ["application/json"]
    }
  },
  "structure": {
    "profile": {
      "$actions": [
        {
          "who": "anyone",
          "can": "read"
        },
        {
          "who": "anyone",
          "can": "write"
        }
      ]
    }
  }
}

function App() {
  const [web5, setWeb5] = useState()
  const [myDid, setMyDid] = useState('') //did:ion:EiCCc4XE94c1wB92Gx_-DJEQuc2TIIoS_JGJptyftcUxFw:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiMERSOXYyYlhqOTRCVzBkeUJ4SWJBR1pBTW1uc3FzUDh5QU5ZUk96VmpSUSJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifSx7ImlkIjoiZHduLWVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI0WFJKMVRoZEw4SlFOVTJEaDYzSFRUNUx0cUQybHNqYk9HWW5XaDkxTDE4IiwieSI6IlBRbG1RajlVVVZiemVVY3Y2ejNsXzYyTlBneldYWkRDRHFoR0M5dEZHU0kifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7ImVuY3J5cHRpb25LZXlzIjpbIiNkd24tZW5jIl0sIm5vZGVzIjpbImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduMyIsImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduMSJdLCJzaWduaW5nS2V5cyI6WyIjZHduLXNpZyJdfSwidHlwZSI6IkRlY2VudHJhbGl6ZWRXZWJOb2RlIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlEZjZGSVVDcnRiQlhiVzZsLTg0S01IaVgzeDBnX3doV2ZhNHo0SmMwVkNXdyJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpQ0NJTGhZNzFOS202WE44SkxsNTlpUC14WkxEbUYxREx3MmMyVGxjZWtvTnciLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUI4ZTV6UUxKcGVfYk43WTJzRzNieEFaY2lvWW00VmV4dzFXNVRmNl9ab253In19
  const [activeRecipient, setActiveRecipient] = useState(null)
  const [mintDIDnode, setMintDIDnode] = useState(
    'did:ion:EiCWZDE9w2ZMEzhqouvt-ZRJyCnAigaY4eSxmj-T7m1L4w:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiMV9ONVl0ZGdUU1ZON1lLY1NzdVpjR3JqVFhQX3lIck40dDRiVzBaUFFOayJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifSx7ImlkIjoiZHduLWVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI3c2kyZHk1N05rQUt1ckxnZTN5TFV5WHlBMDBkV29xaUdTWVNVTS1hTTNRIiwieSI6InN3S19acU5ESUtPMVZYY0FPbDVMb29DR3BaZ2RuSEVXWVBsTzNUMkZnQXcifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7ImVuY3J5cHRpb25LZXlzIjpbIiNkd24tZW5jIl0sIm5vZGVzIjpbImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduNiIsImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduNCJdLCJzaWduaW5nS2V5cyI6WyIjZHduLXNpZyJdfSwidHlwZSI6IkRlY2VudHJhbGl6ZWRXZWJOb2RlIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlEWEZROElrOVpHeUVfbWpjLXJ0cTVGWUdSMkVEbnNfeVEwU0NMcWQ1Tm9GUSJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpRHlKRTJzNGlHcWNBZGpTOC1RU1NLcVljUHhvZzV3OF95cjA1YUhXLUY1U1EiLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUFzTHZhdm1BWTFJYXRlMmV6c1I2X0cxYjFqYl9mSWlfZUotU3RyRTlNSl9BIn19'
  )

  const connect = async () => {
    console.group('Initialize Web5')
    const { web5, did: userDid } = await Web5.connect({
      sync: '5s',
    })
    console.log(web5)
    setWeb5(web5)
    setMyDid(userDid)
    //console.log(userDid)
    return web5
  }

  const createDid = async () => {
    //Creates a DID using the did:ion method
    const didIon = await DidIonMethod.create()
    console.log(didIon)
    //DID and its associated data which can be exported and used in different contexts/apps
    const portableDID = JSON.stringify(didIon)

    //DID string
    const did = didIon.did

    //DID Document
    const didDocument = JSON.stringify(didIon.document)

    //Cryptographic keys associated with DID
    const keys = JSON.stringify(didIon.keySet)

    //Primary form of a DID. more info: https://www.w3.org/TR/did-core/#dfn-canonicalid
    const canonicalId = didIon.canonicalId
  }


  const updateDWN = async () => {
    // Get the record
    const { record } = await web5.dwn.records.read({
      message: {
        filter: {
          recordId: 'bafyreigza2b72b7vnvjidhvweg4if37kd2i37rxinxuqtra3ktj3dln7ja', //createdRecord.id
        },
      },
    })

    // Update the record
    const { status } = await record.update({
      data: {
        '@type': 'profile',
        fullname: 'Amir Rahimi',
        Bio: 'Full-stack web3 & web5 developer',
        gender: 'male',
        Age: 29,
        author: myDid,
        //  "recipient": newTodo.value.recipientDID,
      },
    })
    console.log(status)
  }

  const discover = async () => {
    connect().then(async (web5) => {
      const resolution = await web5.did.resolve(document.querySelector("input[name='did']").value)
      const didDocument = resolution.didDocument
      console.log(didDocument)
    })
  }

  const sendMsg = async (who) => {
    const aliceDid =
      'did:ion:EiAkGZbA3dnI9QR6z_u4nUcb77sPZ5dchMzH3gzwdFdfQg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiWmZCcGJ2dGJ4alYtNlJZdnd6RDVZNjE4dUtMeG5SWnlWNDlVVzl6X1ZYOCJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiIsImFzc2VydGlvbk1ldGhvZCJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQk9KUExLQnczUVFwOVl6SjVjOVk3N3RxdW5wZ2xmMnBubFc0bTVWMkRPV1EifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUJSM0xVdWVmemdPMVYyZzBhTUN5UTczZDBmbFNVQ3BFS24zTUg1Z0tVVmpRIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlDdkRsSEh4VXNwUUl4SVJtT3paOHJJYmc0bllydGRYTE1KaFhtSUNyYW0ydyJ9fQ'
    const bobDid = myDid

    if (who === 'bob') {
    } else if (who === 'alice') {
    }
    connect().then(async (web5) => {
      const { record } = await web5.dwn.records.create({
        data: 'this record will be written to the local DWN',
        message: {
          dataFormat: 'text/plain',
        },
      })
      console.log(record)
      //send record to recipient's DWN
      const { status } = await record.send(aliceDid)
      console.log(status)
    })
  }
  const syncMsg = async () => {}

  const recover = async () => {
    const didMethod = 'ion' // The DID method you want to use
    const privateKeyJwk = {
      d: 'lzLcrwQMiGqq818b83M1KFOLX5M4GPDScKX4o3rKQss',
      alg: 'ES256K',
      crv: 'secp256k1',
      kty: 'EC',
      ext: 'true',
      key_ops: ['sign'],
      x: 'VnMScCD7pyHxdlCgBhTAy35cxpYkgFDUBR0MBxE82cs',
      y: 'zwH40FWcM0GLQiM41hbrVXjW9l_mBx_MAbJCmgNQLTE',
      kid: 'ion-recovery-1',
    }
    // Recover the DID using the privateKeyJwk

    const myDid = await Web5.did.recover(didMethod, privateKeyJwk)
    console.log(myDid)
  }

  // const installProtocol = async () => {
  //   const { protocol, status } = await web5.dwn.protocols.configure({
  //     message: {
  //       definition: protocolDefinition
  //     }
  // });

  // console.log(protocol, status)

  // let res = await protocol.send(myDid);
  // console.log(res, myDid)
  // }

  useEffect(() => {
    connect()
  }, [])


  return (
    <>
    <fieldset>
      <legend>PROTOCOL & DWN</legend>
      <div>
        <button onClick={() => configureProtocol()}>install a protocol</button>
      </div>
    </fieldset>

    <hr />

    <fieldset>
      <legend>Bob BOX</legend>
      <div>
        <p>Alice messages:</p>
        <input type="text" name="bob_msg" />
        <button onClick={() => sendMsg('bob')}>Send msg</button>
        <button onClick={() => syncMsg('bob')}>Sysnc msg</button>
      </div>
    </fieldset>

    <fieldset style={{ border: '1px dashed pink' }}>
      <legend>Alice BOX</legend>
      <div>
        <p>Bob messages:</p>
        <input type="text" name="alice_msg" />
        <button onClick={() => sendMsg('alice')}>Send msg</button>
        <button onClick={() => syncMsg('alice')}>Sysnc msg</button>
      </div>
    </fieldset>

    <fieldset>
      <p>1- Create a profile</p>
      <p>2- Add your bio/ put a username (DID shorter)</p>
      <p>3- Own your data</p>
      <legend>Search</legend>
      <div>
        <input placeholder="user's DID" defaultValue={myDid} name="did" />
        <button onClick={() => discover()}>Search</button>
      </div>
    </fieldset>

    <fieldset>
      <legend>DID</legend>
      <div>
        <button onClick={() => connect()}>Connect</button>
      </div>
    </fieldset>

    <fieldset>
      <legend>DID</legend>
      <div>
        <textarea name="" id="" cols="30" rows="10" defaultValue={myDid}></textarea>
        <button onClick={() => createDid()}>Create DID</button>
      </div>
    </fieldset>

    <fieldset>
      <legend>DWN</legend>
      <div>
        <button onClick={() => DWN()}>Create Record</button>
        <button onClick={() => DWNread()}>Read Recortd</button>
        <button onClick={() => updateDWN()}>update Recortd</button>
      </div>
    </fieldset>

    <fieldset>
      <legend>Recovery DID</legend>
      <div>
        <button onClick={() => recover()}>Recover</button>
      </div>
    </fieldset>
  </>
  );
}

export default App;
