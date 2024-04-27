import Modal from './Modal/Modal'
import style from './DisclaimerModal.module.css'

interface DisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <div className={style.container}>
        <h2 className={style.title}>Disclaimer</h2>
        <div className={style.content}>
          <p>
            Author of this service is not responsible for any violation of
            applicable laws, rules, or regulations committed by you or a third
            party at your behest.
          </p>
          <p>
            This tool was designed to help you download videos and images
            uploaded by your own account. The author of this service is not
            responsible if you use this tools to infringe upon others people
            privacy and material.
          </p>
          <p>
            The content and materials on GetInstaMedia service are provided "as
            is". The author of this service makes no warranties, expressed or
            implied, and hereby disclaims and negates all other warranties,
            including without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of
            rights. Further, the author of this service does not warrant or make
            any representations concerning the accuracy, likely results, or
            reliability of the use of the content and materials on its website
            or otherwise relating to such content and materials or on any sites
            linked to the site.
          </p>
          <p>
            Author of this website is not affiliated with Instagram or Meta.
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default DisclaimerModal
