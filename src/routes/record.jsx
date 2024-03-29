import { Suspense, useState, useEffect } from 'react'
import { useLoaderData, defer, Await, useNavigate, useParams } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import LoadingSpinner from './components/LoadingSpinner'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Shimmer from './helper/Shimmer'
import Icon from './helper/MaterialIcon'
import UserProfileMonochrome from './../../src/assets/user-profile-monochrome.svg'
import TbdBadge from './../../src/assets/tbd-badge.svg'
import DprofileBadge from './../../src/assets/dprofile-badge.svg'

import styles from './Record.module.scss'
import Loading from './components/LoadingSpinner'

export const loader = async ({ request, params }) => {
  return defer({
    someDataHere: [],
  })
}

export default function Profile({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState()
  const [pfp, setPfp] = useState(null)
  const [modal, setModal] = useState(false)
  const auth = useAuth()
  const params = useParams()
  const navigate = useNavigate()

  const handleUpdate = async (recordId) => {
    /*   const { record } = await auth.web5.dwn.records.read({
      message: {
        filter: {
          recordId: recordId,
          author: auth.userDid,
        },
      },
    })

    const { status } = await record.update({data:{
      '@type': 'profile',
      fullname: document.querySelector('[name="fullname"]').value,
      bio: document.querySelector('[name="bio"]').value,
      gender: document.querySelector('[name="gender"]').value,
      age: document.querySelector('[name="age"]').value,
      handler: document.querySelector('[name="handler"]').value,
      picture: pfp === null ? document.querySelector('[name="pfp_hidden"]').value : pfp,
    }})
    console.log(status)*/
    // Update doesn't work properly so I have to delete the RECORD then recreate it like update/ overwrite
    handleDelete(recordId).then((response) => {
      if (response.status.code === 202 && response.status.detail === 'Accepted') {
        handleNew()
      }
    })
  }

  const handleNew = async () => {
    console.log(document.querySelector('[name="bio"]').value)
    const profileData = {
      '@type': 'profile',
      fullname: document.querySelector('[name="fullname"]').value,
      bio: document.querySelector('[name="bio"]').value,
      gender: document.querySelector('[name="gender"]').value,
      age: document.querySelector('[name="age"]').value,
      handler: document.querySelector('[name="handler"]').value,
      picture: pfp === null ? document.querySelector('[name="pfp_hidden"]').value : pfp,
      author: auth.userDid,
      recipient: auth.mintDIDnode,
    }
    const { record } = await auth.web5.dwn.records.create({
      data: profileData,
      message: {
        published: true,
        protocol: auth.protocolDefinition.protocol,
        protocolPath: 'profile',
        schema: auth.protocolDefinition.types.profile.schema,
        dataFormat: auth.protocolDefinition.types.profile.dataFormats[0],
        author: auth.userDid,
        recipient: auth.mintDIDnode,
      },
      encryption: {
        enabled: true,
      },
    })
    console.log(record)

    const { status } = await record.send(auth.mintDIDnode)
    console.log(status)
    if (status.code === 202 && status.detail === 'Accepted') {
      navigate('/home')
    }

    return record
  }

  const handleDelete = async (recordId) => {
    // let deleteToast = toast.loading(`Deleting your profile...`)
    const response = await auth.web5.dwn.records.delete({
      from: auth.mintDIDnode,
      message: {
        recordId: recordId,
        author: auth.userDid,
      },
    })
    console.log(response)
    if (response.status.code === 202 && response.status.detail === 'Accepted') {
      toast.success(`Your profile deleted successfully`)
      // toast.dismiss(deleteToast)
    } else toast.error(response.status.detail)
    return response
  }
  function readFile(e) {
    console.log(e)

    if (!e.target.files || !e.target.files[0]) return

    const FR = new FileReader()

    FR.addEventListener('load', function (evt) {
      document.querySelector('#pfpImg').src = evt.target.result
      console.log(evt.target.result)
      setPfp(evt.target.result)
    })

    FR.readAsDataURL(e.target.files[0])
  }
  useEffect(() => {
    auth.readUserProfile(params.recordId).then((res) => {
      console.log(res)
      setData(res)
    })
  }, [])

  return (
    <section className={`${styles.section} animate fade`}>
      {modal && (
        <>
          <div className={styles.overlay}>
            <div className={`${styles.overlayContainer} card`}>
              <div className="card__header">
                <b>Add your UPcard name, symbol, and count 🦄</b>
              </div>
              <div className="card__body">{data && data.length === 1 && <>333</>}</div>
            </div>
          </div>
        </>
      )}

      <div className={`__container`} data-width="medium">
        <div className={`${styles.user} card`}>
          {data && (
            <>
              <div className="card__header">
                <b>{data.fullname}</b>
              </div>
              <div className="card__body">
                <div className={`${styles.didItem} card`}>
                  <div className="card__body">
                    <ul className=" d-flex flex-column align-items-center justify-content-center" style={{ rowGap: '1rem' }}>
                      <li className="d-flex" style={{ width: '100%' }}>
                        <figure>
                          <img id="pfpImg" className={styles.pfpImg} alt={import.meta.env.VITE_NAME} src={data.picture ? data.picture : UserProfileMonochrome} />
                          <label htmlFor="pfp">Profile Pciture</label>
                          <input id="pfp" type="file" onChange={(e) => readFile(e)} />
                          <input type="hidden" name="pfp_hidden" defaultValue={data.picture} />
                        </figure>

                        <figure>
                          <img src={`https://chart.googleapis.com/chart?cht=qr&chs=277x277&chl=${data.author}`} />
                        </figure>
                      </li>
                      <li style={{ width: '100%' }}>
                        <label htmlFor="">Fullname</label>
                        <input type="text" defaultValue={data.fullname} name="fullname" />
                      </li>
                      <li style={{ width: '100%' }}>
                        <label htmlFor="">Handler</label>
                        <input type="text" defaultValue={data.handler} name="handler" />
                      </li>
                      <li style={{ width: '100%' }}>
                        <label htmlFor="">Bio</label>
                        <textarea name="bio" id="" cols="30" rows="5" defaultValue={data.bio} />
                      </li>
                      <li style={{ width: '100%' }}>
                        <label htmlFor="">Age</label>
                        <input type="number" defaultValue={data.age} name="age" />
                      </li>
                      <li style={{ width: '100%', display: 'none' }}>
                        <label htmlFor="">Gender</label>
                        <select name="gender" id="" defaultValue={data.gender}>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                        </select>
                      </li>
                      <li style={{ width: '100%' }}>
                        <label htmlFor="">Author</label>
                        <input type="text" defaultValue={data.author} name="author" />
                      </li>
                      <li>
                        {data.author === auth.userDid && (
                          <>
                            <button onClick={() => handleUpdate(data.recordId)} className="mr-10">
                              Update
                            </button>
                            <button onClick={() => handleDelete(data.recordId).then(navigate(`/home`))} style={{ background: '#f4f4f4', color: '#333' }}>
                              Delete
                            </button>
                          </>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={`card ${styles.badge}`}>
          <div className="card__header">User's badge (VC)</div>
          <div className="card__body d-flex" style={{ gap: '1rem' }}>
            <figure>
              <img src={TbdBadge} />
            </figure>
            <figure>
              <img src={DprofileBadge} />
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
