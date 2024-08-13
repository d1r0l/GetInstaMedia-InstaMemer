import { useRef, useEffect, useState } from 'react'
import style from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  hasCloseButton?: boolean
  onClose?: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  hasCloseButton = true,
  onClose,
  children
}) => {
  const modalRef: React.RefObject<HTMLDialogElement> | null = useRef(null)
  const [isModalOpen, setModalOpen] = useState(isOpen)
  const [focused, setFocused] = useState(false)

  const onFocus = () => setFocused(true)

  const ignoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleCloseModal = () => {
    document.body.style.overflow = 'auto'
    if (onClose) {
      onClose()
    }
    setModalOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasCloseButton) if (focused && e.key === 'Enter') handleCloseModal()
    if (e.key === 'Escape') {
      handleCloseModal()
    }
  }

  useEffect(() => {
    setModalOpen(isOpen)
    if (isOpen) document.body.style.overflow = 'hidden'
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
      onClick={handleCloseModal}
      className={`${style.modal} ${style.clickable}`}
      autoFocus={hasCloseButton}
      tabIndex={hasCloseButton ? undefined : 0}
      onFocus={onFocus}
    >
      <div
        className={
          hasCloseButton ? `${style.container} ${style.unclickable}` : ''
        }
        onClick={hasCloseButton ? ignoreClick : handleCloseModal}
      >
        {children}
        {hasCloseButton && (
          <button
            className={style.modalCloseButton}
            onClick={handleCloseModal}
            autoFocus={true}
          >
            Close
          </button>
        )}
      </div>
    </dialog>
  )
}

export default Modal
