import { Title } from './helper/DocumentTitle'
import {Link} from 'react-router-dom'
import styles from './About.module.scss'
import Heading from './helper/Heading'
import { PopupButton } from '@typeform/embed-react'

const data = [
  {
    q: 'What is DeezStealth?',
    a: '🆙 UPcard is a dApp that helps users create colorful QRCode and NFT2.0 based on a users info on Lukso',
  },
  {
    q: 'How does it work?',
    a: 'Users need to connect their UP to the dapp the mint their NFT by cutomizing token name, symbol, and count',
  },
  {
    q: 'What Networks does it support?',
    a: 'Currently, Lukso network. Will add Lukso LSPs on all chians',
  },
]


export default function About({ title }) {
  Title(title)

  return (
    <section className={styles.section}>
      <div className={`__container ms-motion-slideUpIn ${styles.container}`} data-width={`large`}>
        <div className={`card ms-depth-4 text-justify`}>
          <div className="card__header">
            <h4>About Us</h4>
          </div>
          <div className="card__body">
         <p>
         Generate a colorful QRCode and NFT2.0 based on a users info on <a href='https://lukso.network/'>Lukso</a> network using data stored on the brand new Universal Profiles <a href='https://universalprofile.cloud/'>(UP)</a> powered by <a href='https://erc725alliance.org/'>ERC725</a>
         </p>
          </div>
        </div>


      </div>
    </section>
  )
}
