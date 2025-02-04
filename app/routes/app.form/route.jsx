import {
  Page,
  Layout,
  Card,
  BlockStack,
} from '@shopify/polaris'
import React, { useState } from "react";
import DragAndDrop from './components/DragAndDrop/DragAndDrop';

const RegistrationForm = () => {

  return (
    <Page
      title='Registration Form'
      fullWidth
    >
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <DragAndDrop />
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  )
}

export default RegistrationForm