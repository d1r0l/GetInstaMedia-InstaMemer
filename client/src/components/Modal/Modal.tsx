import { useRef, useEffect, useState } from 'react'
import style from './Modal.module.css'

//TODO: Fix overflow on mobile

enum ModalCloseMethod {
  none = 0,
  button = 1,
  click = 2
}

interface ModalProps {
  isOpen: boolean
  closeMethod?: ModalCloseMethod
  onClose?: () => void
  children: JSX.Element
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  closeMethod = ModalCloseMethod.button,
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
    if (closeMethod === ModalCloseMethod.click)
      if (event.key === 'Enter') handleCloseModal()
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
    <dialog
      ref={modalRef}
      onKeyDown={handleKeyDown}
      className={style.modal}
      {...(closeMethod === ModalCloseMethod.click
        ? {
            autofocus: true,
            tabIndex: 0
          }
        : {})}
    >
      <div
        {...(closeMethod === ModalCloseMethod.click
          ? { onClick: handleCloseModal }
          : {})}
      >
        {closeMethod === ModalCloseMethod.button && (
          <button
            className={style.modalCloseButton}
            onClick={handleCloseModal}
            autoFocus={true}
          >
            ✖
          </button>
        )}
        {children}
      </div>
    </dialog>
  )
}

export default Modal
