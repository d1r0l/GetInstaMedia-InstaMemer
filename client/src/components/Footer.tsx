import { useState } from 'react'
import DisclaimerModal from './Modals/DIsclaimerModal'
import style from './Footer.module.css'

const Footer: React.FC = () => {
  const [isDisclaimerOpen, setDisclaimerOpen] = useState(false)

  return (
    <footer className={style.footer}>
      <button
        className={style.disclaimerButton}
        onClick={() => setDisclaimerOpen(true)}
        tabIndex={0}
      >
        Disclaimer
      </button>
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
      />
    </footer>
  )
}

export default Footer
