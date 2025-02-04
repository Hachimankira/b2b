import {
  Page,
  Layout,
  Card,
  BlockStack,
  Tabs,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useCallback, useState } from "react";

const Registration = () => {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'registration-form-1',
      content: 'Registration Form',
      accessibilityLabel: 'Registration Form',
      panelID: 'registration-form-content-1',
    },
    {
      id: 'register-management-1',
      content: 'Register Management',
      panelID: 'register-management-content-1',
    },
  ];
  return (
    <Page>
      <TitleBar title="Remix app template">
      </TitleBar>

      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <Card title={tabs[selected].content}>
                <p>{tabs[selected].content}</p>
              </Card>
            </Tabs>
          </Layout.Section>

          <Layout.Section>
            <Card>
            </Card>
          </Layout.Section>

        </Layout>
      </BlockStack>
    </Page>
  )
}

export default Registration