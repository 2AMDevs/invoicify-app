import React from 'react'

import {
  Modal,
  IconButton,
} from 'office-ui-fabric-react'

const ProductForm = ({ isModalOpen, hideModal }) => {
  return (
    <div className="product-form">
      <Modal
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
      >
        <div className="product-form__title">
          <span>Create new product</span>
          <IconButton
            iconProps="Cancel"
            ariaLabel="Close form"
            onClick={hideModal}
          />
        </div>
        <div className="product-form__body">
          <p>
            Lorem ipsum
          </p>
          <p>
            Mauris at nunc eget lectus
          </p>
          <p>
            Sed condiment
          </p>
          <p>
            Aenean
          </p>
          <p>
            Nam id
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default ProductForm
