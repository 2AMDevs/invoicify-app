import React, { useState } from 'react'

import {
  DefaultButton, IconButton, Modal,
  Stack, TextField,
} from 'office-ui-fabric-react'
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown'

import { getProductTypes, upsertProduct } from '../../services/dbService'
import { makeHash } from '../../utils/utils'
import './index.scss'

const ProductForm = ({
  isModalOpen, hideModal, fetchItems, product,
}) => {
  const [name, setName] = useState(product?.name ?? '')
  const [type, setType] = useState(product?.type ?? '')
  const [price, setPrice] = useState(product?.price ?? 0)

  const changeName = (_, val) => setName(val)
  const changePrice = (_, val) => setPrice(val)

  const changeType = (_, val) => setType(val.key)

  const resetForm = () => {
    setName('')
    setType('')
    setPrice('')
  }

  const saveForm = () => {
    const id = product?.id ?? makeHash()
    upsertProduct({
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
              label="Price"
              required
              type="number"
              placeholder="Product Price"
              value={price}
              onChange={changePrice}
            />
            <Dropdown
              placeholder="Product Type"
              required
              label="Type"
              options={getProductTypes()}
              value={type}
              selectedKey={type}
              onChange={changeType}
            />
            <br />
            <Stack
              horizontal
              tokens={{ childrenGap: 25 }}
            >
              <DefaultButton
                text="Save"
                iconProps={{ iconName: 'Save' }}
                primary
                onClick={saveForm}
                disabled={!name || !type || !parseInt(price, 10) > 0}
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
