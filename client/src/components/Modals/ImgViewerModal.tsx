import Modal from './Modal'
import style from './ImgViewerModal.module.css'

interface ImgVieverModalProps {
  url: string
  isOpen: boolean
  onClose: () => void
}

const ImgVieverModal: React.FC<ImgVieverModalProps> = ({
  url,
  isOpen,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} hasCloseButton={false} onClose={() => onClose()}>
      <div className={style.container}>
        <img className={style.image} src={url} crossOrigin='anonymous' />
      </div>
    </Modal>
  )
}

export default ImgVieverModal
