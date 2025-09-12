import React from 'react';
import IconButton from '../ui/IconButton';

export default function SectionHeader({
    title,
    mode,
    onEdit,
    onCancel,
    onSave,
    saveDisabled,
}) {
    return (
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{title}</h3>
            {mode === 'read' ? (
                <IconButton onClick={onEdit}>Edit</IconButton>
            ) : (
                <div className="flex gap-2">
                    <IconButton variant="ghost" onClick={onCancel}>
                        Cancel
                    </IconButton>
                    <IconButton
                        variant="primary"
                        onClick={onSave}
                        disabled={saveDisabled}
                    >
                        Save
                    </IconButton>
                </div>
            )}
        </div>
    );
}
