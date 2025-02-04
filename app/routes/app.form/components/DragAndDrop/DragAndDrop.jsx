import { useState } from "react";
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
import { BlockStack, Button, Card, InlineGrid } from "@shopify/polaris";
import './styles.css'
import { ModalPopup } from "../Modal/ModalPopup";


export default function DragAndDrop() {
    const shopify = useAppBridge();

    const [formHeading, setFormHeading] = useState('Registration Form')
    const [fields, setFields] = useState([
        { id: 1, title: "First Name", active: true, type: 'text', required: true },
        { id: 2, title: "Second Name", active: true, type: 'text', required: true },
        { id: 3, title: "Email", active: true, type: 'email', required: true },
        { id: 4, title: "Password", active: true, type: 'password', required: true },
    ]);
    console.log("🚀 ~ DragAndDrop ~ fields:", fields)

    // Predefined list of additional fields that the user can add
    const availableFields = [
        { id: 5, title: "Business Name", type: 'text', required: false },
        { id: 6, title: "Country", type: 'text', required: false },
        { id: 7, title: "State", type: 'text', required: false },
        { id: 8, title: "City", type: 'text', required: false },
        { id: 9, title: "Zip", type: 'text', required: false },
        { id: 10, title: "VAT ID", type: 'text', required: false },
    ];

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
            console.log("🚀 ~ setFields ~ newPos:", newPos)

            return arrayMove(fields, originalPos, newPos);
        });
    };

    return (
        <InlineGrid gap='400' columns={['oneThird', 'twoThirds']}>
            <Card>
                <BlockStack gap="500">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragEnd={handleDragEnd}
                    >
                        <Column fields={fields} handleRemoveField={handleRemoveField} setFields={setFields}/>
                    </DndContext>
                    <ModalPopup
                        btn_text="Add More fields"
                        activeFields={fields}
                        availableFields={availableFields}
                        handleAddField={handleAddField}
                    />

                </BlockStack>
            </Card>
            <Card>
                <BlockStack gap='500'>
                    <div className="formfield">
                        <div className="container">
                            <h1>{formHeading}</h1>
                            <form>
                                {fields
                                    .filter((field) => field.active) // Show only active fields
                                    .map((field) => (
                                        <div key={field.id} className="form-group">
                                            <label>{field.title}</label>
                                            <input type={field.type} placeholder={`Enter ${field.title}`} />
                                        </div>
                                    ))}

                                <button type="submit">Register</button>
                            </form>
                        </div>
                    </div>
                </BlockStack>
            </Card>
        </InlineGrid>
    );
}