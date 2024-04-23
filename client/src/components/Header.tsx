import style from './Header.module.css'

const Header = () => {
  return (
    <header className={style.header}>
      <a className={style.logoLink} href='/'>
        <img
          className={style.logo}
          src='./getinstamedia.svg'
          alt='GetInstaMedia'
        />
      </a>
    </header>
  )
}

export default Header
