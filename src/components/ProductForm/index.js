import React, { useState } from 'react'

import {
  Modal,
  IconButton,
  TextField,
  DefaultButton,
  Stack,
} from 'office-ui-fabric-react'

import { setProduct } from '../../utils/helper'

import './index.scss'

const ProductForm = ({
  isModalOpen, hideModal, fetchItems, product,
}) => {
  const [name, setName] = useState(product?.name ?? '')
  const [id, setId] = useState(product?.id ?? '')
  const [type, setType] = useState(product?.type ?? '')
  const [price, setPrice] = useState(product?.price ?? '')

  const changeName = (_, val) => setName(val)

  const changeId = (_, val) => {
    // check for unique id
    setId(val)
  }

  const changeType = (_, val) => setType(val)

  const changePrice = (_, val) => setPrice(val)

  const resetForm = () => {
    setName('')
    setPrice('')
    setType('')
    setId('')
  }

  const saveForm = () => {
    setProduct({
      name, id, type, price,
    })
    if (fetchItems) fetchItems()
    if (hideModal) hideModal()
    resetForm()
  }

  return (
    <div className="product-form">
      <Modal
        containerClassName="animation-slide-up product-form__modal"
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
      >
        <div className="product-form__title">
          <span>Create new product</span>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel="Close form"
            onClick={hideModal}
          />
        </div>
        <div className="product-form__body">
          <Stack>
            <TextField
              label="Name"
              required
              placeholder="Name of the product"
              value={name}
              onChange={changeName}
            />
            <TextField
              label="id"
              required
              placeholder="id of the product"
              value={id}
              onChange={changeId}
              disabled={!!product}
            />
            <Stack
              horizontal
              tokens={{ childrenGap: 15 }}
            >
              <TextField
                label="Type"
                required
                placeholder="Type of the product"
                value={type}
                onChange={changeType}
              />
              <TextField
                label="Price"
                required
                placeholder="Price of the product"
                value={price}
                onChange={changePrice}
              />
            </Stack>

            <Stack
              horizontal
              tokens={{ childrenGap: 25 }}
            >
              <DefaultButton
                text="Save"
                iconProps={{ iconName: 'Save' }}
                primary
                onClick={saveForm}
              />
              <DefaultButton
                text="Reset"
                iconProps={{ iconName: 'refresh' }}
                onClick={resetForm}
              />
            </Stack>
          </Stack>
        </div>
      </Modal>
    </div>
  )
}

export default ProductForm
