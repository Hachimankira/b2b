import { useCallback, useState } from "react";
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';

import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "../Columns/Cloumn";
import { BlockStack, Box, Button, Card, Checkbox, ChoiceList, Divider, Grid, InlineGrid, LegacyCard, Scrollable, Select, Tabs, Text, TextField } from "@shopify/polaris";
import './styles.css'
import { ModalPopup } from "../Modal/ModalPopup";
import fieldsData from "../../fields.json"

export default function DragAndDrop() {
    const shopify = useAppBridge();

    const [formHeading, setFormHeading] = useState('Registration Form')
    const [fields, setFields] = useState(fieldsData.fields);
    console.log("🚀 ~ DragAndDrop ~ fields:", fields)

    const [formValue, setFormValue] = useState({
        registration: 'auto',
        tags: '',
        redirectTo: '',
        redirectURL: '',
        emailNotification: '',
        taxExempt: '',
        reCaptcha: ''
    });
    console.log("🚀 ~ DragAndDrop ~ formValue:", formValue)

    // Predefined list of additional fields that the user can add
    const availableFields = fieldsData.availableFields

    const handleAddField = (field) => {
        // Add the selected field to the list of fields and set 'active' to true
        setFields((prevFields) => [
            ...prevFields,
            { ...field, active: true } // Spread the field and add 'active: true'
        ]);
    };

    const handleRemoveField = (fieldId) => {
        setFields((prevFields) => prevFields.filter(field => field.id !== fieldId));
    };

    const handleChangeField = (fieldId, key, value) => {
        console.log("hello")
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === fieldId ? { ...field, [key]: value } : field
            )
        );
    };


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const getTaskPos = (id) => fields.findIndex((task) => task.id === id);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id === over.id) return;

        setFields((fields) => {
            const originalPos = getTaskPos(active.id);
            const newPos = getTaskPos(over.id);
            console.log("🚀 ~ setFields ~ newPos:", newPos, 'for field ', active.id)

            // Reorder the fields
            const updatedFields = arrayMove(fields, originalPos, newPos);

            // Update the position value based on new order
            return updatedFields.map((field, index) => ({
                ...field,
                position: index + 1, // Set new position starting from 1
            }));
        });
    };

    // code for tabs
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        // form field ui here
        {
            label: "Form Fields",
            content: (
                <div className="tab-content">
                    <Scrollable shadow style={{ height: '65vh' }} focusable>
                        <div className="fields-container">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCorners}
                                onDragEnd={handleDragEnd}
                            >
                                <Column
                                    fields={fields}
                                    handleRemoveField={handleRemoveField}
                                    setFields={setFields}
                                    handleChangeField={handleChangeField}
                                />
                            </DndContext>
                        </div>
                    </Scrollable>
                    <div className="modal-container">
                        <ModalPopup
                            btn_text="Add More fields"
                            activeFields={fields}
                            availableFields={availableFields}
                            handleAddField={handleAddField}
                        />
                    </div>
                </div>
            )
        },
        // Advance setting ui here
        {
            label: "Advanced Settings",
            content: (
                <div className="tab-content">
                    <Scrollable shadow style={{ height: '75vh' }} focusable>
                        <h3 className="settings-title">Advanced Settings</h3>
                        <BlockStack gap="200">
                            <Card>
                                <BlockStack gap="500">
                                    <Text variant="headingMd" as="h1">Registration</Text>

                                    <div>
                                        <Text variant="headingSm" as="h2">Registration Approval</Text>
                                        <ChoiceList
                                            name="registration"
                                            choices={[
                                                { label: 'Manual approve customer after registration', value: 'manual' },
                                                { label: 'Auto-approval after registration', value: 'auto' },
                                            ]}
                                            selected={formValue.registration}
                                            onChange={(value) => setFormValue({ ...formValue, registration: value })}
                                        />
                                    </div>
                                    <div>
                                        <Text variant="headingSm" as="h2">Email Notification</Text>
                                        <Checkbox
                                            name="emailNotification"
                                            label="Send Confirmation or Rejection email after registration."
                                            checked={formValue.emailNotification}
                                            onChange={(value) => setFormValue({ ...formValue, emailNotification: value })}
                                        />
                                    </div>
                                    <div>
                                        <Text variant="headingSm" as="h2">Redirect Customer to?</Text>
                                        <ChoiceList
                                            name="redirectTo"
                                            choices={[
                                                { label: 'Login Page', value: 'loginPage' },
                                                { label: 'Custom URL', value: 'customURL' },
                                            ]}
                                            selected={formValue.redirectTo}
                                            onChange={(value) => setFormValue({ ...formValue, redirectTo: value })}
                                        />
                                        {formValue.redirectTo.includes("customURL") && (
                                            <>
                                                <Text variant="headingSm" as="h2">Redirect Url</Text>
                                                <TextField
                                                    name="redirectURL"
                                                    value={formValue.redirectURL}
                                                    onChange={(value) => setFormValue({ ...formValue, redirectURL: value })}
                                                    placeholder="https://yourstore.com/"
                                                />
                                            </>
                                        )}
                                    </div>
                                </BlockStack>
                            </Card>

                            <Card>
                                <BlockStack gap="500">
                                    <Text variant="headingMd" as="h1">Tags</Text>
                                    <div>
                                        <Text as="p" variant="bodyMd">
                                            Assign these tags after registration
                                        </Text>
                                        <TextField
                                            name="tags"
                                            value={formValue.tags}
                                            onChange={(value) => setFormValue({ ...formValue, tags: value })}
                                        />
                                    </div>
                                </BlockStack>
                            </Card>

                            <Card>
                                <BlockStack gap="500">
                                    <Text variant="headingMd" as="h1">Taxes</Text>
                                    <Checkbox
                                        name="taxExempt"
                                        label="Auto exempt tax for customer registered with this form."
                                        checked={formValue.taxExempt}
                                        onChange={(value) => setFormValue({ ...formValue, taxExempt: value })}
                                    />
                                </BlockStack>
                            </Card>

                            <Card>
                                <BlockStack gap="500">
                                    <Text variant="headingMd" as="h1">Spam protection</Text>
                                    <Checkbox
                                        name="reCaptcha"
                                        label="Enable reCAPTCHA"
                                        checked={formValue.reCaptcha}
                                        onChange={(value) => setFormValue({ ...formValue, reCaptcha: value })}
                                    />
                                </BlockStack>
                            </Card>
                        </BlockStack>
                    </Scrollable>
                </div>
            )
        }
    ];

    return (
        <Grid gap={800}>
            <Grid.Cell columnSpan={{ sm: 6, md: 4, lg: 4 }}>
                <BlockStack gap="500">
                    <div className="tabs-wrapper">
                        <div className="tabs-navigation">
                            <nav className="tabs-nav">
                                {tabs.map((tab, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTab(index)}
                                        className={`tab-button ${activeTab === index ? 'active' : ''}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="tabs-content">

                            {tabs[activeTab].content}
                        </div>
                    </div>
                </BlockStack>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ sm: 6, md: 8, lg: 8 }}>
                <Card>
                    <Scrollable shadow style={{ height: '80vh' }} focusable>
                        <BlockStack gap='500'>
                            <div className="container">
                                <div className="formfield">
                                    <h1>{formHeading}</h1>
                                    <form>
                                        {fields
                                            .filter((field) => field.active) // Show only active fields
                                            .map((field) => (
                                                // const req = field.required
                                                <div key={field.id} className="form-group">
                                                    <label>{field.title}</label>
                                                    <input
                                                        type={field.type}
                                                        placeholder={field.placeholder}
                                                        required
                                                    // {...(field.required === 'true' && "required")} // Only add required if true
                                                    />
                                                </div>
                                            ))}

                                        <button type="submit">Register</button>
                                    </form>
                                </div>
                            </div>
                        </BlockStack>
                    </Scrollable>
                </Card>
            </Grid.Cell>
        </Grid>
    );
}