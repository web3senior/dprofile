import { useState, Suspense, useEffect } from 'react'
import { defer, Await, useNavigate, useLoaderData } from 'react-router-dom'
import { getTour } from '../util/api'
import { Title } from './helper/DocumentTitle'
import Shimmer from './helper/Shimmer'
import Icon from './helper/MaterialIcon'
import styles from './Tour.module.scss'

export const loader = async () => {
  return defer({
    tour: [
      {
        name: 'Enhanced User Control and Privacy',
        description:
          "Web5's decentralized identity framework eliminates the reliance on centralized platforms to manage user profiles, empowering users to own and control their personal information. This can significantly enhance privacy and security for decentralized apps (DApps). Users can seamlessly switch between DApps without worrying about their data being shared or accessed without their consent.",
        icon: (
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.5481 15.9423L27.8722 11.5733M40.4545 15.0218L54.5675 30.4884M55.3328 41.7415L40.5453 55.0819M14.2003 26.0934L30.4794 54.4596M16.7297 52.8131L27.6128 57.8563M12.8772 42.2989L31.0761 15.9682M17.0021 22.7486L29.7401 29.9439M41.2587 33.4442L52.4012 34.2869M35.1492 38.8634L35.1621 52.8131M42.7115 9.62861C42.7115 13.7958 39.3316 17.1739 35.1621 17.1739C30.9927 17.1739 27.6128 13.7958 27.6128 9.62861C27.6128 5.46146 30.9927 2.08331 35.1621 2.08331C39.3316 2.08331 42.7115 5.46146 42.7115 9.62861ZM67.5 35.7778C67.5 39.945 64.12 43.3231 59.9506 43.3231C55.7812 43.3231 52.4012 39.945 52.4012 35.7778C52.4012 31.6107 55.7812 28.2326 59.9506 28.2326C64.12 28.2326 67.5 31.6107 67.5 35.7778ZM42.7115 60.3714C42.7115 64.5385 39.3316 67.9166 35.1621 67.9166C30.9927 67.9166 27.6128 64.5385 27.6128 60.3714C27.6128 56.2042 30.9927 52.8261 35.1621 52.8261C39.3316 52.8261 42.7115 56.2042 42.7115 60.3714ZM17.5988 49.2997C17.5988 53.4669 14.2188 56.845 10.0494 56.845C5.87998 56.845 2.5 53.4669 2.5 49.2997C2.5 45.1326 5.87998 41.7544 10.0494 41.7544C14.2188 41.7544 17.5988 45.1326 17.5988 49.2997ZM17.5988 19.7927C17.5988 23.9599 14.2188 27.338 10.0494 27.338C5.87998 27.338 2.5 23.9599 2.5 19.7927C2.5 15.6256 5.87998 12.2474 10.0494 12.2474C14.2188 12.2474 17.5988 15.6256 17.5988 19.7927ZM41.2458 32.7571C41.2458 36.1224 38.5162 38.8504 35.1492 38.8504C31.7821 38.8504 29.0526 36.1224 29.0526 32.7571C29.0526 29.3919 31.7821 26.6639 35.1492 26.6639C38.5162 26.6639 41.2458 29.3919 41.2458 32.7571Z"
              stroke="#727272"
              stroke-width="4"
            />
          </svg>
        ),
      },
      {
        name: 'Improved Security and Transparency',
        description:
          "Web5's foundation on blockchain technology provides a robust security layer for DApps. Transactions and user data are immutably recorded on the blockchain, making it virtually impossible for unauthorized access or manipulation. This tamper-proof nature instills trust and confidence in DApp users, encouraging their adoption.",
        icon: (
          <svg width="66" height="76" viewBox="0 0 66 76" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M33 0.857117L65.5 8.00627V39.541C65.5 51.9251 57.0149 66.3382 34.1288 74.7289L33 75.1428L31.8712 74.7289C8.98514 66.3382 0.5 51.9251 0.5 39.541V8.00627L33 0.857117ZM7 13.1676V39.541C7 48.4395 12.9189 60.5513 33 68.2715C53.0811 60.5513 59 48.4395 59 39.541V13.1676L33 7.44829L7 13.1676Z"
              fill="#727272"
            />
          </svg>
        ),
      },
      {
        name: 'Ethical AI for User Well-being',
        description:
          "Web5's integration of ethical AI can enhance user experiences and well-being in DApps. AI algorithms can be designed to personalize content, provide tailored recommendations, and even offer behavioral insights, all while respecting user privacy and autonomy. This can lead to more engaging, productive, and enjoyable interactions within DApps.",
        icon: (
          <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M54.6667 11.3333V54.6667H11.3333V11.3333H54.6667ZM29.5722 22.1667H25.352L17.3397 43.8333H21.1471L22.6598 39.5977H32.251L33.7312 43.8333H37.7679L29.5722 22.1667ZM44.5263 22.1667H40.7342V43.8333H44.5263V22.1667ZM27.4301 25.8018L31.2073 36.6111H23.713L27.4301 25.8018ZM58.2778 43.8333H65.5V51.0556H58.2778V43.8333ZM14.9444 58.2778H22.1667V65.5H14.9444V58.2778ZM29.3889 58.2778H36.6111V65.5H29.3889V58.2778ZM14.9444 0.5H22.1667V7.72222H14.9444V0.5ZM43.8333 58.2778H51.0556V65.5H43.8333V58.2778ZM29.3889 0.5H36.6111V7.72222H29.3889V0.5ZM43.8333 0.5H51.0556V7.72222H43.8333V0.5ZM58.2778 29.3889H65.5V36.6111H58.2778V29.3889ZM0.5 43.8333H7.72222V51.0556H0.5V43.8333ZM58.2778 14.9444H65.5V22.1667H58.2778V14.9444ZM0.5 29.3889H7.72222V36.6111H0.5V29.3889ZM0.5 14.9444H7.72222V22.1667H0.5V14.9444Z"
              fill="#727272"
            />
          </svg>
        ),
      },
    ],
    isTourSeen: await localStorage.getItem('tour'),
  })
}

