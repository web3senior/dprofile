import { useEffect, useState } from 'react'
import { useNavigate, defer, useLoaderData, Link } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import Loading from './components/LoadingSpinner'
import { CheckIcon, ChromeIcon, BraveIcon } from './components/icons'
import toast, { Toaster } from 'react-hot-toast'
import LogoCover from './../../src/assets/mindidchain.png'
import UserProfileMonochrome from './../../src/assets/user-profile-monochrome.svg'
import styles from './Home.module.scss'
import Shimmer from './helper/Shimmer'
import { useAuth, protocolDefinition } from './../contexts/AuthContext'
import { Web5 } from '@web5/api'

export const loader = async () => {
  return defer({
    key: await [],
  })
}

function Home({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState()
  const [data, setData] = useState([])
  const [activeRecipient, setActiveRecipient] = useState(null)
  const auth = useAuth()
  const navigate = useNavigate()

  const handleFilter = (e) => {
    let filterValue = e.target.value.toString().toLowerCase()

    if (filterValue === '') {
      e.target.disabled = true
      auth.readProfile().then((e.target.disabled = false))
      return
    }

    let data = auth.profileBackup.filter((item) => {
      if ((item.handler.toLowerCase() && item.handler.search(filterValue) > -1) || item.author.toLowerCase() === filterValue) return true
      else return false
    })

    auth.setProfile(data)
  }

  useEffect(() => {
    auth.isConnected().then((bool) => {
      if (bool) auth.readProfile()
    })
  }, [])

  return (
    <>
      {isLoading && <Loading />}

      <section className={styles.section}>
        <div className={`__container`} data-width="medium">
          <div className={`${styles.discover} text-center d-flex flex-column align-items-center justify-content-center`}>
            <figure>
              <img alt={import.meta.env.VITE_NAME} src={LogoCover} className={styles.heroImage} />
            </figure>
            <input type="text" placeholder="Discover profile by DIDs or handler" onChange={(e) => handleFilter(e)} />
          </div>
        </div>

        <div className={`__container text-center`} data-width="large">
          <div className={`${styles.did} grid grid--fill`} style={{ '--data-width': '140px' }}>
            {auth.profile &&
              auth.profile.length > 0 &&
              auth.profile.map((item, i) => (
                <Link to={`/record/${item.recordId}`} title={item.Bio} key={i}>
                  <div className={`${styles.didItem} card`}>
                    <div className="card__body text-center">
                      <figure>
                        <img alt={import.meta.env.VITE_NAME} src={item.picture ? item.picture : UserProfileMonochrome} />
                      </figure>
                      <p>{item.fullname}</p>
                    </div>
                  </div>
                </Link>
              ))}

            {!auth.profile && (
              <>
                {[0, 0, 0, 0, 0, 0].map((item, i) => (
                  <div className={`card`} key={i}>
                    <Shimmer>
                      <div className={styles.didItemShimmer}></div>
                    </Shimmer>
                  </div>
                ))}
              </>
            )}
          </div>

          <p className="mt-40">Shape your decentralized identity on your local node then sync it with universe</p>

          <button className="mt-20" onClick={() => navigate(`/new`)}>
            Create
          </button>
        </div>
      </section>
    </>
  )
}

export default Home
