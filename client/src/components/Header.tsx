import { baseUrl } from '../config'
import style from './Header.module.css'

const Header = (): JSX.Element => {
  return (
    <header className={style.header}>
      <h1>
        <a className={style.logoLink} href={baseUrl}>
          <img
            className={style.logo}
            src='./getinstamedia.svg'
            alt='GetInstaMedia'
          />
        </a>
      </h1>
    </header>
  )
}

export default Header