function Tour({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState()
  const [data, setData] = useState([])
  const [activeTour, setActiveTour] = useState(0)
  const navigate = useNavigate()

  const handleStart = () => {
    localStorage.setItem('tour', true)
    navigate('/home')
  }

  useEffect(() => {
    if (JSON.parse(loaderData.isTourSeen)) navigate('/home')
  }, [])

  return (
    <section className={styles.section}>
      <Suspense fallback={<TourShimmer />}>
        <Await
          resolve={loaderData.tour}
          errorElement={<div>Could not load data 😬</div>}
          children={(data) => (
            <>
              {activeTour > 0 && (
                <button onClick={() => setActiveTour((activeTour) => activeTour - 1)}>
                  <Icon name={`navigate_next`} />
                </button>
              )}

              {data
                .filter((item, i) => i == activeTour)
                .map((item, i) => (
                  <div className="d-flex flex-column align-items-center justify-content-center animate__animated animate__fadeIn" key={i}>
                    {item.icon}

                    <div className="d-flex flex-column align-items-center mt-50 mb-30" style={{ rowGap: '1rem' }}>
                      <b>{item.name}</b>
                      <p>{item.description}</p>
                    </div>

                    <div className={`${styles.pagination}`}>
                      {data.map((item, i) => (
                        <span className={`${activeTour == i ? styles.active : ''}`} key={i}></span>
                      ))}
                    </div>
                  </div>
                ))}

              {activeTour < 2 && (
                <button onClick={() => setActiveTour((activeTour) => activeTour + 1)}>
                  <Icon name={`navigate_next`} />
                </button>
              )}
              {activeTour === 2 && (
                <button onClick={() => handleStart()}>
                  <Icon name={`done`} />
                </button>
              )}
            </>
          )}
        />
      </Suspense>
    </section>
  )
}

const TourShimmer = () => {
  return (
    <Shimmer>
      <ul className={styles.shimmer}>
        <li></li>
        <li></li>
      </ul>
    </Shimmer>
  )
}

export default Tour
