import { useRef, useEffect, useState } from 'react'
import style from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  hasCloseBtn?: boolean
  onClose?: () => void
  children: JSX.Element
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  hasCloseBtn = true,
  onClose,
  children
}) => {
  const [isModalOpen, setModalOpen] = useState(isOpen)
  const modalRef: React.RefObject<HTMLDialogElement> | null = useRef(null)

  const handleCloseModal = () => {
    if (onClose) {
      onClose()
    }
    setModalOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModal()
    }
  }

  useEffect(() => {
    setModalOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    const modalElement = modalRef.current

    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal()
      } else {
        modalElement.close()
      }
    }
  }, [isModalOpen])

  return (
    <dialog ref={modalRef} onKeyDown={handleKeyDown} className={style.modal}>
      <div>
        {hasCloseBtn && (
          <button className={style.modalCloseButton} onClick={handleCloseModal}>
            ✖
          </button>
        )}
        {children}
      </div>
    </dialog>
  )
}

export default Modal
