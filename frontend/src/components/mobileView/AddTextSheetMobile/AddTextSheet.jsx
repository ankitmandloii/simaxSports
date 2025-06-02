import React, { useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import AddTextToolbar from '../../Toolbar/AddTextToolbar/AddTextToolbar';

export default function AddTextSheet({ isOpen, setIsOpen,sheetContaint }) {
    // const [isOpen, setIsOpen] = useState(true);
    return (
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} snapPoints={[900,500,200, 0]}>
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                    <Sheet.Scroller>
                       { sheetContaint}
                    </Sheet.Scroller>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
        </Sheet>
    );
}
