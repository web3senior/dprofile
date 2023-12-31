import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Web5 } from '@web5/api'
import toast from 'react-hot-toast'

export const AuthContext = React.createContext()
export function useAuth() {
  return useContext(AuthContext)
}

export const isConnected = async () => localStorage.getItem('agentConnected')
export const localUserDid = async () => localStorage.getItem('userDid')

export const protocolDefinition = {
  protocol: 'https://mintdid.me/v59/',
  published: true,
  types: {
    profile: {
      schema: 'https://mintdid.me/schemas/profileSchema',
      dataFormats: ['application/json'],
    },
  },
  structure: {
    profile: {
      $actions: [
        {
          who: 'anyone',
          can: 'read',
        },
        {
          who: 'anyone',
          can: 'write',
        },
        {
          who: 'author',
          of: 'profile',
          can: 'delete',
        },
        {
          who: 'author',
          of: 'profile',
          can: 'update',
        },
      ],
    },
  },
}

export function AuthProvider({ children }) {
  const [web5, setWeb5] = useState()
  const [userDid, setUserDid] = useState()
  const [profile, setProfile] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isConnectedAgent, setIsConnectedAgent] = useState(false)
  const [userDidLocal, setUserDidLocal] = useState(null)
  const [mintDIDnode, setMintDIDnode] = useState(
    'did:ion:EiCWZDE9w2ZMEzhqouvt-ZRJyCnAigaY4eSxmj-T7m1L4w:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiMV9ONVl0ZGdUU1ZON1lLY1NzdVpjR3JqVFhQX3lIck40dDRiVzBaUFFOayJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifSx7ImlkIjoiZHduLWVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI3c2kyZHk1N05rQUt1ckxnZTN5TFV5WHlBMDBkV29xaUdTWVNVTS1hTTNRIiwieSI6InN3S19acU5ESUtPMVZYY0FPbDVMb29DR3BaZ2RuSEVXWVBsTzNUMkZnQXcifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7ImVuY3J5cHRpb25LZXlzIjpbIiNkd24tZW5jIl0sIm5vZGVzIjpbImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduNiIsImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduNCJdLCJzaWduaW5nS2V5cyI6WyIjZHduLXNpZyJdfSwidHlwZSI6IkRlY2VudHJhbGl6ZWRXZWJOb2RlIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlEWEZROElrOVpHeUVfbWpjLXJ0cTVGWUdSMkVEbnNfeVEwU0NMcWQ1Tm9GUSJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpRHlKRTJzNGlHcWNBZGpTOC1RU1NLcVljUHhvZzV3OF95cjA1YUhXLUY1U1EiLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUFzTHZhdm1BWTFJYXRlMmV6c1I2X0cxYjFqYl9mSWlfZUotU3RyRTlNSl9BIn19'
  )
  const navigate = useNavigate()
  const location = useLocation()

  function logout() {
    localStorage.removeItem('userDid')
    localStorage.removeItem('agentConnected')
    navigate('/home')
    setWeb5('')
    setUserDid('')
  }

  const configureProtocol = async () => {
    connectAgent().then(async (web5) => {
      const { protocols, status } = await web5.dwn.protocols.query({
        message: {
          filter: {
            protocol: protocolDefinition.protocol,
          },
        },
      })

      if (status.code !== 200) {
        alert('Error querying protocols')
        console.error('Error querying protocols', status)
        return
      }

      // if the protocol already exists, we return
      if (protocols.length > 0) {
        console.log('Protocol already exists')
        return
      }

      // configure protocol on local DWN
      const { status: configureStatus, protocol } = await web5.dwn.protocols.configure({
        message: {
          definition: protocolDefinition,
        },
      })

      console.log('Protocol configured', configureStatus, protocol)
      let res = await protocol.send(mintDIDnode) //sends protocol to remote DWNs immediately (vs waiting for sync)
      console.log(res)
    })
  }
  // Reads the indicated record from the user's DWNs
  const readProfile = async () => {
    connectAgent().then(async (web5) => {
      let readingProfileToast = toast.loading(`Reading recent profiles...`)
      const response = await web5.dwn.records.query({
        from: mintDIDnode,
        message: {
          filter: {
            dataFormat: 'application/json',
            protocol: protocolDefinition.protocol,
          },
          dateSort: 'createdDescending',
        },
      })
      console.log(response)

      if (response.records.length < 1) {
        toast.dismiss(readingProfileToast)
        toast(`There is no record`, { icon: '⚠️' })
        return false
      }

      let profiles = []
      return response.records.forEach(async (record, i) => {
        let recordData = await record.data.json()
        recordData.recordId = record._recordId
        recordData.author = record.author

        profiles.push(recordData)
        if (++i === response.records.length) {
          setProfile(profiles.slice(0, 8))
          console.log(profiles)
          toast.dismiss(readingProfileToast)
        }
      })
    })
  }

  const readUserProfile = async (recordId) => {
    return connectAgent().then(async (web5) => {
      let readingProfileToast = toast.loading(`Reading user's profiles...`)
      const response = await web5.dwn.records.query({
        from: mintDIDnode,
        message: {
          filter: {
            dataFormat: 'application/json',
            protocol: protocolDefinition.protocol,
            recordId: recordId,
          },
        },
      })
      console.log(response)
      toast.dismiss(readingProfileToast)

      if (response.records.length < 1) return false

      let recordData = await response.records[0].data.json()
      recordData.recordId = response.records[0]._recordId
      recordData.author = response.records[0].author
      return recordData
    })
  }
  /**
   * Initialize the web5
   * @returns
   */
  const connectAgent = async () => {
    let loadingToast = toast.loading('Connecting to agent...')

    try {
      console.group('Initialize Web5')
      const { web5, did: userDid } = await Web5.connect({ sync: '5s' })
      console.log(web5, userDid)
      localStorage.setItem('agentConnected', true)
      localStorage.setItem('userDid', userDid)
      setWeb5(web5)
      setUserDid(userDid)
      toast.success(`Connected`, { icon: '✅' })
      toast.dismiss(loadingToast)
      return web5
    } catch (error) {
      toast.error(error.message)
      toast.dismiss(loadingToast)
    }
  }

  useEffect(() => {
    isConnected().then((res) => {
      setIsConnectedAgent(res)
    })
    localUserDid().then((res) => {
      setUserDidLocal(res)
    })
  }, [])

  const value = {
    web5,
    setWeb5,
    userDid,
    setUserDid,
    mintDIDnode,
    readProfile,
    readUserProfile,
    protocolDefinition,
    isConnectedAgent,
    configureProtocol,
    userDidLocal,
    isConnected,
    localUserDid,
    profile,
    setProfile,
    connectAgent,
    logout,
  }

  // if (!web5) return <>Loading... !user</>

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
