
import { Sheet } from 'react-modal-sheet';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function AddTextSheet({ isOpen, setIsOpen, sheetContaint, snap }) {
  const navigate = useNavigate();
  const snapPoint = (snap === 600 ? [600, 500, 400, 300, 200] : [1200, 800, 700, 600, 500, 400, 300])
  return (
    <Sheet
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        // navigate('/design/product');
      }}

      snapPoints={snapPoint}

    >
      <Sheet.Container>
        {/* ✅ Header is draggable */}
        <Sheet.Header />

        {/* ❌ Close button should not overlap drag area */}
        <button
          onClick={() => {
            setIsOpen(false);
            // navigate('/design/product');
          }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            zIndex: 10,
          }}
          aria-label="Close"
        >
          <IoClose />
        </button>

        {/* ✅ Content should NOT be draggable */}
        <Sheet.Content disableDrag>
          {/* ✅ This wrapper makes the inner content scrollable */}
          <Sheet.Scroller
            style={{
              height: '100%',
              overflowY: 'auto',
              paddingBottom: 80, // adjust if footer/keyboard overlaps
              WebkitOverflowScrolling: 'touch', // for iOS smoothness
            }}
          >
            {sheetContaint}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop />
    </Sheet>
  );
}
