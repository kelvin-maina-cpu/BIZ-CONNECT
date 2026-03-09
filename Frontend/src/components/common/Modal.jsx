import Modal from 'react-modal'

// Ensure aria is set properly; call this once at app startup.
Modal.setAppElement('#root')

export default function AppModal({ isOpen, onRequestClose, title, children, className = '' }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      className={`relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl outline-none ${className}`}
      closeTimeoutMS={200}
    >
      {title && <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>}
      {children}
      <button
        onClick={onRequestClose}
        className="absolute top-4 right-4 rounded-full bg-white/80 p-2 text-gray-600 hover:bg-white"
        aria-label="Close modal"
      >
        ✕
      </button>
    </Modal>
  )
}
