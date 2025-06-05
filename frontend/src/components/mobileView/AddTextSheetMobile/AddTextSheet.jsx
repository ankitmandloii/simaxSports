import { Sheet } from 'react-modal-sheet';
// import AddTextToolbar from '../../Toolbar/AddTextToolbar/AddTextToolbar';
import { IoClose } from 'react-icons/io5';

export default function AddTextSheet({ isOpen, setIsOpen, sheetContaint, snap }) {
    // const [isOpen, setIsOpen] = useState(true);
    return (
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} snapPoints={[snap]} disableDrag>
            <Sheet.Container>
                <Sheet.Header />
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'none',
                        border: 'none',
                        fontSize: 24,
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                    aria-label="Close"
                >
                    <IoClose />
                </button>
                <Sheet.Content>
                    <Sheet.Scroller>
                        {sheetContaint}
                    </Sheet.Scroller>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
        </Sheet>
    );
}
